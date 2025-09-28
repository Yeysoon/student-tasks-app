// public/app.js
const API_BASE_URL = window.location.origin; // Usa el dominio actual (Render o localhost)

// Elementos del DOM
const authSection = document.getElementById('auth-section');
const tasksSection = document.getElementById('tasks-section');
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const logoutBtn = document.getElementById('logout-btn');
const tasksList = document.getElementById('tasks-list');
const noTasksMessage = document.getElementById('no-tasks-message');

let token = localStorage.getItem('token');

// ---------------------------
// 1. UTILIDADES Y VISTAS
// ---------------------------

const updateView = () => {
    if (token) {
        authSection.style.display = 'none';
        tasksSection.style.display = 'block';
        logoutBtn.style.display = 'block';
        fetchTasks();
    } else {
        authSection.style.display = 'block';
        tasksSection.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}

const handleLogout = () => {
    localStorage.removeItem('token');
    token = null;
    updateView();
}

// ---------------------------
// 2. FETCH PARA ENDPOINTS
// ---------------------------

// Función genérica para peticiones API
const apiFetch = async (endpoint, method, body = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        // Adjunta el JWT para proteger las rutas de tareas
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return response;
}

// Punto 4: Listar Tareas
const fetchTasks = async () => {
    try {
        const response = await apiFetch('/tasks', 'GET');
        const data = await response.json();

        tasksList.innerHTML = '';
        if (data.tasks && data.tasks.length > 0) {
            noTasksMessage.style.display = 'none';
            data.tasks.forEach(task => {
                tasksList.innerHTML += createTaskCard(task);
            });
        } else {
            noTasksMessage.style.display = 'block';
        }

    } catch (error) {
        console.error('Error al obtener tareas:', error);
        alert('Error al cargar tareas.');
        handleLogout(); // Si falla al cargar, el token podría ser inválido
    }
}

// Punto 5: Actualizar Estado de Tarea
const updateTaskStatus = async (taskId, currentStatus) => {
    let newStatus;
    // Lógica para avanzar el flujo
    if (currentStatus === 'pending') {
        newStatus = 'in_progress';
    } else if (currentStatus === 'in_progress') {
        newStatus = 'done';
    } else {
        return; // No se puede avanzar si ya está done
    }

    try {
        const response = await apiFetch(`/tasks/${taskId}/status`, 'PUT', { status: newStatus });

        if (response.ok) {
            fetchTasks(); // Recargar la lista
        } else {
            const errorData = await response.json();
            alert('Error al actualizar: ' + (errorData.message || response.statusText));
        }
    } catch (error) {
        console.error('Error al actualizar estado:', error);
    }
}


// ---------------------------
// 3. GENERACIÓN DE HTML
// ---------------------------

const createTaskCard = (task) => {
    // Determinar el texto y color del botón para el flujo (Punto 5)
    let buttonText, buttonClass, isDisabled = false;

    if (task.status === 'pending') {
        buttonText = 'Iniciar Tarea';
        buttonClass = 'btn-start';
    } else if (task.status === 'in_progress') {
        buttonText = 'Terminar Tarea';
        buttonClass = 'btn-complete';
    } else {
        buttonText = 'Completada';
        buttonClass = 'btn-done';
        isDisabled = true;
    }

    return `
        <div class="task-card status-${task.status}">
            <div class="task-info">
                <h4>${task.title}</h4>
                <p>${task.description || 'Sin descripción'}</p>
                <small>Estado: <strong>${task.status.toUpperCase()}</strong> | Creada: ${new Date(task.created_at).toLocaleDateString()}</small>
            </div>
            <div class="task-controls">
                <button 
                    onclick="updateTaskStatus(${task.id}, '${task.status}')"
                    class="${buttonClass}"
                    ${isDisabled ? 'disabled' : ''}
                >
                    ${buttonText}
                </button>
            </div>
        </div>
    `;
}

// ---------------------------
// 4. MANEJO DE EVENTOS
// ---------------------------

// Navegación entre Login y Registro
document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
});
document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.style.display = 'block';
    registerContainer.style.display = 'none';
});

// Logout
logoutBtn.addEventListener('click', handleLogout);


// Punto 1: Registro de Usuario
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const response = await apiFetch('/users/register', 'POST', { name, email, password });
    const data = await response.json();

    if (response.ok) {
        alert('Registro exitoso. ¡Inicia sesión!');
        // Muestra el login después del registro exitoso
        loginContainer.style.display = 'block';
        registerContainer.style.display = 'none';
        document.getElementById('register-form').reset();
    } else {
        alert('Error en el registro: ' + (data.message || response.statusText));
    }
});


// Punto 2: Login de Usuario
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await apiFetch('/users/login', 'POST', { email, password });
    const data = await response.json();

    if (response.ok) {
        token = data.token;
        localStorage.setItem('token', token);
        updateView(); // Actualiza la vista a la sección de tareas
        document.getElementById('login-form').reset();
    } else {
        alert('Error en el login: ' + (data.message || response.statusText));
    }
});


// Punto 3: Creación de Tarea
document.getElementById('create-task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;

    const response = await apiFetch('/tasks', 'POST', { title, description });
    const data = await response.json();

    if (response.status === 201) {
        alert('Tarea creada: ' + data.task.title);
        document.getElementById('create-task-form').reset();
        fetchTasks(); // Recargar la lista para mostrar la nueva tarea
    } else {
        alert('Error al crear tarea: ' + (data.message || response.statusText));
    }
});


// Inicialización
document.addEventListener('DOMContentLoaded', updateView);