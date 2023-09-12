//Module that registers and logs user
import express from "express"
const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
import {v4 as uuid} from "uuid"

const db = require('../models/connect');


/**
 * register: function that registers user
 * @param req - Request object
 * @param res - Response object
 */
const register = async (req: express.Request, res:express.Response) =>{
    const {name, email, password} = req.body
    if(!name || !email || !password)
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: "Provide name, email and password"});
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const id = uuid();

    await db.run(
        `INSERT INTO users(id, name, email, password) VALUES (?, ?, ?, ?)`,
        [id, name, email, passwordHash],
        (err: Error)=>{
            if(err) 
            {
                if (err.message.includes("SQLITE_CONSTRAINT"))
                {
                    const missedVariable = err.message.split('.')[1]
                    return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: `${missedVariable} already exists`})
                }
                else
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false});
            }
            return res.status(StatusCodes.CREATED).json({success: true, msg:"Created successfully"});
        }
    )
}


/**
 * login: function that logs user
 * @param req - Request object
 * @param res - Response object
 */
const login = (req: express.Request, res:express.Response) =>{
    const { email, password } = req.body;
    console.log("abel"+email, password);
    if(!email || !password)
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: "Email and password must be provided"});
    
    db.get(
        `SELECT * FROM users WHERE email = "${email}"`,
        [],
        async (err: Error, row: any)=>{
            if(err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false});

            const user = row;
            console.log(user)
            if (user)
            {
                const isMatch = await bcrypt.compare(password, user.password)
                if(isMatch){
                    const token = jwt.sign(
                        { userId: user.id, name: user.name },
                        process.env.JWT_SECRET,
                        {expiresIn: process.env.JWT_LIFETIME,}
                    )
                    return res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
                }
                else{
                    return res.status(StatusCodes.UNAUTHORIZED).json({success: false, msg: "Invalid password"});
                }
            }
            else return res.status(StatusCodes.UNAUTHORIZED).json({success: false, msg: "Invalid credential"});

        }
    )
};

// const getAllUsers = async (req: express.Request, res:express.Response) =>{
//     db.all(
//         `SELECT * FROM users`,
//         [],
//         (err: Error, rows: any[])=>{
//             if(err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false});
//             if(rows) return res.status(StatusCodes.OK).json({rows})
//         }
//     )
// }

module.exports = {
    register,
    login,
};