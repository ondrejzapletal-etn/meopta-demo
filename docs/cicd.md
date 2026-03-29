# CI/CD Process

## Overview

This project uses GitLab CI/CD with templates from the `cicd/gitlab/gitlab-ci-templates` repository. The pipeline is configured to build applications, perform quality checks, and optionally publish or deploy them.

## Default Pipeline Behavior

By default, the CI/CD pipeline performs the following operations:

1. **Build Stage** - Builds all applications in the monorepo
2. **Quality Control Stage** - Runs dependency checks and SonarQube scans
3. **Publish Stage** - Container image publication (optional)
4. **Deploy Stage** - Application deployment (optional)

## Enabling Deployment

### For Containerized Applications

To deploy containerized applications to container registries (e.g., Kubernetes, AKS), uncomment the `publish-*` jobs in `.gitlab-ci.yml`:

```yaml
# Uncomment these sections:
publish-app-image-cms:
  extends:
    - .publish-app-image
    - .run-manually-on-release-branch-only
  variables:
    EXTRA_BUILD_ARGS: |
      WORKSPACE=apps/cms
      LABEL_TITLE=cms
      LABEL_DESCRIPTION=payload-cms

publish-app-image-fe:
  extends:
    - .publish-app-image
    - .run-manually-on-release-branch-only
  variables:
    EXTRA_BUILD_ARGS: |
      WORKSPACE=apps/fe
      LABEL_TITLE=fe
      LABEL_DESCRIPTION=nextjs-fe
```

These jobs will:
- Build container images using Podman using the `Dockerfile`
- Publish images to the container registry
- Run manually on release branch only

### For On-Premise Deployment

To deploy to on-premise servers running Node.js, uncomment the `deploy-*` jobs in `.gitlab-ci.yml`:

```yaml
# Uncomment these sections:
.deploy-environment:
  extends:
    - .run-manually-on-merge-request
  variables:
    SSH_REMOTE: cicd@server.etn

deploy-cms-dev:
  stage: Deploy
  extends:
    - .deploy-environment
    - .deploy-job-cms

deploy-fe-dev:
  stage: Deploy
  extends:
    - .deploy-environment
    - .deploy-job-frontend
```

These jobs will:
- Deploy built applications to `/srv/node/{cms|fe}/app` on the target server
- Use SSH to copy artifacts to the remote server
- Create symlinks to the latest build

**Note**: Update `SSH_REMOTE` variable to point to your server
