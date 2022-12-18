DROP DATABASE IF EXISTS business_db;
CREATE DATABASE business_db;

USE business_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT, 
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR (50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT NOT NULL, 
  manager_id INT, 
  PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Sales Lead"), ("Salesperson"), ("Lead Engineer"), ("Software Developer"), ("Accountant"), ("Lawyer");
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", "100000", "7"), ("Software Developer", "70000", "2"), ("Lawyer", "60000", "3"),("Accountant", "60000", "5"), ("Sales Lead", "70000", "6"), ("Salesperson", "40000", "1");
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Everly", "Crawford", "1"), ("Asher", "Conley", "2", "1"), ("Leona", "Griffin", "3", "1"), ("Cesar", "Olsen", "4", "3"), ("Koa", "Waters", "5", "1"), ("Jordan", "Foster", "Artist", "6", "1"), ("Aya", "Buck", "1", "1");