const { StatusCodes } = require('http-status-codes')

class UnauthenticatedError extends Error {
  statusCode: any;
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

module.exports = UnauthenticatedError
