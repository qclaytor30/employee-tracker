const inquirer = require('inquirer');
const mysql = require('mysql');
const { printTable } = require('console-table-printer');
const figlet = require('figlet');

let roles;
let managers;
let departments;
let employees;

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Qsc7192000.',
    database: 'business_db'
},
    console.log(`Connected to the database.`)
);

figlet('Welcome to Employee Tracker', (err, result) => {
    console.log(err || result);
});

connection.connect(function (err) {
    if (err) throw err;
    start();
    getRoles(); getManagers(); getDepartments(); getEmployees();
})

start = () => {
    inquirer.prompt({
            name: "choices",
            type: "list",
            message: "Which would you like to do?",
            choices: ["ADD", "VIEW", "UPDATE", "DELETE"]
        })
        .then(function (answer) {
            if (answer.choices === "ADD") {
                addSomething(
                )
            }
            else if (answer.choices === "VIEW") {
                viewSomething();
            }
            else if (answer.choices === "UPDATE") {
                updateSomething();
            }
            else if (answer.choices === "DELETE") {
                deleteSomething();
            }
            else if (answer.choices === "EXIT") {
                console.log("Bye!");
                connection.end();
            }
            else {
                connection.end();
            }
        });
}
getRoles = () => {
    connection.query("SELECT id, title FROM role",(err, res) => {
        if (err) throw err;
        roles = res;
    })
};
getDepartments = () => {
    connection.query("SELECT id, name FROM department",(err, res) => {
        if (err) throw err;
        departments = res;
    })
};
getManagers = () => {
    connection.query("SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee",(err, res) => {
        if (err) throw err;
        managers = res;
    })
};
getEmployees = () => {
    connection.query("SELECT id, CONCAT_WS(' ', first_name, last_name) AS Employee_Name FROM employee",(err, res) => {
        if (err) throw err;
        employees = res;
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
        connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', ${department_id})`,(err, res) => {
            if (err) throw err;
            console.log("1 new role now added: " + answer.title);
            getRoles();
            start();
        })
    })
};

addEmployee = () => {
    let roleOptions = [];
    for (i=0; i < roles.length; i++) {
        roleOptions.push(Object(roles[i]));
    };
    let managerOptions = [];
    for (i = 0; i < managers.length; i++) {
        managerOptions.push(Object(managers[i]));
    }
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
            name: "role_id",
            type: "list",
            message: "What is the department of the positon?",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < roleOptions.length; i++) {
                    choiceArray.push(roleOptions[i].title)
                }
                return choiceArray;
            }
        },
        {
            name: "manager_id",
            type: "list",
            message: "Who is the manager of the employee?",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < managerOptions.length; i++) {
                    choiceArray.push(managerOptions[i].managers)
                }
                return choiceArray;
        }
    }
    ]).then(function (answer) {
        for (i = 0; i < roleOptions.length; i++) {
            if (roleOptions[i].title === answer.role_id) {
                role_id = roleOptions[i].id
            }
        }

        for (i = 0; i < managerOptions.length; i++) {
            if (managerOptions[i].managers === answer.manager_id) {
                manager_id = managerOptions[i].id
            }
        }
        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.first_name}', '${answer.last_name}', ${role_id}, ${manager_id})`, function (err, res) {
            if (err) throw err;
            console.log("1 new employee added: " + answer.first_name + " " + answer.last_name);
            getEmployees();
            start()
        })
    })
};

viewSomething = () => {
    inquirer.prompt([
        {
            name: "viewChoice",
            type: "list",
            message: "What would you like to view?",
            choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "EXIT"]
        }
    ]).then(answer => {
        if (answer.viewChoice === "DEPARTMENTS") {
            viewDepartments();
        }
        else if (answer.viewChoice === "ROLES") {
            viewRoles();
        }
        else if (answer.viewChoice === "EMPLOYEES") {
            viewEmployees();
        }
        else if (answer.viewChoice === "EXIT") {
            console.log("Thanks for using FSC Employee Tracker!!!");
            connection.end();
        } else {
            connection.end();
        }
    })
};

viewDepartments = () => {
    connection.query("SELECT * FROM department",(err, res) => {
        if (err) throw err;
        printTable(res);
        start();
    });
};

viewRoles = () => {
    connection.query("SELECT  r.id, r.title, r.salary, d.name as Department_Name FROM role AS r INNER JOIN department AS d ON r.department_id = d.id", function (err, res) {
        if (err) throw err;
        printTable(res);
        start();
    });
};

viewEmployees = () => {
    connection.query('SELECT e.id, e.first_name, e.last_name, d.name AS department, r.title, r.salary, CONCAT_WS(" ", m.first_name, m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.id ASC', function (err, res) {
        if (err) throw err;
        printTable(res);
        start();
    });
};

updateSomething = () => {
    inquirer.prompt([
        {
            name: "update",
            type: "list",
            message: "Choose something to update:",     
            choices: ["Update employee roles", "Update employee managers","EXIT"]
        }
    ]).then(answer => {
        if (answer.update === "Update employee roles") {
            updateEmployeeRole();
        }
        else if (answer.update === "Update employee managers") {
            updateEmployeeManager();
        }
        else if (answer.update === "EXIT") {
            connection.end();
        } else {
            connection.end();
        }
    })
};

updateEmployeeRole = () => {
    let employeeOptions = [];
    for (var i = 0; i < employees.length; i++) {
        employeeOptions.push(Object(employees[i]));
    }
    inquirer.prompt([
        {
            name: "updateRole",
            type: "list",
            message: "Which employee's role do you want to update?",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < employeeOptions.length; i++) {
                    choiceArray.push(employeeOptions[i].Employee_Name);
                }
                return choiceArray;
            }
        }
    ]).then(answer => {
        let roleOptions = [];
        for (i = 0; i < roles.length; i++) {
            roleOptions.push(Object(roles[i]));
        };
        for (i = 0; i < employeeOptions.length; i++) {
            if (employeeOptions[i].Employee_Name === answer.updateRole) {
                employeeSelected = employeeOptions[i].id
            }
        }
        inquirer.prompt([
            {
                name: "newRole",
                type: "list",
                message: "Select a new role:",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < roleOptions.length; i++) {
                        choiceArray.push(roleOptions[i].title)
                    }
                    return choiceArray;
                }
            }
        ]).then(answer => {
            for (i = 0; i < roleOptions.length; i++) {
                if (answer.newRole === roleOptions[i].title) {
                    newChoice = roleOptions[i].id
                    newChoice
                    connection.query(`UPDATE employee SET role_id = ${newChoice} WHERE id = ${employeeSelected}`), function (err, res) {
                        if (err) throw err;
                    };
                }
            }
            console.log("Role updated succesfully");
            getEmployees();
            getRoles();
            start();
        })
    })
};

updateEmployeeManager = () => {
    let employeeOptions = [];

    for (var i = 0; i < employees.length; i++) {
        employeeOptions.push(Object(employees[i]));
    }
    inquirer.prompt([
        {
            name: "updateManager",
            type: "list",
            message: "Which employee's manager do you want to update?",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < employeeOptions.length; i++) {
                    choiceArray.push(employeeOptions[i].Employee_Name);
                }
                return choiceArray;
            }
        }
    ]).then(answer => {
        let managerOptions = [];
        for (i = 0; i < managers.length; i++) {
            managerOptions.push(Object(managers[i]));
        };
        for (i = 0; i < employeeOptions.length; i++) {
            if (employeeOptions[i].Employee_Name === answer.updateManager) {
                employeeSelected = employeeOptions[i].id
            }
        }
        inquirer.prompt([
            {
                name: "newManager",
                type: "list",
                message: "Select a new manager:",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < managerOptions.length; i++) {
                        choiceArray.push(managerOptions[i].managers)
                    }
                    return choiceArray;
                }
            }
        ]).then(answer => {
            for (i = 0; i < managerOptions.length; i++) {
                if (answer.newManager === managerOptions[i].managers) {
                    newChoice = managerOptions[i].id
                    connection.query(`UPDATE employee SET manager_id = ${newChoice} WHERE id = ${employeeSelected}`), (err, res) => {
                        if (err) throw err;
                    };
                    console.log("Manager Updated");
                }
            }
            getEmployees();
            getManagers();
            start();
        })
    })
};
deleteSomething = () => {
    inquirer.prompt([
        {
            name: "delete",
            type: "list",
            message: "Select something to delete:",
            choices: ["Delete department", "Delete role", "Delete employee", "EXIT"]
        }
    ]).then(answer => {
        if (answer.delete === "Delete department") {
            deleteDepartment();
        }
        else if (answer.delete === "Delete role") {
            deleteRole();
        }
        else if (answer.delete === "Delete employee") {
            deleteEmployee();
        } else if (answer.delete === "EXIT") {
            console.log("Bye!");

            connection.end();
        }
        else {
            connection.end();
        }
    })
};

deleteDepartment = () => {
    let departmentOptions = [];
    for (var i = 0; i < departments.length; i++) {
        departmentOptions.push(Object(departments[i]));
    }
    inquirer.prompt([
        {
            name: "deleteDepartment",
            type: "list",
            message: "Select a department to delete",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < departmentOptions.length; i++) {
                    choiceArray.push(departmentOptions[i])
                }
                return choiceArray;
            }
        }
    ]).then(answer => {
        for (i = 0; i < departmentOptions.length; i++) {
            if (answer.deleteDepartment === departmentOptions[i].name) {
                newChoice = departmentOptions[i].id
                console.log(newChoice);
                connection.query(`DELETE FROM department Where id = ${newChoice}`), (err, res) => {
                    if (err) throw err;
                };
                console.log("Department: " + answer.deleteDepartment + " Deleted Succesfully");
            }
        }
        getDepartments();
        start();
    })
};

deleteRole = () => {
    let roleOptions = [];
    for (var i = 0; i < roles.length; i++) {
        roleOptions.push(Object(roles[i]));
    }
    inquirer.prompt([
        {
            name: "deleteRole",
            type: "list",
            message: "Select a role to delete",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < roleOptions.length; i++) {
                    choiceArray.push(roleOptions[i].title)
                }
                return choiceArray;
            }
        }
    ]).then(answer => {
        for (i = 0; i < roleOptions.length; i++) {
            if (answer.deleteRole === roleOptions[i].title) {
                newChoice = roleOptions[i].id
                console.log(newChoice);
                connection.query(`DELETE FROM role Where id = ${newChoice}`), (err, res) => {
                    if (err) throw err;
                };
                console.log("Role: " + answer.deleteRole + " Deleted Succesfully");
            }
        }
        getRoles();
        start();
    })
};

deleteEmployee = () => {
    let employeeOptions = [];
    for (var i = 0; i < employees.length; i++) {
        employeeOptions.push(Object(employees[i]));
    }
    inquirer.prompt([
        {
            name: "deleteEmployee",
            type: "list",
            message: "Select a employee to delete",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < employeeOptions.length; i++) {
                    choiceArray.push(employeeOptions[i].Employee_Name)
                }
                return choiceArray;
            }
        }
    ]).then(answer => {
        for (i = 0; i < employeeOptions.length; i++) {
            if (answer.deleteEmployee === employeeOptions[i].Employee_Name) {
                newChoice = employeeOptions[i].id
                connection.query(`DELETE FROM employee Where id = ${newChoice}`), (err, res) => {
                    if (err) throw err;
                };
                console.log("Employee: " + answer.deleteEmployee + " Deleted Succesfully");
            }
        }
        getEmployees();
        start();
    })
};