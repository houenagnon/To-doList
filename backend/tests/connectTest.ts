//Module that creates connection with database
import sqlite from 'sqlite3';
const path = require('path');

const dbTest = new sqlite.Database(path.join(__dirname, './db.test.sqlite3'), sqlite.OPEN_READWRITE, (err)=>{
    if (err) return console.log(err);
});


module.exports = dbTest;
