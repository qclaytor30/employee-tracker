const mysql = require('mysql');
const inquirer = require('inquirer');

let roles;
let managers;
let departments;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password.",
    database: "employeeDb"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
    getRoles(); getManagers(); getDepartments();
})

start = () => {
    inquirer
    prompt({
            name: "choices",
            type: "list",
            message: "Which would you like to do?",
            choices: ["ADD", "VIEW", "UPDATE", "DELETE"]
        })
        .then(function (answer) {
            if (answer.choices === "ADD") {
                addSomething(

                )
                console.log(answer.choices);
            }
            else if (answer.choices === "VIEW") {

            }
        });
}
getRoles = () => {
    connection.query("SELECT id, title FROM role", function (err, res) {
        if (err) throw err;
        roles = res;
    })
};
getDepartments = () => {
    connection.query("SELECT id, name FROM department", function (err, res) {
        if (err) throw err;
        departments = res;
    })
};
getManagers = () => {
    connection.query("SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee", function (err, res) {
        if (err) throw err;
        managers = res;
    })
};
addSomething = () => {
    inquirer.prompt([
        {
            name: "add",
            type: "list",
            message: "Which would you like to add?",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"]
        }
    ]).then(function (answer) {
        if (answer.add === "DEPARTMENT") {
            console.log("Add a new: " + answer.add);
            addDepartment();
        } else if (answer.add === "ROLE") {
            console.log("Add a new: " + answer.add);
            addRole();
        }
        else if (answer.add === "EMPLOYEE") {
            console.log("Add a new: " + answer.add);
        } else {
            connection.end();
        }  
    });
};

addDepartment = () => {
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "What department would you like to add?"
        }
    ]).then(function (answer) {
        connection.query(`INSERT INTO department (name) VALUES ('${answer.department}')`, function (err, res) {
            if (err) throw err;
            console.log("1 new department added: " + answer.department);
        })
    })
};

addRole = () => {
    let departmentOptions = [];
    for (i = 0; i < departments.length; i++) {
        departmentOptions.push(Object(departments[i]));
    };
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What position would you like to add?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this position?"
        },
        {
            name: "department_id",
            type: "list",
            message: "What is the department for this position?",
            choices: departmentOptions
        },
    ]).then(function (answer) {
        for (i = 0; i < departmentOptions.length; i++) {
            if (departmentOptions[i].name === answer.department_id) {
                department_id = departmentOptions[i].id
            }
        }


        connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', ${department_id})`, function (err, res) {
            if (err) throw err;

            console.log("1 new role now added: " + answer.title);
        })
    })
};

function addEmployee() {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is the employee first name?"
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employee last name?"
        },
        {
            name: "role_id",
            type: "input",
            message: "What is the role (ID) of the employee?"
        },
        {
            name: "manager_id",
            type: "input",
            message: "What is the role (ID) of the employee?"
        }

    ]).then(function (answer) {
        connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', '${answer.department_id}')`, function (err, res) {
            if (err) throw err;
            console.log("1 new role added: " + answer.title);
        })
    })
};
