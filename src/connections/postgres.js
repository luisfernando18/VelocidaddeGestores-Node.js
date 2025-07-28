// File: src/connections/postgres.js
import { Pool } from "pg";

// Database configuration - use environment variables
const config = {
  user: process.env.POSTGRES_USER || "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD || "123456",
  port: process.env.POSTGRES_PORT || 5432,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // How long to try connecting before timing out
};

let pool;

// Create connection pool
function createPgPool() {
  try {
    pool = new Pool(config);
    console.log("PostgreSQL connection pool created");

    // Handle pool errors
    pool.on("error", (err) => {
      console.error("Unexpected error on idle PostgreSQL client", err);
    });

    return pool;
  } catch (error) {
    console.error("Error creating PostgreSQL pool:", error);
    throw error;
  }
}

// Get connection from pool
export async function getPgConnection() {
  try {
    if (!pool) {
      pool = createPgPool();
    }
    const client = await pool.connect();
    console.log("Connected to PostgreSQL successfully");
    return client;
  } catch (error) {
    console.error("Error getting PostgreSQL connection:", error);
    throw error;
  }
}

// Execute query with automatic connection management
export async function executeQuery(sql, params = []) {
  let client;
  try {
    if (!pool) {
      pool = createPgPool();
    }
    client = await pool.connect();
    const result = await client.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error("Error executing PostgreSQL query:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Test connection
export async function testConnection() {
  try {
    const result = await executeQuery("SELECT 1 as test");
    console.log("PostgreSQL connection test successful:", result[0]);
    return true;
  } catch (error) {
    console.error("PostgreSQL connection test failed:", error);
    return false;
  }
}

// Close pool gracefully
export async function closePool() {
  try {
    if (pool) {
      await pool.end();
      console.log("PostgreSQL pool closed");
    }
  } catch (error) {
    console.error("Error closing PostgreSQL pool:", error);
  }
}

export { config };
