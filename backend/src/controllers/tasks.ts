//Module that retrieves all tasks, one task by id and creates task.
import express from "express"
const { StatusCodes } = require('http-status-codes')
const db = require('../models/connect');
import {v4 as uuid} from "uuid";

/**
 * getAllTasks - get all tasks
 * @param req - Request object
 * @param res - Response object
 */
const getAllTasks = async (req: express.Request, res:express.Response) =>{
    const user_id = req.user.id;
    db.all(
        `SELECT * FROM tasks WHERE user_id = '${user_id}'`,
        [],
        (err: Error, rows: any[])=>{
            if(err) throw new Error(err.message);
            if(rows) res.status(StatusCodes.OK).json({success: true,rows})
        }
    )
}


/**
 * getTask - get a task by id
 * @param req - Request object
 * @param res - Response object
 */
const getTask = async (req: express.Request, res:express.Response) =>{
    const id = req.params.id;
    const user_id = req.user.id;
    db.get(
        `SELECT * FROM tasks WHERE id = '${id}' AND user_id = '${user_id}'`,
        [],
        (err: Error, row: any[])=>{
            if(err) throw new Error(err.message);
            if(row) res.status(StatusCodes.OK).json({success: true,row});
        }
    )
}


/**
 * createTask - create new task
 * @param req - request object
 * @param res - response object
 */
const createTask = async (req: express.Request, res:express.Response) =>{
    const {name, tag} = req.body;
    const user_id = req.user.id;
    const id = uuid();

    if (!name || !tag || name === "" || tag === "")
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg:"Task's name and tag are required"})

    db.run(
        `INSERT INTO tasks(id, name, created_at, tag, user_id) VALUES (?, ?, datetime('now'), ?, ?)`,
        [id, name, tag, user_id],
        (err: Error)=>{
            if(err) 
            {
                if (err.message.includes("SQLITE_CONSTRAINT"))
                {
                    const missedVariable = err.message.split('.')[1]
                    return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg: `Task's ${missedVariable} is null`})
                }
                else
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false});
            }
            db.get(
                `SELECT * FROM tasks WHERE user_id = '${user_id}' ORDER BY tasks.created_at DESC LIMIT 1`,
                [],
                (err: Error, row: any)=>{
                    if(err) throw new Error(err.message);//return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, row: {}});
                    if(row) res.status(StatusCodes.CREATED).json({success: true, row})
                }
            ) 
            //return res.status(StatusCodes.CREATED).json({"success": true});
        }
    )
}

const updateTask = async (req: express.Request, res:express.Response) => {
    const {name, tag} = req.body;
    const user_id = req.user.id;
    const id = req.params.id;

    if (!id) return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg:"Task's id is required"})

    if (!name || !tag || name ==="" || tag === "")
        return res.status(StatusCodes.BAD_REQUEST).json({success: false, msg:"Task's name and tag are required"})

    let sql = "";
    if(!name)
        sql = `UPDATE tasks SET tag = '${tag}' WHERE id = '${id}' AND user_id = '${user_id}'`
    else if (!tag)
        sql = `UPDATE tasks SET name = '${name}' WHERE id = '${id}' AND user_id = '${user_id}'`
    else
        sql = `UPDATE tasks SET name = '${name}', tag = '${tag}' WHERE id = '${id}' AND user_id = '${user_id}'`
    
    db.run(
        sql,
        [],
        (err: Error)=>{
            if(err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false});
            return res.status(StatusCodes.OK).json({success: true});
        }
    )
}

const deleteTask = async (req: express.Request, res:express.Response) => {
    const user_id = req.user.id;
    const id = req.params.id;
    db.run(
        `DELETE FROM tasks WHERE id = ? AND user_id = ?`,
        [id, user_id],
        (err: Error)=>{
            if(err) throw new Error(err.message);//return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false});;
            return res.status(StatusCodes.OK).json({"success": true});
        }
    )
}

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
};