/**
 * Database Configuration
 * 
 * This file previously contained PostgreSQL configuration for Supabase.
 * Supabase has been removed; this is kept only as a generic example configuration.
 */

export const DATABASE_CONFIG = {
  // Example project ID (no longer used)
  projectId: 'example-project-id',
  
  // PostgreSQL Connection String
  // Replace [YOUR_PASSWORD] and host with your actual database details
  connectionString: 'postgresql://postgres:[YOUR_PASSWORD]@db.example.com:5432/postgres',
  
  // Database connection parameters
  host: 'db.example.com',
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

