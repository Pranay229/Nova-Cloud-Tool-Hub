/**
 * Database Configuration
 * 
 * This file contains the PostgreSQL database connection configuration for Supabase.
 * The connection string is used for direct database access, migrations, and backend services.
 */

// Extract Supabase project details from connection string
// Connection string format: postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
export const DATABASE_CONFIG = {
  // Supabase Project ID
  projectId: 'fvlptpzwtdjznbkgdhrj',
  
  // Supabase API URL
  supabaseUrl: 'https://fvlptpzwtdjznbkgdhrj.supabase.co',
  
  // PostgreSQL Connection String
  // Replace [YOUR_PASSWORD] with your actual database password
  // You can find this in Supabase Dashboard > Settings > Database > Connection string
  connectionString: 'postgresql://postgres:[YOUR_PASSWORD]@db.fvlptpzwtdjznbkgdhrj.supabase.co:5432/postgres',
  
  // Database connection parameters
  host: 'db.fvlptpzwtdjznbkgdhrj.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  
  // Connection pool settings (for server-side usage)
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
  },
};

/**
 * Get database connection string with password
 * @param password - Database password (should be from environment variable in production)
 * @returns Complete PostgreSQL connection string
 */
export function getDatabaseUrl(password?: string): string {
  if (password) {
    return `postgresql://postgres:${password}@${DATABASE_CONFIG.host}:${DATABASE_CONFIG.port}/${DATABASE_CONFIG.database}`;
  }
  return DATABASE_CONFIG.connectionString;
}

/**
 * Parse connection string into components
 */
export function parseConnectionString(connectionString: string) {
  const url = new URL(connectionString.replace('postgresql://', 'https://'));
  return {
    user: url.username,
    password: url.password,
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1), // Remove leading slash
  };
}

