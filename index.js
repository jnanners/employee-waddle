const db = require("./db/connection");
const Menu = require("./utils/query");

db.connect(err => {
    if(err){
        console.log(err)
    }
    else{
        console.log("Connected to database")
        new Menu().start();
    }
})