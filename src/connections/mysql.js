// File: src/connections/mysql.js
import { createPool } from "mysql2/promise";

// Database configuration - use environment variables
const config = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "123456",
  database: process.env.MYSQL_DATABASE || "BDPRODUCTO5",
  port: process.env.MYSQL_PORT || 3306,
  connectionLimit: 10,
};

let pool;

// Create connection pool
function createMysqlPool() {
  try {
    pool = createPool(config);
    console.log("MySQL connection pool created");
    return pool;
  } catch (error) {
    console.error("Error creating MySQL pool:", error);
    throw error;
  }
}

// Get connection from pool
export function getMysqlConnection() {
  try {
    if (!pool) {
      pool = createMysqlPool();
    }
    return pool;
  } catch (error) {
    console.error("Error getting MySQL connection:", error);
    throw error;
  }
}

// Execute query with automatic connection management
export async function executeQuery(sql, params = []) {
  try {
    const connection = getMysqlConnection();
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Error executing MySQL query:", error);
    throw error;
  }
}

// Test connection
export async function testConnection() {
  try {
    const result = await executeQuery("SELECT 1 as test");
    console.log("MySQL connection test successful:", result[0]);
    return true;
  } catch (error) {
    console.error("MySQL connection test failed:", error);
    return false;
  }
}

// Close pool gracefully
export async function closePool() {
  try {
    if (pool) {
      await pool.end();
      console.log("MySQL pool closed");
    }
  } catch (error) {
    console.error("Error closing MySQL pool:", error);
  }
}

export { config };
