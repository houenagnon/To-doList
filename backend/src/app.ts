import express from 'express'
require('dotenv').config();
const cors = require('cors')
const TaskRouter = require('./routes/tasks');
const UserRouter = require('./routes/users');
const {authenticationMiddleware} = require('./middleware/auth')
const app = express();

//To extend Request objets by adding a user property
declare global {
    namespace Express {
      interface Request {
        user: any;
      }
    }
}

app.use(cors());
app.use(express.json());
app.use('/api/users', UserRouter)
app.use('/api/tasks',authenticationMiddleware, TaskRouter)

export default app;