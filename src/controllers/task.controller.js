// src/controllers/task.controller.js
const { query } = require('../config/db.config');
const SCHEMA = 'task_manager'; 

const createTask = async (req, res) => {
    const userId = req.userId; // Viene del JWT
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'El título de la tarea es obligatorio.' });

    try {
        const insertTaskQuery = `
            INSERT INTO ${SCHEMA}.tasks (user_id, title, description) 
            VALUES ($1, $2, $3) 
            RETURNING id, title, description, status, created_at, user_id
        `;
        const result = await query(insertTaskQuery, [userId, title, description]);
        res.status(201).json({ message: 'Tarea creada exitosamente.', task: result.rows[0] });

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

const listUserTasks = async (req, res) => {
    const userId = req.userId; // Viene del JWT
    try {
        const listTasksQuery = `
            SELECT id, title, description, status, created_at 
            FROM ${SCHEMA}.tasks 
            WHERE user_id = $1
            ORDER BY created_at DESC
        `;
        const result = await query(listTasksQuery, [userId]);
        res.status(200).json({ tasks: result.rows });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor al listar las tareas.' });
    }
};

const updateTaskStatus = async (req, res) => {
    const taskId = req.params.id;
    const userId = req.userId; 
    const { status } = req.body;

    const validStatuses = ['pending', 'in_progress', 'done'];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ message: `Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}.` });
    }
    try {
        const updateQuery = `
            UPDATE ${SCHEMA}.tasks 
            SET status = $1 
            WHERE id = $2 AND user_id = $3 
            RETURNING id, status, title
        `;
        const result = await query(updateQuery, [status, taskId, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada o no tienes permiso para modificarla.' });
        }
        res.status(200).json({ message: 'Estado de la tarea actualizado exitosamente.', task: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor al actualizar el estado.' });
    }
};

module.exports = {
    createTask,
    listUserTasks,
    updateTaskStatus
};