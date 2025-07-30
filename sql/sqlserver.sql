create DATABASE IF NOT EXISTS BDPRODUCTO10;
CREATE TABLE producto (
    id_producto INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(50) NOT NULL,
    categoria NVARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);

-- Insertar algunos productos de ejemplo
INSERT INTO producto (nombre, categoria, precio, stock) VALUES
('Laptop', 'Electrónica', 1200.00, 10),
('Impresora', 'Electrónica', 800.00, 25),
('Tablet', 'Electrónica', 500.00, 15),
('Airpods', 'Accesorios', 600.00, 5),
('Auriculares', 'Accesorios', 150.00, 30);

-- Crear un procedimiento almacenado para insertar productos
CREATE PROCEDURE SP_insertar_producto
    @p_nombre NVARCHAR(50),
    @p_categoria NVARCHAR(50),
    @p_precio DECIMAL(10,2),
    @p_stock INT
AS
BEGIN
    INSERT INTO producto (nombre, categoria, precio, stock)
    VALUES (@p_nombre, @p_categoria, @p_precio, @p_stock);
END;
-- Prueba del procedimiento almacenado
EXEC SP_insertar_producto 'Impresora', 'Electrónica', 200.00, 20;