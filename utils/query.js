const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("../db/connection");

class Menu {
    start(){
        inquirer.prompt(
            {
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: [
                    "View all departments",//
                    "Add a department",//
                    "Delete a department",
                    "View all employees",//
                    "View all employees by department",
                    "View all employees by manager",
                    "Add employee",
                    "Remove employee",
                    "Update employee role",
                    "Update employee manager",
                    "View all roles",//
                    "Add role",
                    "Remove role"
                ]
            }
        ).then(choice => this.optionSelect(choice.action))
    }

    allEmployees(){
        const sql = `SELECT employees.id, 
                    employees.first_name, 
                    employees.last_name, 
                    roles.title AS role, 
                    departments.name AS department, 
                    roles.salary AS salary,
                    CONCAT(manager.first_name, " ", manager.last_name) AS manager
                    FROM employees
                    LEFT JOIN roles
                    ON employees.role_id = roles.id
                    LEFT JOIN departments 
                    ON roles.department_id = departments.id
                    LEFT JOIN employees manager
                    ON manager.id = employees.manager_id`;

        db.query(sql, (err, rows) => {
            if(err){
                console.log(err);
            }
            console.table(rows);
            this.start();
        })
    }

    allDepartments(){
        const sql = `SELECT * FROM departments`;

        db.query(sql, (err, rows) => {
            if (err){
                console.log(err);
            }
            console.table(rows);
            this.start();
        })
    }

    allRoles(){
        const sql = `SELECT roles.id,
                    roles.title,
                    roles.salary,
                    departments.name AS department
                    FROM roles
                    LEFT JOIN departments
                    ON roles.department_id = departments.id`;

        db.query(sql, (err, rows) => {
            if(err){
                console.log(err);
            }
            console.table(rows);
            this.start();
        })
    }

    addDepartment(name){
        const sql = `INSERT INTO departments (name)
                    VALUES ("${name}")`;
                
        db.query(sql, (err, result) => {
            if(err){
                console.log(err);
            }
            console.log(`Adding ${name} to department list`);
            this.start();
        })
    }

    deleteDepartment(name){
        const sql = `DELETE FROM departments
                    WHERE departments.name = ${name}`;
        
        db.query(sql, (err, result) => {
            if(err){
                console.log(err);
            }
            console.log(`Deleting ${name} from department list`);
        })
    }

    optionSelect(choice){
        console.log(choice);
        switch(choice){
            case "View all departments":
                this.allDepartments();
                break;
            case "Add a department":
                inquirer.prompt(
                    {
                        type: "input",
                        name: "depName",
                        message: "Enter the name of the new department"
                    }
                )
                .then(input => this.addDepartment(input.depName))
                break;
            case "Delete a department":
                inquirer.prompt(
                    {
                        type: "input",
                        name: "depName",
                        message: "Enter the name of the department you'd like to delete"
                    }
                )
                .then(input => this.deleteDepartment(input.depName))
                break;
            case "View all employees":
                this.allEmployees();
                break; 
            case "View all employees by department":
                //code goes here
                break;
            case "View all employees by manager":
                //code goes here
                break;
            case "Add employee":
                //code goes here
                break;
            case "Remove employee":
                //code goes here
                break;
            case "Update employee role":
                //code goes here
                break;
            case "Update employee manager":
                //code goes here
                break;
            case "View all roles":
                this.allRoles();
                break;
            case "Add role":
                //code goes here
                break;
            case "Remove role":
                //code goes here
                break;
        }
    }
}

module.exports = Menu;