create database BDPRODUCTO5;
CREATE TABLE producto (
    id_producto serial PRIMARY KEY,
    nombre varchar(50) NOT NULL,
    categoria varchar(50) NOT NULL,
    precio decimal(10,2) NOT NULL,
    stock int NOT NULL
);
-- Insertar algunos productos de ejemplo
insert into producto (nombre, categoria, precio, stock) values
('Laptop', 'Electrónica', 1200.00, 10),
('Impresora', 'Electrónica', 800.00, 25),
('Tablet', 'Electrónica', 500.00, 15),
('Airpods', 'Accesorios', 600.00, 5),
('Auriculares', 'Accesorios', 150.00, 30);

-- Crear un procedimiento almacenado para insertar productos
-- Crear un procedimiento almacenado para insertar productos
create or replace function SP_insertar_producto(
    p_nombre varchar(50),
    p_categoria varchar(50),
    p_precio decimal(10,2),
    p_stock int
)
    returns void as $$
begin
    insert into producto (nombre, categoria, precio, stock)
    values (p_nombre, p_categoria, p_precio, p_stock);
end;
$$ language plpgsql;

-- Prueba del procedimiento almacenado
select SP_insertar_producto('Impresora', 'Electrónica', 200.00, 20);
