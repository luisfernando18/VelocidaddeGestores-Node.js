-- Note: In Oracle, databases are typically created using DBCA or during installation
-- This script assumes you're already connected to an existing Oracle database instance

-- Step 1: Create tablespaces first (storage containers) (optional)
CREATE TABLESPACE users
    DATAFILE 'users.dbf'
    SIZE 100M
    AUTOEXTEND ON NEXT 10M MAXSIZE UNLIMITED;

CREATE TEMPORARY TABLESPACE temp
    TEMPFILE 'temp.dbf'
    SIZE 100M
    AUTOEXTEND ON NEXT 10M MAXSIZE UNLIMITED;

-- Step 2: Create user and assign tablespaces
CREATE USER c##ubdproducto
    IDENTIFIED BY BDPRODUCTO10
    DEFAULT TABLESPACE users
    TEMPORARY TABLESPACE temp
    QUOTA UNLIMITED ON users;

-- Step 3: Grant privileges to the user
GRANT CONNECT, RESOURCE TO c##ubdproducto;
-- connecto to c##bdproducto as sysdba
ALTER USER c##ubdproducto QUOTA UNLIMITED ON users;
-- Step 4: Create table (this would be done after connecting as the dbproducto user)
CREATE TABLE producto10 (
                          id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                          nombre VARCHAR2(100) NOT NULL,
                          categoria VARCHAR2(100) NOT NULL,
                          precio NUMBER(10,2) NOT NULL,
                          stock NUMBER(10) NOT NULL
);
-- Insert sample data
INSERT INTO producto10 (nombre, categoria, precio, stock) VALUES
('Laptop', 'Electrónica', 1200.00, 10),
('Impresora', 'Electrónica', 800.00, 25),
('Tablet', 'Electrónica', 500.00, 15),
('Airpods', 'Accesorios', 600.00, 5),
('Auriculares', 'Accesorios', 150.00, 30);

-- Commit the changes
COMMIT;

-- Stored procedure to insert data
CREATE OR REPLACE PROCEDURE SP_insertar_producto10 (
    p_nombre IN VARCHAR2,
    p_categoria IN VARCHAR2,
    p_precio IN NUMBER,
    p_stock IN NUMBER
) AS
BEGIN
    INSERT INTO producto10 (nombre, categoria, precio, stock) VALUES (p_nombre, p_categoria, p_precio, p_stock);
END;
-- use the stored procedure
BEGIN
    SP_insertar_producto10('Producto E', 'Categoria A' , 50.00, 500);
END;

-- Test the stored procedure
CALL SP_insertar_producto10('Impresora', 'Electrónica', 200.00, 20);
