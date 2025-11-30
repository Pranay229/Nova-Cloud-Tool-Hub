# Supabase Configuration

This document contains the Supabase backend configuration for the Nova Developer Tools application.

## Project Information

- **Project ID**: `fvlptpzwtdjznbkgdhrj`
- **Supabase URL**: `https://fvlptpzwtdjznbkgdhrj.supabase.co`
- **Database Host**: `db.fvlptpzwtdjznbkgdhrj.supabase.co`
- **Database Port**: `5432`
- **Database Name**: `postgres`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://fvlptpzwtdjznbkgdhrj.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# PostgreSQL Database Connection String
# Replace [YOUR_PASSWORD] with your actual database password
# Get the password from: Supabase Dashboard > Settings > Database > Connection string
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.fvlptpzwtdjznbkgdhrj.supabase.co:5432/postgres

# Environment
VITE_ENVIRONMENT=development
```

## Getting Your Credentials

### 1. Supabase Anonymous Key
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** > **API**
4. Copy the **anon/public** key
5. Add it to `.env` as `VITE_SUPABASE_ANON_KEY`

### 2. Database Password
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** > **Database**
4. Under **Connection string**, select **URI**
5. Copy the connection string and extract the password
6. Replace `[YOUR_PASSWORD]` in the `.env` file

## Connection String Format

```
postgresql://postgres:[YOUR_PASSWORD]@db.fvlptpzwtdjznbkgdhrj.supabase.co:5432/postgres
```

## Usage

### Frontend (Client-Side)
The frontend uses the Supabase client SDK which only requires:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These are safe to expose in the frontend as they work with Row Level Security (RLS) policies.

### Backend (Server-Side)
For backend services, migrations, or direct database access, use:
- `DATABASE_URL` - Full PostgreSQL connection string with password

**⚠️ Security Warning**: Never commit the `.env` file or expose the database password in client-side code.

## Database Configuration File

The database configuration is also available in `src/lib/database.ts`:

```typescript
import { DATABASE_CONFIG, getDatabaseUrl } from './lib/database';

// Access configuration
const projectId = DATABASE_CONFIG.projectId;
const connectionString = getDatabaseUrl('your-password');
```

## Testing the Connection

You can test the connection using:

1. **Supabase Dashboard**: Use the SQL Editor
2. **psql command line**:
   ```bash
   psql "postgresql://postgres:[YOUR_PASSWORD]@db.fvlptpzwtdjznbkgdhrj.supabase.co:5432/postgres"
   ```
3. **Database GUI tools**: Use any PostgreSQL client (pgAdmin, DBeaver, etc.) with the connection string

## Security Notes

- ✅ The Supabase URL and anon key are safe for frontend use
- ✅ Row Level Security (RLS) is enabled on all tables
- ⚠️ The database password should NEVER be exposed in client-side code
- ⚠️ Always use environment variables for sensitive credentials
- ⚠️ The `.env` file is already in `.gitignore` - never commit it

