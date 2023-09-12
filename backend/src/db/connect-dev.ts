//Module that creates connection with database
const sqlite = require('sqlite3');
const path = require('path');

const dbDev = new sqlite.Database(path.join(__dirname, '../db/db.sqlite3'), sqlite.OPEN_READWRITE, (err: Error)=>{
    if (err) return console.log(err);
});


module.exports = dbDev;
