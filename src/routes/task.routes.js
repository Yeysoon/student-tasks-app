// src/routes/task.routes.js
const express = require('express');
const { createTask, listUserTasks, updateTaskStatus } = require('../controllers/task.controller');
const verifyToken = require('../middlewares/auth.middleware'); 

const router = express.Router();

// TODAS estas rutas están protegidas por verifyToken
router.post('/', verifyToken, createTask);         // Punto 3
router.get('/', verifyToken, listUserTasks);       // Punto 4
router.put('/:id/status', verifyToken, updateTaskStatus); // Punto 5

module.exports = router;