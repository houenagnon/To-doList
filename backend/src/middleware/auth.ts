import express from 'express'
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors/unauthenticated')
const {StatusCodes} = require('http-status-codes')

/*
* authenticationMiddleware: function that check json web token validity
*
* @param {obeject.Request} req - the user's request
* @param {obeject.Response} res - the server's response
* @param {obeject.Next} next - the next
*
*/
const authenticationMiddleware = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({success: false, msg:"Token not provided"});  
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { userId:id, name } = decoded
    req.user = { id, name }
    next()
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({success: false, msg:"Not authorized to access this route"})
  }
}

module.exports = {authenticationMiddleware, }