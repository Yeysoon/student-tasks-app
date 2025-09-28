// src/app.js
const express = require('express');
const app = express();
require('dotenv').config(); 

// Importar rutas
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');

// Middlewares
app.use(express.json()); 
app.use(express.static('public')); 

// Rutas
app.use('/users', userRoutes); 
app.use('/tasks', taskRoutes); 

// Puerto y encendido del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});