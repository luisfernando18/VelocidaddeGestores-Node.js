// File: src/static/index.js
document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".gestor-button");
  botones.forEach((btn) => {
    const boton = document.getElementById(btn.id);
    boton.getAttribute("data-gestor");
    boton.addEventListener("click", async (e) => {
      e.preventDefault();
      const gestor = boton.getAttribute("data-gestor");

      try {
        await testConnection(gestor);

        Toast.fire({
          icon: "success",
          title: `Conexión exitosa a ${gestor}`,
        });
      } catch (error) {
        console.error(`Error al conectar con ${gestor}:`, error);
        Swal.fire({
          title: "Error de conexión",
          text: `No se pudo conectar con ${gestor}. Por favor, verifica la configuración.`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    });
  });

  const insertarBtn = document.getElementById("insertar-directo");
  insertarBtn.addEventListener("click", (e) => {
    insertarProducto(e);
  });

  const procedimientoBtn = document.getElementById("insertar-stored");
  procedimientoBtn.addEventListener("click", (e) => {
    insertarProductoStored(e);
  });
});

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

async function insertarProductoStored(event) {
  event.preventDefault();
  const botonInsertar = document.getElementById("insertar-stored");
  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;

  const gestor = document.getElementById("gestor").value;

  if (gestor === "mysql") {
    // ruta de stored procedure de mysql
    try {
      botonInsertar.setAttribute("disabled", "true"); // Disable the button to prevent multiple clicks
      botonInsertar.textContent = "Insertando..."; // Change button text to indicate action

      const response = await fetch("/api/mysql/insert-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          category: category,
          price: price,
          stock: stock,
        }),
      });
      const data = await response.json();
      console.log(data);
      Swal.fire({
        title: "Éxito",
        text: "Producto insertado correctamente con stored procedure",
        icon: "success",
        confirmButtonText: "OK",
      });
      const contador = document.getElementById("insertar-stored-status-mysql");
      contador.textContent = `Productos insertados: ${data.inserted}`;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al insertar el producto con stored procedure",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error(
        "Error al insertar el producto con stored procedure:",
        error
      );
    } finally {
      botonInsertar.removeAttribute("disabled"); // Re-enable the button
      botonInsertar.textContent = "Insertar Producto con SP"; // Reset button text
    }
  } else if (gestor === "postgresql") {
    // ruta de stored procedure de postgresql
    try {
      botonInsertar.setAttribute("disabled", "true"); // Disable the button to prevent multiple clicks
      botonInsertar.textContent = "Insertando..."; // Change button text to indicate action

      const response = await fetch("/api/postgresql/insert-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          category: category,
          price: price,
          stock: stock,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (!data.ok) {
        Swal.fire({
          title: "Error",
          text: "Error al insertar el producto con stored procedure en PostgreSQL",
          icon: "error",
          confirmButtonText: "OK",
        });
        throw new Error(
          "Error en la inserción con stored procedure de PostgreSQL"
        );
      }
      Swal.fire({
        title: "Éxito",
        text: "Producto insertado correctamente con stored procedure",
        icon: "success",
        confirmButtonText: "OK",
      });
      const contador = document.getElementById(
        "insertar-stored-status-postgresql"
      );
      contador.textContent = `Productos insertados: ${data.inserted}`;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al insertar el producto con stored procedure",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error(
        "Error al insertar el producto con stored procedure:",
        error
      );
    } finally {
      botonInsertar.removeAttribute("disabled"); // Re-enable the button
      botonInsertar.textContent = "Insertar Producto con SP"; // Reset button text
    }
  } else if (gestor === "sqlserver") {
    // ruta de stored procedure de sqlserver
    try {
      botonInsertar.setAttribute("disabled", "true"); // Disable the button to prevent multiple clicks
      botonInsertar.textContent = "Insertando..."; // Change button text to indicate action

      const response = await fetch("/api/sqlserver/insert-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          category: category,
          price: price,
          stock: stock,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (!data.ok) {
        Swal.fire({
          title: "Error",
          text: "Error al insertar el producto con stored procedure en SQL Server",
          icon: "error",
          confirmButtonText: "OK",
        });
        throw new Error(
          "Error en la inserción con stored procedure de SQL Server"
        );
      }
      Swal.fire({
        title: "Éxito",
        text: "Producto insertado correctamente con stored procedure",
        icon: "success",
        confirmButtonText: "OK",
      });
      const contador = document.getElementById(
        "insertar-stored-status-sqlserver"
      );
      contador.textContent = `Productos insertados: ${data.inserted}`;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al insertar el producto con stored procedure",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error(
        "Error al insertar el producto con stored procedure:",
        error
      );
    } finally {
      botonInsertar.removeAttribute("disabled"); // Re-enable the button
      botonInsertar.textContent = "Insertar Producto con SP"; // Reset button text
    }
  } else {
    //ruta  de stored procedure de oracle
    try {
      botonInsertar.setAttribute("disabled", "true"); // Disable the button to prevent multiple clicks
      botonInsertar.textContent = "Insertando..."; // Change button text to indicate action

      const response = await fetch("/api/oracle/insert-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          category: category,
          price: price,
          stock: stock,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (!data.ok) {
        Swal.fire({
          title: "Error",
          text: "Error al insertar el producto con stored procedure en Oracle",
          icon: "error",
          confirmButtonText: "OK",
        });
        throw new Error("Error en la inserción con stored procedure de Oracle");
      }
      Swal.fire({
        title: "Éxito",
        text: "Producto insertado correctament  e con stored procedure",
        icon: "success",
        confirmButtonText: "OK",
      });
      const contador = document.getElementById("insertar-stored-status-oracle");
      contador.textContent = `Productos insertados: ${data.inserted}`;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al insertar el producto con stored procedure",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error(
        "Error al insertar el producto con stored procedure:",
        error
      );
    } finally {
      botonInsertar.removeAttribute("disabled"); // Re-enable the button
      botonInsertar.textContent = "Insertar Producto con SP"; // Reset button text
    }
  }
}

// Function to insert a product directly into the database
async function insertarProducto(event) {
  event.preventDefault();
  const botonInsertar = document.getElementById("insertar-directo");
  const nombre = document.getElementById("name").value;
  const categoria = document.getElementById("category").value;
  const precio = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;

  const gestor = document.getElementById("gestor").value;

  if (gestor === "mysql") {
    // ruta de inserción directa de mysql
    try {
      Toast.fire({
        icon: "info",
        title: "Insertando producto...",
      });
      botonInsertar.setAttribute("disabled", "true"); // Disable the button to prevent multiple clicks
      botonInsertar.textContent = "Insertando..."; // Change button text to indicate action
      // Make a POST request to the API endpoint for MySQL
      const response = await fetch("/api/mysql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nombre,
          category: categoria,
          price: precio,
          stock: stock,
        }),
      });
      const data = await response.json();
      console.log(data);
      Swal.fire({
        title: "Éxito",
        text: "Producto insertado correctamente",
        icon: "success",
        confirmButtonText: "OK",
      });
      const contador = document.getElementById("insertar-directo-status-mysql");
      contador.textContent = `Productos insertados: ${data.inserted}`;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al insertar el producto",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error al insertar el producto:", error);
    } finally {
      botonInsertar.removeAttribute("disabled"); // Re-enable the button
      botonInsertar.textContent = "Insertar Producto"; // Reset button text
    }
  } else if (gestor === "postgresql") {
    // ruta de inserción directa de postgresql
    try {
      Toast.fire({
        icon: "info",
        title: "Insertando producto...",
      });
      botonInsertar.setAttribute("disabled", "true"); // Disable the button to prevent multiple clicks
      botonInsertar.textContent = "Insertando..."; // Change button text to indicate action

      const response = await fetch("/api/postgresql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nombre,
          category: categoria,
          price: precio,
          stock: stock,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (!data.ok) {
        Swal.fire({
          title: "Error",
          text: "Error al insertar el producto en PostgreSQL",
          icon: "error",
          confirmButtonText: "OK",
        });
        throw new Error("Error en la inserción directa de PostgreSQL");
      }
      Swal.fire({
        title: "Éxito",
        text: "Producto insertado correctamente",
        icon: "success",
        confirmButtonText: "OK",
      });
      const contador = document.getElementById(
        "insertar-directo-status-postgresql"
      );
      contador.textContent = `Productos insertados: ${data.inserted}`;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al insertar el producto",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error al insertar el producto:", error);
    } finally {
      botonInsertar.removeAttribute("disabled"); // Re-enable the button
      botonInsertar.textContent = "Insertar Producto"; // Reset button text
    }
  } else if (gestor === "sqlserver") {
    // ruta de inserción directa de sqlserver
    try {
      Toast.fire({
        icon: "info",
        title: "Insertando producto...",
      });
      botonInsertar.setAttribute("disabled", "true"); // Disable the button to prevent multiple clicks
      botonInsertar.textContent = "Insertando..."; // Change button text to indicate action

      const response = await fetch("/api/sqlserver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nombre,
          category: categoria,
          price: precio,
          stock: stock,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (!data.ok) {
        Swal.fire({
          title: "Error",
          text: "Error al insertar el producto en SQL Server",
          icon: "error",
          confirmButtonText: "OK",
        });
        throw new Error("Error en la inserción directa de SQL Server");
      }
      Swal.fire({
        title: "Éxito",
        text: "Producto insertado correctamente",
        icon: "success",
        confirmButtonText: "OK",
      });
      const contador = document.getElementById(
        "insertar-directo-status-sqlserver"
      );
      contador.textContent = `Productos insertados: ${data.inserted}`;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al insertar el producto",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error al insertar el producto:", error);
    } finally {
      botonInsertar.removeAttribute("disabled"); // Re-enable the button
      botonInsertar.textContent = "Insertar Producto"; // Reset button text
    }
  } else {
    // ruta de inserción directa de oracle
    try {
      Toast.fire({
        icon: "info",
        title: "Insertando producto...",
      });
      botonInsertar.setAttribute("disabled", "true"); // Disable the button to prevent multiple clicks
      botonInsertar.textContent = "Insertando..."; // Change button text to indicate action

      const response = await fetch("/api/oracle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nombre,
          category: categoria,
          price: precio,
          stock: stock,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (!data.ok) {
        Swal.fire({
          title: "Error",
          text: "Error al insertar el producto en Oracle",
          icon: "error",
          confirmButtonText: "OK",
        });
        throw new Error("Error en la inserción directa de Oracle");
      }
      Swal.fire({
        title: "Éxito",
        text: "Producto insertado correctamente",
        icon: "success",
        confirmButtonText: "OK",
      });
      const contador = document.getElementById(
        "insertar-directo-status-oracle"
      );
      contador.textContent = `Productos insertados: ${data.inserted}`;
    } catch (error) {
      console.error("Error al insertar el producto:", error);
      Swal.fire({
        title: "Error",
        text: "Error al insertar el producto",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      botonInsertar.removeAttribute("disabled"); // Re-enable the button
      botonInsertar.textContent = "Insertar Producto"; // Reset button text
    }
  }
}

async function testConnection(gestor) {
  if (gestor === "mysql") {
    // Test MySQL connection
    try {
      const response = await fetch("/api/mysql/test-connection");
      const data = await response.json();
      if (!data.ok) {
        throw new Error("Error en la conexión a MySQL");
      }
      return true;
    } catch (error) {
      console.error("Error al conectar con MySQL:", error);
      throw error;
    }
  } else if (gestor === "postgresql") {
    // Test PostgreSQL connection
    try {
      const response = await fetch("/api/postgresql/test-connection");
      const data = await response.json();
      console.log(data);
      if (!data.ok) {
        throw new Error("Error en la conexión a PostgreSQL");
      }
      return true;
    } catch (error) {
      console.error("Error al conectar con PostgreSQL:", error);
      throw error;
    }
  } else if (gestor === "sqlserver") {
    // Test SQL Server connection
    try {
      const response = await fetch("/api/sqlserver/test-connection");
      const data = await response.json();

      if (!data.ok) {
        throw new Error("Error en la conexión a SQL Server");
      }
      return true;
    } catch (error) {
      console.error("Error al conectar con SQL Server:", error);
      throw error;
    }
  } else {
    // Test Oracle connection
    try {
      const response = await fetch("/api/oracle/test-connection");
      const data = await response.json();

      if (!data.ok) {
        throw new Error("Error en la conexión a Oracle");
      }
      return true;
    } catch (error) {
      console.error("Error al conectar con Oracle:", error);
      throw error;
    }
  }
}
