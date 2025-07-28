create database if not exists BDPRODUCTO5;
use BDPRODUCTO5;
create table producto (
	id int auto_increment PRIMARY KEY,
	nombre varchar(50) NOT NULL,
	categoria varchar(50) NOT NULL,
	precio decimal(10,2) NOT NULL,
	stock int not null

);

-- Insertar algunos productos de ejemplo
insert into producto (nombre, categoria, precio, stock) values
('Laptop', 'Electrónica', 1200.00, 10),
('Impresora', 'Electrónica', 800.00, 25),
('Tablet', 'Electrónica', 500.00, 15),
('Airpods', 'Accesorios', 600.00, 5),
('Auriculares', 'Accesorios', 150.00, 30);

 -- Crear un procedimiento almacenado para insertar productos
DELIMITER $$
create procedure SP_insertar_producto(
    IN p_nombre VARCHAR(50),
    IN p_categoria VARCHAR(50),
    IN p_precio DECIMAL(10,2),
    IN p_stock INT
)
BEGIN
    INSERT INTO producto (nombre, categoria, precio, stock)
    VALUES (p_nombre, p_categoria, p_precio, p_stock);
END$$
DELIMITER ;

-- Prueba del procedimiento almacenado
CALL SP_insertar_producto('Impresora', 'Electrónica', 200.00, 20);


