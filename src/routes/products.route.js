import express from "express";
import {
  getPgConnection,
  testConnection as testConnectionPostgres,
  executeQuery as executeQueryPostgres,
} from "../connections/postgres.js";
import {
  mssql,
  testConnection as testConnectionSqlServer,
  executeQuery as executeQuerySqlServer,
} from "../connections/sqlserver.js";
import {
  getMysqlConnection,
  executeQuery as executeQueryMysql,
  testConnection as testConnectionMysql,
} from "../connections/mysql.js";
import {
  getConnection as getOracleConnection,
  executeQuery as executeQueryOracle,
  closePool as closeOraclePool,
  testConnection as testConnectionOracle,
  comprobateConn as comprobateConnOracle,
  connectToOracle as connectToOracleOracle,
} from "../connections/oracle.js";
const router = express.Router();

// RUTAS PARA MYSQL
// Ejecutar inserción directa de producto por 1 minuto
let lastInsertCountMysqlInsert = 0;
router.post("/mysql", async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    // Validate required fields
    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide name, category, price, and stock.",
        ok: false,
      });
    }

    const start = Date.now();
    let count = 0;

    const insertLoop = async () => {
      while (Date.now() - start < 60000) {
        try {
          await executeQueryMysql(
            "INSERT INTO producto (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)",
            [name, category, price, stock]
          );
          count++;
          // No delay - maximum speed
        } catch (err) {
          console.error("Error en inserción MySQL:", err.message);
          break;
        }
      }
      // Almacena el último conteo de inserciones
      lastInsertCountMysqlInsert = count;
      console.log(`MySQL: Total de inserciones: ${count}`);
    };
    await insertLoop();
    // Respuesta al cliente
    res.status(201).json({
      message: "Producto creado",
      inserted: lastInsertCountMysqlInsert,
      ok: true,
    });
  } catch (error) {
    console.error("Error creating product in MySQL:", error);
    res.status(500).json({ error: "Error creating product", ok: false });
  }
});
// Ejecutar procedimiento por 1 minuto
let lastInsertCountMysqlProcedure = 0;
router.post("/mysql/insert-batch", async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    // Validate required fields
    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide name, category, price, and stock.",
        ok: false,
      });
    }

    const start = Date.now();
    let count = 0;
    const insertLoop = async () => {
      while (Date.now() - start < 60000) {
        try {
          await executeQueryMysql("CALL SP_insertar_producto(?, ?, ?, ?)", [
            name,
            category,
            price,
            stock,
          ]);
          count++;
          // No delay - maximum speed
        } catch (err) {
          console.error("Error en inserción MySQL:", err.message);
          break;
        }
      }
      // Almacena el último conteo de inserciones
      lastInsertCountMysqlProcedure = count;
      console.log(`MySQL: Total de inserciones: ${count}`);
    };
    await insertLoop();
    // Respuesta al cliente
    res.json({
      message: "Inserciones comenzadas por 1 minuto",
      inserted: lastInsertCountMysqlProcedure,
      ok: true,
    });
  } catch (error) {
    console.error("Error creating product in MySQL:", error);
    res.status(500).json({ error: "Error creating product", ok: false });
  }
});
// Eliminar todos los productos
router.delete("/mysql", async (req, res) => {
  try {
    const connection = await getMysqlConnection();
    await connection.query("DELETE FROM producto");
    res.json({
      message: "Todas las inserciones eliminadas",
      status: "success",
      gestor: "mysql",
    });
  } catch (error) {
    console.error("Error deleting all products from MySQL:", error);
    res.status(500).json({ error: "Error deleting all products" });
  }
});
//Ruta para probar conexión a MySQL
router.get("/mysql/test-connection", async (req, res) => {
  try {
    const result = await testConnectionMysql();
    res.json({ message: "Conexión exitosa a MySQL", ok: true });
  } catch (error) {
    console.error("Error testing MySQL connection:", error);
    res
      .status(500)
      .json({ error: "Error testing MySQL connection", ok: false });
  }
});

// RUTAS PARA POSTGRESQL
// Ejecutar inserción directa de producto por 1 minuto
let lastInsertCountPostgres = 0;
router.post("/postgresql", async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    // Validate required fields
    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide name, category, price, and stock.",
      });
    }

    const start = Date.now();
    let count = 0;
    const insertLoop = async () => {
      while (Date.now() - start < 60000) {
        try {
          await executeQueryPostgres(
            "INSERT INTO producto (nombre, categoria, precio, stock) VALUES ($1, $2, $3, $4)",
            [name, category, price, stock]
          );
          count++;
          // No delay - maximum speed
        } catch (err) {
          console.error("Error en inserción PostgreSQL:", err.message);
          break;
        }
      }
      // Almacena el último conteo de inserciones
      lastInsertCountPostgres = count;
      console.log(`PostgreSQL: Total de inserciones: ${count}`);
    };
    await insertLoop();
    res.status(201).json({
      message: "Producto creado",
      inserted: lastInsertCountPostgres,
      ok: true,
    });
  } catch (error) {
    console.error("Error creating product in PostgreSQL:", error);
    res.status(500).json({ error: "Error creating product", ok: false });
  }
});
// Ejecutar procedimiento por 1 minuto
let lastInsertCountPostgresProcedure = 0;
router.post("/postgresql/insert-batch", async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    // Validate required fields
    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide name, category, price, and stock.",
        ok: false,
      });
    }

    const start = Date.now();
    let count = 0;
    const insertProduct = async () => {
      while (Date.now() - start < 60000) {
        try {
          await executeQueryPostgres(
            "SELECT sp_insertar_producto($1, $2, $3, $4)",
            [name, category, price, stock]
          );
          count++;
          // No delay - maximum speed
        } catch (err) {
          console.error("Error en inserción PostgreSQL:", err.message);
          break;
        }
      }
      // Almacena el último conteo de inserciones
      lastInsertCountPostgresProcedure = count;
      console.log(`PostgreSQL: Total de inserciones: ${count}`);
    };
    await insertProduct();
    // Respuesta al cliente
    res.json({
      message: "Inserciones iniciadas por 1 minuto",
      inserted: lastInsertCountPostgresProcedure,
      ok: true,
    });
  } catch (error) {
    console.error("Error creating product in PostgreSQL:", error);
    res.status(500).json({ error: "Error creating product", ok: false });
  }
});
// Eliminar todos los productos
router.delete("/postgresql", async (req, res) => {
  try {
    const client = await getPgConnection();
    await client.query("DELETE FROM producto");
    res.json({
      message: "Todas las inserciones eliminadas",
      status: "success",
      gestor: "postgresql",
    });
  } catch (error) {
    console.error("Error deleting all products from PostgreSQL:", error);
    res.status(500).json({ error: "Error deleting all products" });
  }
});
// Ruta para probar conexión a PostgreSQL
router.get("/postgresql/test-connection", async (req, res) => {
  try {
    const result = await testConnectionPostgres();
    res.json({ message: "Conexión exitosa a PostgreSQL", ok: true });
  } catch (error) {
    console.error("Error testing PostgreSQL connection:", error);
    res
      .status(500)
      .json({ error: "Error testing PostgreSQL connection", ok: false });
  }
});

// RUTAS PARA SQL SERVER
// Ejecutar inserción directa de producto por 1 minuto
let lastInsertCountSQLServerInsert = 0;
router.post("/sqlserver", async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    // Validate required fields
    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide name, category, price, and stock.",
        ok: false,
      });
    }

    const start = Date.now();
    let count = 0;
    const insertLoop = async () => {
      while (Date.now() - start < 60000) {
        try {
          await executeQuerySqlServer(
            "INSERT INTO producto (nombre, categoria, precio, stock) VALUES (@name, @category, @price, @stock)",
            {
              name: name,
              category: category,
              price: price,
              stock: stock,
            }
          );
          // Incrementa el contador de inserciones
          count++;
          // No delay - maximum speed
        } catch (err) {
          console.error("Error en inserción SQL Server:", err.message);
          break;
        }
      }
      // Almacena el último conteo de inserciones
      lastInsertCountSQLServerInsert = count;
      console.log(`SQL Server: Total de inserciones: ${count}`);
    };
    await insertLoop();
    // Respuesta al cliente
    res.status(201).json({
      message: "Producto creado",
      inserted: lastInsertCountSQLServerInsert,
      ok: true,
    });
  } catch (error) {
    console.error("Error creating product in SQL Server:", error);
    res.status(500).json({ error: "Error creating product", ok: false });
  }
});

// Ejecutar procedimiento por 1 minuto
let lastInsertCountSQLServerProcedure = 0;
router.post("/sqlserver/insert-batch", async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    // Validate required fields
    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide name, category, price, and stock.",
        ok: false,
      });
    }

    const start = Date.now();
    let count = 0;

    const insertLoop = async () => {
      while (Date.now() - start < 60000) {
        try {
          await executeQuerySqlServer(
            "EXEC SP_insertar_producto @name, @category, @price, @stock",
            {
              name: name,
              category: category,
              price: price,
              stock: stock,
            }
          );
          count++;
          // No delay - maximum speed
        } catch (err) {
          console.error("Error en inserción SQL Server:", err.message);
          break;
        }
      }
      // Almacena el último conteo de inserciones
      lastInsertCountSQLServerProcedure = count;
      console.log(`SQL Server: Total de inserciones: ${count}`);
    };

    await insertLoop();
    res.json({
      message: "Inserciones iniciadas por 1 minuto",
      inserted: lastInsertCountSQLServerProcedure,
      ok: true,
    });
  } catch (error) {
    console.error("Error creating product in SQL Server:", error);
    res.status(500).json({ error: "Error creating product", ok: false });
  }
});

// eliminar todos los productos
router.delete("/sqlserver", async (req, res) => {
  try {
    await executeQuerySqlServer("DELETE FROM producto");
    res.json({
      message: "Todas las inserciones eliminadas",
      status: "success",
      gestor: "sqlserver",
      ok: true,
    });
  } catch (error) {
    console.error("Error deleting products from SQL Server:", error);
    res.status(500).json({ error: "Error deleting products", ok: false });
  }
});

// Ruta para probar conexión a SQL Server
router.get("/sqlserver/test-connection", async (req, res) => {
  try {
    const result = await testConnectionSqlServer();
    if (result.success) {
      res.json({
        message: result.message,
        ok: true,
        data: result.data,
      });
    } else {
      res.status(500).json({
        error: result.message,
        ok: false,
        code: result.code,
        details: result.error,
      });
    }
  } catch (error) {
    console.error("Error testing SQL Server connection:", error);
    res.status(500).json({
      error: "Error testing SQL Server connection",
      ok: false,
      details: error.message,
    });
  }
});

export default router;

// RUTAS PARA ORACLE
// Ejecutar inserción directa de producto por 1 minuto
let lastInsertCountOracleInsert = 0;
router.post("/oracle", async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    // Validate required fields
    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide name, category, price, and stock.",
        ok: false,
      });
    }

    const start = Date.now();
    let count = 0;

    const insertLoop = async () => {
      while (Date.now() - start < 60000) {
        try {
          await executeQueryOracle(
            "INSERT INTO producto (nombre, categoria, precio, stock) VALUES (:name, :category, :price, :stock)",
            [name, category, price, stock]
          );
          count++;
          // No delay - maximum speed
        } catch (err) {
          console.error("Error en inserción Oracle:", err.message);
          break;
        }
      }
      // Almacena el último conteo de inserciones
      lastInsertCountOracleInsert = count;
      console.log(`Oracle: Total de inserciones: ${count}`);
    };
    await insertLoop();
    res.status(201).json({
      message: "Producto creado",
      inserted: lastInsertCountOracleInsert,
      ok: true,
    });
  } catch (error) {
    console.error("Error creating product in Oracle:", error);
    res.status(500).json({ error: "Error creating product", ok: false });
  }
});

// Ejecutar procedimiento por 1 minuto
let lastInsertCountOracleProcedure = 0;
router.post("/oracle/insert-batch", async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    // Validate required fields
    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide name, category, price, and stock.",
        ok: false,
      });
    }

    const start = Date.now();
    let count = 0;

    const insertLoop = async () => {
      while (Date.now() - start < 60000) {
        try {
          await executeQueryOracle(
            "BEGIN SP_insertar_producto(:name, :category, :price, :stock); END;",
            [name, category, price, stock]
          );
          count++;
          // No delay - maximum speed
        } catch (err) {
          console.error("Error en inserción Oracle:", err.message);
          break;
        }
      }
      // Almacena el último conteo de inserciones
      lastInsertCountOracleProcedure = count;
      console.log(`Oracle: Total de inserciones: ${count}`);
    };
    await insertLoop();
    res.json({
      message: "Inserciones iniciadas por 1 minuto",
      inserted: lastInsertCountOracleProcedure,
      ok: true,
    });
  } catch (error) {
    console.error("Error creating product in Oracle:", error);
    res.status(500).json({ error: "Error creating product", ok: false });
  }
});

// Eliminar todos los productos
router.delete("/oracle", async (req, res) => {
  try {
    await executeQueryOracle("DELETE FROM producto");
    res.json({
      message: "Todas las inserciones eliminadas",
      status: "success",
      gestor: "oracle",
      ok: true,
    });
  } catch (error) {
    console.error("Error deleting products from Oracle:", error);
    res.status(500).json({ error: "Error deleting products", ok: false });
  }
});

// Ruta para probar conexión a Oracle
router.get("/oracle/test-connection", async (req, res) => {
  try {
    const result = await testConnectionOracle();
    res.json({ message: "Conexión exitosa a Oracle", ok: true });
  } catch (error) {
    console.error("Error testing Oracle connection:", error);
    res
      .status(500)
      .json({ error: "Error testing Oracle connection", ok: false });
  }
});
