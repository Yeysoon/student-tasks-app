// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Espera un formato: "Bearer [token]"
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Se requiere un token de autenticación.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        
        // Adjuntamos el ID del usuario al objeto 'req' para usarlo en los controladores de tareas
        req.userId = decoded.id; 
        
        next(); 

    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado. Vuelve a iniciar sesión.' });
    }
};

module.exports = verifyToken;