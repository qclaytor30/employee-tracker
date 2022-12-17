import { createConnection } from 'mysql';
import { prompt } from 'inquirer';
import cTable from 'console.table';

var connection = createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "P@ssw0rd",
    database: "employees_db"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    prompt({
            name: "choices",
            type: "list",
            message: "Which would you like to do?",
            choices: ["ADD", "VIEW", "UPDATE", "DELETE"]
        })
        .then(function (answer) {
            if (answer.choices === "ADD") {
                afterConnection();
                console.log(answer.choices);
            }
            else if (answer.choices === "VIEW") {

            }
    /////
        });
}

function addSomething() {
    prompt([
        {
            name: "add",
            type: "list",
            message: "Which would you like to add?",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"]
        }
    ]).then(function (answer) {
        if (answer.add === "DEPARTMENT") {
            console.log("Add a new: " + answer.add);
        }
        else if (answer.add === "ROLE") {
            console.log("Add a new: " + answer.add);
        }
        else if (answer.add === "EMPLOYEE") {
            console.log("Add a new: " + answer.add);
        } else {
            connection.end();
        }
    })
}
function afterConnection() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
}