/* eslint-disable object-curly-newline */
const express = require('express');
const { saveUser, loginUser, getUser } = require('../controllers/userControler');
const { regValidator } = require('../middleware/validator');

const mainRouter = express.Router();
mainRouter.post('/login', loginUser);
mainRouter.post('/', regValidator, saveUser);
mainRouter.get('/:secret', getUser);
module.exports = mainRouter;
