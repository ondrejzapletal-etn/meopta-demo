#!/usr/bin/env bash
#
# Azure resource provisioning for airbank-demo.
# Run once to create all required infrastructure.
#
# Prerequisites:
#   - az CLI authenticated (az login)
#   - Subscription selected (az account set -s <subscription-id>)
#
# Usage:
#   bash scripts/azure-setup.sh
#
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
RESOURCE_GROUP="etnc-airbankWeb-poc"
LOCATION="westeurope"

ACR_NAME="airbankwebacr"
ENV_NAME="airbank-env"
PG_SERVER="airbank-postgres"
PG_ADMIN_USER="airbankadmin"
PG_ADMIN_PASSWORD="${PG_ADMIN_PASSWORD:?Set PG_ADMIN_PASSWORD env var before running}"
PG_DB_NAME="airbank"
STORAGE_NAME="airbankwebstorage"
STORAGE_CONTAINER="media"

CMS_APP_NAME="airbank-cms"
FE_APP_NAME="airbank-fe"

PAYLOAD_SECRET="${PAYLOAD_SECRET:?Set PAYLOAD_SECRET env var before running}"
PREVIEW_SECRET="${PREVIEW_SECRET:?Set PREVIEW_SECRET env var before running}"

echo "==> Provisioning Azure resources in ${RESOURCE_GROUP} (${LOCATION})"

# ── 1. Container Registry ────────────────────────────────────────────────────
echo "==> Creating Container Registry: ${ACR_NAME}"
az acr create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$ACR_NAME" \
  --sku Basic \
  --admin-enabled true \
  --location "$LOCATION" \
  --output json

ACR_PASSWORD=$(az acr credential show \
  --name "$ACR_NAME" \
  --query "passwords[0].value" \
  --output tsv)

echo "    ACR admin password retrieved."

# ── 2. Container App Environment ─────────────────────────────────────────────
echo "==> Creating Container App Environment: ${ENV_NAME}"
az containerapp env create \
  --name "$ENV_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output json

# ── 3. PostgreSQL Flexible Server ─────────────────────────────────────────────
echo "==> Creating PostgreSQL Flexible Server: ${PG_SERVER}"
az postgres flexible-server create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$PG_SERVER" \
  --location "$LOCATION" \
  --admin-user "$PG_ADMIN_USER" \
  --admin-password "$PG_ADMIN_PASSWORD" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 16 \
  --yes \
  --output json

echo "==> Allowing Azure services to access PostgreSQL"
az postgres flexible-server firewall-rule create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$PG_SERVER" \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0 \
  --output json

echo "==> Creating database: ${PG_DB_NAME}"
az postgres flexible-server db create \
  --resource-group "$RESOURCE_GROUP" \
  --server-name "$PG_SERVER" \
  --database-name "$PG_DB_NAME" \
  --output json

DATABASE_URI="postgresql://${PG_ADMIN_USER}:${PG_ADMIN_PASSWORD}@${PG_SERVER}.postgres.database.azure.com/${PG_DB_NAME}?sslmode=require"

# ── 4. Storage Account ───────────────────────────────────────────────────────
echo "==> Creating Storage Account: ${STORAGE_NAME}"
az storage account create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$STORAGE_NAME" \
  --location "$LOCATION" \
  --sku Standard_LRS \
  --kind StorageV2 \
  --access-tier Hot \
  --output json

STORAGE_CONNECTION_STRING=$(az storage account show-connection-string \
  --resource-group "$RESOURCE_GROUP" \
  --name "$STORAGE_NAME" \
  --query connectionString \
  --output tsv)

echo "==> Creating blob container: ${STORAGE_CONTAINER}"
az storage container create \
  --name "$STORAGE_CONTAINER" \
  --account-name "$STORAGE_NAME" \
  --public-access blob \
  --output json

# ── 5. Container App: CMS ────────────────────────────────────────────────────
echo "==> Creating Container App: ${CMS_APP_NAME}"
az containerapp create \
  --name "$CMS_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$ENV_NAME" \
  --image "${ACR_NAME}.azurecr.io/airbank-cms:latest" \
  --registry-server "${ACR_NAME}.azurecr.io" \
  --registry-username "$ACR_NAME" \
  --registry-password "$ACR_PASSWORD" \
  --target-port 3000 \
  --ingress external \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 1 \
  --max-replicas 3 \
  --secrets \
    "database-uri=${DATABASE_URI}" \
    "payload-secret=${PAYLOAD_SECRET}" \
    "azure-storage-conn=${STORAGE_CONNECTION_STRING}" \
    "preview-secret=${PREVIEW_SECRET}" \
  --env-vars \
    "DATABASE_URI=secretref:database-uri" \
    "PAYLOAD_SECRET=secretref:payload-secret" \
    "AZURE_STORAGE_CONNECTION_STRING=secretref:azure-storage-conn" \
    "AZURE_STORAGE_CONTAINER_NAME=${STORAGE_CONTAINER}" \
    "AZURE_STORAGE_BASE_URL=https://${STORAGE_NAME}.blob.core.windows.net" \
    "PREVIEW_SECRET=secretref:preview-secret" \
    "NODE_ENV=production" \
  --output json

CMS_FQDN=$(az containerapp show \
  --name "$CMS_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

# Update CMS with its own FQDN and FE URL
echo "==> Updating CMS env vars with FQDNs"

# ── 6. Container App: FE ─────────────────────────────────────────────────────
echo "==> Creating Container App: ${FE_APP_NAME}"
az containerapp create \
  --name "$FE_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$ENV_NAME" \
  --image "${ACR_NAME}.azurecr.io/airbank-fe:latest" \
  --registry-server "${ACR_NAME}.azurecr.io" \
  --registry-username "$ACR_NAME" \
  --registry-password "$ACR_PASSWORD" \
  --target-port 3000 \
  --ingress external \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 1 \
  --max-replicas 3 \
  --secrets \
    "preview-secret=${PREVIEW_SECRET}" \
  --env-vars \
    "CMS_URL=https://${CMS_FQDN}" \
    "PREVIEW_SECRET=secretref:preview-secret" \
    "NODE_ENV=production" \
  --output json

FE_FQDN=$(az containerapp show \
  --name "$FE_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

# Update CMS with both FQDNs now that we know them
echo "==> Updating CMS with CMS_URL and FE_URL"
az containerapp update \
  --name "$CMS_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --set-env-vars \
    "CMS_URL=https://${CMS_FQDN}" \
    "FE_URL=https://${FE_FQDN}" \
  --output json

# ── 7. Service Principal for GitHub Actions ───────────────────────────────────
echo "==> Creating Service Principal for GitHub Actions"
SUBSCRIPTION_ID=$(az account show --query id --output tsv)

SP_JSON=$(az ad sp create-for-rbac \
  --name "airbank-demo-github" \
  --role Contributor \
  --scopes "/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}" \
  --sdk-auth)

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "============================================================"
echo "  Azure provisioning complete!"
echo "============================================================"
echo ""
echo "  CMS:  https://${CMS_FQDN}/admin"
echo "  FE:   https://${FE_FQDN}"
echo ""
echo "  Configure these GitHub Secrets:"
echo ""
echo "  AZURE_CREDENTIALS:"
echo "  ${SP_JSON}"
echo ""
echo "  ACR_USERNAME: ${ACR_NAME}"
echo "  ACR_PASSWORD: ${ACR_PASSWORD}"
echo ""
echo "  PAYLOAD_SECRET: ${PAYLOAD_SECRET}"
echo "  DATABASE_URI: ${DATABASE_URI}"
echo "  AZURE_STORAGE_CONNECTION_STRING: ${STORAGE_CONNECTION_STRING}"
echo "  PREVIEW_SECRET: ${PREVIEW_SECRET}"
echo ""
echo "============================================================"
