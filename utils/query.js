const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("../db/connection");

let roleList = [];
let employeeList = [];
let departmentList = [];
let role_id;
let manager_id;
let department_id;
let employee_id;

class Menu {
    start(){
        inquirer.prompt(
            {
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: [
                    "View all departments",
                    "Add a department",
                    "View all employees",
                    "Add employee",
                    "Update employee role",
                    "View all roles",
                    "Add role"
                ]
            }
        ).then(choice => this.optionSelect(choice.action))
    }

    updateRoleList(){
        const sql = `SELECT * FROM roles`;

        db.query(sql, (err, rows) => {
            if(err){
                console.log(err);
            }
            roleList.length = 0;

            for(let i = 0; i < rows.length; i++){
                let {title} = rows[i];
                roleList.push(title);
            }
        })
    }

    updateEmployeesList(){
        const sql = `SELECT * FROM employees`;

        db.query(sql, (err, rows) => {
            if(err){
                console.log(err);
            }
            employeeList.length = 0;

            for(let i = 0; i < rows.length; i++){
                let {first_name, last_name} = rows[i];
                employeeList.push(first_name + " " + last_name);
            }
            employeeList.push("NULL");
        })
    }

    updateDepartmentList(){
        const sql = `SELECT * FROM departments`;

        db.query(sql, (err, rows) => {
            if(err){
                console.log(err);
            }
            departmentList.length = 0;

            for(let i = 0; i < rows.length; i++){
                let {name} = rows[i];
                departmentList.push(name);
            }
        })
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

    addEmployee(newEmployee){
        role_id = roleList.indexOf(newEmployee.role) + 1;
        manager_id = employeeList.indexOf(newEmployee.manager) + 1;

        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                    VALUES 
                    ("${newEmployee.firstName}", "${newEmployee.lastName}", ${role_id}, ${manager_id})`;

        db.query(sql, (err, result) => {
            if(err){
                console.log(err);
            }
            console.log(`${newEmployee.firstName} ${newEmployee.lastName} added to employees`);
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

    addRole(newRole){
        department_id = departmentList.indexOf(newRole.department) + 1;
        let salary = parseInt(newRole.salary);

        const sql = `INSERT INTO roles (title, salary, department_id)
                    VALUES ("${newRole.role}", ${salary}, ${department_id})`;

        db.query(sql, (err, rows) => {
            if(err){
                console.log(err);
            }
            console.log(`${newRole.role} added too roles`);
            this.start();
        })
    }

    updateEmployeeRole(newRole){
        role_id = roleList.indexOf(newRole.role) + 1;
        employee_id = employeeList.indexOf(newRole.employee) + 1;


        const sql = `UPDATE employees
                    SET role_id = ${role_id}
                    WHERE id = ${employee_id}`;

        db.query(sql, (err, rows) => {
            if(err){
                console.log(err);
            }
            console.log(`${newRole.employee}'s role has been updated to ${newRole.role}'`);
            this.start();
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
            case "View all employees":
                this.allEmployees();
                break; 
            case "Add employee":
                this.updateRoleList();
                this.updateEmployeesList();
                inquirer.prompt(
                    [
                        {
                            type: "input",
                            name: "firstName",
                            message: "Enter new employees first name"
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: "Enter new employees last name"
                        },
                        {
                            type: "list",
                            name: "role",
                            message: "Choose new employees role",
                            choices: roleList
                        },
                        {
                            type: "list",
                            name: "manager",
                            message: "Choose new employees manager",
                            choices: employeeList
                        }
                    ]
                )
                .then(newEmployee => this.addEmployee(newEmployee))
                break;
            case "Update employee role":
                this.updateEmployeesList();
                this.updateRoleList();
                inquirer.prompt(
                    [
                        //if i remove the first input prompt the employee list won't load???
                        {
                            type: "input",
                            name: "confirm",
                            message: "Please press enter to confirm",
                        },
                        {
                            type: "list",
                            name: "employee",
                            message: "What employee's role would you like to update?",
                            choices: employeeList
                        },
                        {
                            type: "list",
                            name: "role",
                            message: "What role would you like to give them?",
                            choices: roleList
                        }
                    ]
                )
                .then(updatedRole => this.updateEmployeeRole(updatedRole))
                break;
            case "View all roles":
                this.allRoles();
                break;
            case "Add role":
                this.updateDepartmentList();
                inquirer.prompt(
                    [
                        {
                            type: "input",
                            name: "role",
                            message: "Enter the name of the new role"
                        },
                        {
                            type: "input",
                            name: "salary",
                            message: "Enter the salary of the new role"
                        },
                        {
                            type: "list",
                            name: "department",
                            message: "Choose the department of the new role",
                            choices: departmentList
                        }
                    ]
                )
                .then(newRole => this.addRole(newRole))
                break;
        }
    }
}

module.exports = Menu;