const db = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");



db.connect(err => {
    if(err) throw err;
    console.log("Connected to database")
})