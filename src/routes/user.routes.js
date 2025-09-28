// src/routes/user.routes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/user.controller');

const router = express.Router();

router.post('/register', registerUser); // Punto 1
router.post('/login', loginUser);       // Punto 2

module.exports = router;