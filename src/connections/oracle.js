// File: src/connections/oracle.js
import oracledb from "oracledb";

// Configure Oracle DB output format
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Database configuration - use environment variables in production
const dbConfig = {
  user: "c##bdproducto", // Changed from "sys" to regular user
  password: process.env.ORACLE_PASSWORD || "BDPRODUCTO5",
  connectString: process.env.ORACLE_CONNECT_STRING || "localhost:1521/FREE",
  // For SYS user, use privilege instead of role
  privilege: process.env.ORACLE_USER === "sys" ? oracledb.SYSDBA : undefined,
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 1,
  poolTimeout: 300,
  enableStatistics: true,
};

// Alternative configuration for SYS user (for administrative tasks)
const sysDbConfig = {
  user: "sys",
  password: process.env.ORACLE_SYS_PASSWORD || "123456",
  connectString: process.env.ORACLE_CONNECT_STRING || "localhost:1521/FREE",
  privilege: oracledb.SYSDBA, // This is the correct way to set SYSDBA privilege
  poolMin: 1,
  poolMax: 3,
  poolIncrement: 1,
  poolTimeout: 300,
};

let pool;

// Create connection pool for better performance
async function createPool() {
  try {
    pool = await oracledb.createPool(dbConfig);
    console.log("Oracle DB connection pool created");
    return pool;
  } catch (err) {
    console.error("Error creating Oracle DB pool:", err);
    throw err;
  }
}

// Get connection from pool
async function getConnection() {
  try {
    if (!pool) {
      await createPool();
    }
    const connection = await pool.getConnection();
    return connection;
  } catch (err) {
    console.error("Error getting Oracle DB connection:", err);
    throw err;
  }
}

// Execute query with automatic connection management
async function executeQuery(sql, params = []) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(sql, params, {
      autoCommit: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    return result;
  } catch (err) {
    console.error("Error executing Oracle query:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing Oracle connection:", err);
      }
    }
  }
}

// Get SYS connection for administrative tasks
async function getSysConnection() {
  try {
    const connection = await oracledb.getConnection(sysDbConfig);
    return connection;
  } catch (err) {
    console.error("Error getting SYS connection:", err);
    throw err;
  }
}

// Test connection
async function testConnection() {
  try {
    const result = await executeQuery("SELECT 1 as test FROM dual");
    console.log("Oracle DB connection test successful:", result.rows[0]);
    return true;
  } catch (err) {
    console.error("Oracle DB connection test failed:", err);
    return false;
  }
}
testConnection();
// Close pool gracefully
async function closePool() {
  try {
    if (pool) {
      await pool.close(0);
      console.log("Oracle DB pool closed");
    }
  } catch (err) {
    console.error("Error closing Oracle DB pool:", err);
  }
}

// Legacy function for compatibility
async function connectToOracle() {
  return await getConnection();
}

// Legacy function for compatibility
async function comprobateConn() {
  return await getConnection();
}

export {
  getConnection,
  getSysConnection,
  executeQuery,
  testConnection,
  closePool,
  connectToOracle,
  comprobateConn,
};
