var mysql = require("mysql");
var conn = mysql.createConnection({
    host : "localhost",
    user:"root",
    password:"Jagpal@singh12345",
    database: "login"
});
console.log("mysql is connected ")

module.exports = conn;