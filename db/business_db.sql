DROP DATABASE IF EXISTS business_db;
CREATE DATABASE business_db;

USE business_db;

CREATE TABLE Department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE Role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT, 
  PRIMARY KEY (id)
);
CREATE TABLE Employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR (50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT NOT NULL, 
  manager_id INT, 
  PRIMARY KEY (id)
);
INSERT INTO Department (name)
VALUES ("Sales Lead"), ("Salesperson"), ("Lead Engineer"), ("Software Developer"), ("Accountant"), ("Lawyer");

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", "100000", "7"), ("Software Developer", "70000", "2"), ("Lawyer", "60000", "3"),("Accountant", "60000", "4"), ("Sales Lead", "70000", "5"), ("Salesperson", "40000", "6");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Everly", "Crawford", "1"), ("Asher", "Conley", "2", "1"), ("Leona", "Griffin", "3", "1"), ("Cesar", "Olsen", "4", "3"), ("Koa", "Waters", "5", "1"), ("Jordan", "Foster", "Artist", "6", "1"), ("Aya", "Buck", "1", "1");

SELECT e.id, e.first_name, e.last_name, d.name AS department, r.title, r.salary, CONCAT_WS(" ", m.first_name, m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.id ASC;

SELECT  r.id, r.title, r.salary, d.name as Department_Name FROM role AS r INNER JOIN department AS d ON r.department_id = d.id;

SELECT id, CONCAT_WS(' ', first_name, last_name) AS Employee_Name FROM employee

UPDATE employee SET role_id = 3 WHERE id = 8;
UPDATE employee SET ? WHERE ?;

DELETE FROM department WHERE id = 13;