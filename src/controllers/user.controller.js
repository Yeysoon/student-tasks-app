// src/controllers/user.controller.js
const { query } = require('../config/db.config'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

const SCHEMA = 'task_manager'; 

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    try {
        const checkUserQuery = `SELECT id FROM ${SCHEMA}.users WHERE email = $1`;
        if ((await query(checkUserQuery, [email])).rows.length > 0) {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const insertUserQuery = `
            INSERT INTO ${SCHEMA}.users (name, email, password) 
            VALUES ($1, $2, $3) 
            RETURNING id, name, email
        `;
        const newUser = await query(insertUserQuery, [name, email, hashedPassword]);
        res.status(201).json({ message: 'Usuario registrado exitosamente.', user: newUser.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
    try {
        const userQuery = `SELECT id, email, password FROM ${SCHEMA}.users WHERE email = $1`;
        const user = (await query(userQuery, [email])).rows[0];
        if (!user) return res.status(401).json({ message: 'Credenciales inválidas.' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas.' });
        
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_JWT, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login exitoso.', token: token, userId: user.id });

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = {
    registerUser,
    loginUser
};

