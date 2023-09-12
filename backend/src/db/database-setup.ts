//Creation of database and table
const sqlite3 = require('sqlite3');

const Db = new sqlite3.Database('./db.sqlite3', sqlite3.OPEN_READWRITE, (err: Error)=>{
    if (err) return console.log(err);
});

//SQL queries to create tables in database
const createUserDDL = "CREATE TABLE users(id VARCHAR(255) PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255))";
const createTaskDDL = "CREATE TABLE tasks(id VARCHAR(255) PRIMARY KEY, name VARCHAR(500)NOT NULL, created_at DATETIME, tag VARCHAR(50) NOT NULL, user_id VARCHAR(255), FOREIGN KEY(user_id) REFERENCES users(id))";
Db.run("DELETE FROM tasks WHERE id = '28c90c7b-be31-4795-8319-9f420f0f6a387'");

//module.exports = Db;
