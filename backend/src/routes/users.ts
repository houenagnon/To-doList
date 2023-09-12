import express from 'express';
const router_u = express.Router();

const {register, login, getAllUsers } = require('../controllers/users');

router_u.route('/register').post(register);
router_u.route('/login').post(login);
//router_u.route('/').get(getAllUsers)

module.exports = router_u;