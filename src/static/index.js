// File: src/static/index.js
let bloqueoInserciones = false;
let bloqueoBorrado = false;
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
  if (bloqueoInserciones) {
  Swal.fire({
    title: "Operación no permitida",
    text: "Espera a que se complete el borrado de inserciones antes de insertar.",
    icon: "warning",
    confirmButtonText: "OK",
  });
  return;
}
  bloqueoBorrado = true; // ← SOLO UNA VEZ AQUÍ
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
  bloqueoBorrado = false; // ← aquí desbloqueas
}

// Function to insert a product directly into the database
async function insertarProducto(event) {
  event.preventDefault();
  if (bloqueoInserciones) {
  Swal.fire({
    title: "Operación no permitida",
    text: "Espera a que se complete el borrado de inserciones antes de insertar.",
    icon: "warning",
    confirmButtonText: "OK",
  });
  return;
}
  bloqueoBorrado = true; // ← SOLO UNA VEZ AQUÍ
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
  bloqueoBorrado = false; // ← aquí desbloqueas
}
// Función para borrar todas las inserciones
document.getElementById("borrar-todas-inserciones")?.addEventListener("click", async (e) => {
  e.preventDefault();
  if (bloqueoBorrado) {
  Swal.fire({
    title: "Operación no permitida",
    text: "Espera a que se complete la inserción antes de borrar registros.",
    icon: "warning",
    confirmButtonText: "OK",
  });
  return;
}
  const botonBorrar = document.getElementById("borrar-todas-inserciones");
    bloqueoInserciones = true; // ← aquí bloqueas
  
  try {
    botonBorrar.setAttribute("disabled", "true");
    botonBorrar.textContent = "Borrando...";
    
    // Mostrar confirmación
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción borrará todos los registros de todas las bases de datos",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar todo',
      cancelButtonText: 'Cancelar'
    });
    
    if (!confirmacion.isConfirmed) {
      botonBorrar.removeAttribute("disabled");
      botonBorrar.textContent = "Borrar Todas las Inserciones";
      return;
    }
    
    Toast.fire({
      icon: "info",
      title: "Borrando inserciones en todas las bases de datos...",
    });
    
    // Array de promesas para borrar en todos los gestores
    const borrados = await Promise.allSettled([
      fetch("/api/mysql", { method: "DELETE" }),
      fetch("/api/postgresql", { method: "DELETE" }),
      fetch("/api/sqlserver", { method: "DELETE" }),
      fetch("/api/oracle", { method: "DELETE" })
    ]);
    
    // Verificar resultados
    const resultados = borrados.map((resultado, index) => {
      const gestores = ["MySQL", "PostgreSQL", "SQL Server", "Oracle"];
      if (resultado.status === "fulfilled") {
        return { gestor: gestores[index], ok: resultado.value.ok };
      }
      return { gestor: gestores[index], ok: false, error: resultado.reason };
    });
    
    // Mostrar resultados
    const exitosos = resultados.filter(r => r.ok).length;
    const fallidos = resultados.filter(r => !r.ok).length;
    
    if (fallidos === 0) {
      await Swal.fire({
        title: 'Éxito',
        text: `Todas las inserciones (${exitosos}) fueron borradas correctamente`,
        icon: 'success'
      });
    } else if (exitosos === 0) {
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo borrar ninguna inserción',
        icon: 'error'
      });
    } else {
      await Swal.fire({
        title: 'Resultado parcial',
        html: `Se borraron inserciones en ${exitosos} gestores, pero falló en ${fallidos}.<br><br>
               <strong>Detalles:</strong><br>
               ${resultados.map(r => 
                 `${r.gestor}: ${r.ok ? '✅ Éxito' : '❌ Error'}`).join('<br>')}`,
        icon: 'warning'
      });
    }
    
    // Actualizar contadores a "0" en la interfaz
    document.querySelectorAll('[id^="insertar-"]').forEach(element => {
      if (element.textContent.includes("Productos insertados:")) {
        element.textContent = "Productos insertados: 0";
      }
    });
    
  } catch (error) {
    console.error("Error al borrar inserciones:", error);
    Swal.fire({
      title: 'Error',
      text: 'Ocurrió un error al intentar borrar las inserciones',
      icon: 'error'
    });
  } finally {
    bloqueoInserciones = false; // ← aquí desbloqueas
    botonBorrar.removeAttribute("disabled");
    botonBorrar.textContent = "Borrar Todas las Inserciones";
  }
});

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
