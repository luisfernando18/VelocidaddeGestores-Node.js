// File: src/connections/sqlserver.js
import mssql from "mssql";

// Windows Authentication configuration - use environment variables
const configWindowsAuth = {
  server: process.env.SQLSERVER_SERVER || "localhost",
  database: process.env.SQLSERVER_DATABASE || "BDPRODUCTO5",
  port: parseInt(process.env.SQLSERVER_PORT) || 1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustedConnection: true,
    encrypt: process.env.SQLSERVER_ENCRYPT === "true" || false,
    trustServerCertificate: process.env.SQLSERVER_TRUST_CERT === "true" || true,
    enableArithAbort: true,
  },
};

// SQL Server Authentication configuration - use environment variables
const configUserAuth = {
  user: process.env.SQLSERVER_USER || "sa",
  password: process.env.SQLSERVER_PASSWORD || "123456",
  server: process.env.SQLSERVER_SERVER || "localhost",
  database: process.env.SQLSERVER_DATABASE || "BDPRODUCTO5",
  port: parseInt(process.env.SQLSERVER_PORT) || 1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: process.env.SQLSERVER_ENCRYPT === "true" || false,
    trustServerCertificate: process.env.SQLSERVER_TRUST_CERT === "true" || true,
    enableArithAbort: true,
  },
};

let pool;

// Determine which configuration to use
const useWindowsAuth = process.env.SQLSERVER_USE_WINDOWS_AUTH === "true";
const config = useWindowsAuth ? configWindowsAuth : configUserAuth;

console.log("SQL Server Configuration:", {
  server: config.server,
  database: config.database,
  useWindowsAuth,
  user: config.user,
  password: config.password,
  encrypt: config.options.encrypt,
  trustServerCertificate: config.options.trustServerCertificate,
});

// Create connection pool with retry logic
async function createPool() {
  try {
    console.log(
      `Attempting to connect to SQL Server with ${
        useWindowsAuth ? "Windows Authentication" : "SQL Server Authentication"
      }...`
    );
    pool = await mssql.connect(config);
    console.log("SQL Server connection pool created successfully");
    return pool;
  } catch (error) {
    console.error("Error creating SQL Server pool:", error.message);

    // If using SQL Server auth fails, try Windows auth as fallback
    if (!useWindowsAuth && error.code === "ELOGIN") {
      console.log(
        "SQL Server authentication failed, trying Windows Authentication as fallback..."
      );
      try {
        pool = await mssql.connect(configWindowsAuth);
        console.log(
          "SQL Server connection pool created successfully with Windows Authentication fallback"
        );
        return pool;
      } catch (fallbackError) {
        console.error(
          "Windows Authentication fallback also failed:",
          fallbackError.message
        );
        throw new Error(
          `Both SQL Server Authentication and Windows Authentication failed. Original error: ${error.message}, Fallback error: ${fallbackError.message}`
        );
      }
    }
    throw error;
  }
}

// Execute query with automatic connection management
export async function executeQuery(sql, params = {}) {
  try {
    if (!pool) {
      pool = await createPool();
    }
    const request = pool.request();

    // Add parameters if provided
    Object.keys(params).forEach((key) => {
      const param = params[key];
      if (param && typeof param === 'object' && param.type && param.value !== undefined) {
        // Handle typed parameters: { type: mssql.VarChar(255), value: 'some value' }
        request.input(key, param.type, param.value);
      } else {
        // Handle simple parameters: let mssql infer the type
        request.input(key, param);
      }
    });

    const result = await request.query(sql);
    return result.recordset;
  } catch (error) {
    console.error("Error executing SQL Server query:", error);
    throw error;
  }
}

// Test connection with better error handling
export async function testConnection() {
  try {
    console.log("Testing SQL Server connection...");
    const result = await executeQuery("SELECT 1 as test");
    console.log("SQL Server connection test successful:", result[0]);
    return { success: true, message: "Connection successful", data: result[0] };
  } catch (error) {
    console.error("SQL Server connection test failed:", error.message);

    // Provide helpful error messages based on the error type
    let helpfulMessage = "Connection failed. ";
    if (error.code === "ELOGIN") {
      helpfulMessage += "Login failed - check username and password. ";
      if (!useWindowsAuth) {
        helpfulMessage +=
          "Try setting SQLSERVER_USE_WINDOWS_AUTH=true in .env file to use Windows Authentication, or verify the SA account is enabled and the password is correct.";
      } else {
        helpfulMessage +=
          "Windows Authentication failed - make sure the current Windows user has access to SQL Server.";
      }
    } else if (error.code === "ESOCKET") {
      helpfulMessage +=
        "Cannot connect to server - check if SQL Server is running and the server name/port are correct.";
    } else if (error.code === "ENOTFOUND") {
      helpfulMessage +=
        "Server not found - check the server name in the configuration.";
    }

    return {
      success: false,
      message: helpfulMessage,
      error: error.message,
      code: error.code,
    };
  }
}

testConnection()
  .then((result) => console.log("Connection test result:", result))
  .catch((error) => console.error("Connection test error:", error));

// Close pool gracefully
export async function closePool() {
  try {
    if (pool) {
      await pool.close();
      console.log("SQL Server pool closed");
    }
  } catch (error) {
    console.error("Error closing SQL Server pool:", error);
  }
}

export { mssql, configWindowsAuth, configUserAuth, config };
