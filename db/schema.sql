DROP DATABASE IF EXISTS employees_db;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee;

CREATE DATABASE employees_db;
USE employees_db;

CREATE TABLE employee (
  id INTEGER AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER DEFAULT NULL,
  PRIMARY KEY (id),
  KEY role_id (role_id),
  KEY manager_id (manager_id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id),
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES managers(id)
);

CREATE TABLE role (
  id INTEGER AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL (10,2) NOT NULL,
  department_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  KEY department_id (department_id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE department (
  id INTEGER NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);