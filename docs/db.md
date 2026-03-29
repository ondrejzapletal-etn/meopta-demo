# Database Configuration

## How to Change Database from PostgreSQL to MongoDB in Payload CMS

To switch from PostgreSQL to MongoDB in the apps/cms workspace, you need to make the following changes:

### 1. Update Package Dependencies

In `apps/cms/package.json`:

**Remove:**
- `@payloadcms/db-postgres`
- `@opentelemetry/instrumentation-pg`

**Add:**
- `@payloadcms/db-mongodb`
- `@opentelemetry/instrumentation-mongodb`

### 2. Update Payload Configuration

In `apps/cms/src/payload.config.ts`:

**Change the import:**
```typescript
// FROM:
import { postgresAdapter } from '@payloadcms/db-postgres';

// TO:
import { mongooseAdapter } from '@payloadcms/db-mongodb';
```

**Change the db adapter:**
```typescript
// FROM:
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URI || '',
  },
}),

// TO:
db: mongooseAdapter({
  url: process.env.DATABASE_URI || '',
}),
```

### 4. Update instrumentation

In `apps/cms/src/instrumentation.node.ts`:

**Change the import:**
```typescript
// FROM:
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';

// TO:
import { MongoDBInstrumentation } from '@opentelemetry/instrumentation-mongodb';
```

**Swap the instrumentations:**
```typescript
// FROM:
instrumentations: [..., new PgInstrumentation()]

// TO:
instrumentations: [..., new MongoDBInstrumentation()]
```

### 4. Update Environment Variables

In `apps/cms/.env` and `apps/cms/.env.example`:

Change the `DATABASE_URI` to MongoDB connection string:

```
# FROM:
DATABASE_URI=postgres://payload:payload@127.0.0.1:5432/payload

# TO:
DATABASE_URI=mongodb://payload:payload@127.0.0.1:27017/payload
```

### 5. Migrate Data (if needed)

If you have existing data in PostgreSQL that needs to be migrated to MongoDB, you'll need to export your data and import it into MongoDB using appropriate migration tools.

**Note:** MongoDB uses a different schema structure than PostgreSQL, so existing migrations won't work. You'll start with a fresh database schema that Payload CMS will initialize automatically on first run.
