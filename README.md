# GUÍA COMPLETA DE IMPLEMENTACIÓN: APLICACIÓN WEB DE GESTIÓN DE TAREAS

Este script detalla el procedimiento completo para configurar, desarrollar y desplegar la aplicación de gestión de tareas (student-tasks-app) utilizando PostgreSQL, Node.js y Render.

---

## I. CONFIGURACIÓN DE LA BASE DE DATOS (POSTGRESQL EN RENDER)

1.  **Creación de la Instancia en Render:**
    * [cite_start]Crea una nueva instancia de base de datos PostgreSQL en tu cuenta de Render, nombrándola **`student-tasks-db`**[cite: 3].
    * [cite_start]Accede a la pestaña "Info" para obtener las credenciales de conexión (Hostname, Port, Username, Password, External Database URL, PSQL Command)[cite: 4, 5, 9, 10, 19, 21, 22].

2.  **Conexión e Inicialización de la DB:**
    * [cite_start]Conéctate a la base de datos de Render utilizando un manejador externo como **DBeaver**, usando las credenciales obtenidas, especialmente la cadena de conexión o los detalles del **PSQL Command**[cite: 26].
    * Ejecuta el script SQL para crear la estructura de la base de datos:
        * [cite_start]Crea el esquema **`task_manager`**[cite: 37].
        * [cite_start]Crea la tabla **`users`** con los campos `id` (SERIAL, PK), `name` (VARCHAR, NOT NULL), `email` (VARCHAR, UNIQUE, NOT NULL) y `password` (VARCHAR, NOT NULL)[cite: 38, 55, 56, 57].
        * [cite_start]Crea la tabla **`tasks`** con los campos `id` (SERIAL, PK), `user_id` (INTEGER, FK a `users.id`), `title` (VARCHAR, NOT NULL), `description` (TEXT), `status` (VARCHAR, con valor por defecto 'pending') y `created_at` (TIMESTAMP, con valor por defecto `NOW()`)[cite: 42, 44, 45, 46, 47, 48].
        * [cite_start]Asegura la validación para el campo `status` a nivel de base de datos, restringiendo los valores a 'pending', 'in\_progress', y 'done'[cite: 58].

---

## II. CONFIGURACIÓN DEL ENTORNO LOCAL Y BACKEND (NODE.JS)

1.  **Creación y Clonación del Repositorio:**
    * [cite_start]Crea un nuevo repositorio en GitHub llamado **`student-tasks-app`**[cite: 67].
    * [cite_start]Clona este repositorio en tu entorno local (IDE, ej. VS Code)[cite: 77, 81].

2.  **Estructura del Proyecto:**
    * [cite_start]Crea la estructura de carpetas mínima requerida, incluyendo: **`public`** (para el Frontend), **`src/config`**, **`src/controllers`**, **`src/routes`**, y los archivos principales **`app.js`**, **`.env`**, **`package.json`** y **`README.md`**[cite: 89, 91, 103, 107].

3.  **Configuración de la Conexión a DB:**
    * [cite_start]En el archivo de configuración de la base de datos (`src/config/db.config.js`), utiliza el módulo **`pg` (Pool)** para establecer la conexión[cite: 119, 123].
    * [cite_start]Asegúrate de cargar las variables de entorno (`dotenv`)[cite: 120].
    * [cite_start]La cadena de conexión debe tomarse de la variable de entorno **`process.env.DATABASE_URL`**[cite: 124].
    * [cite_start]Configura la opción **`ssl: { rejectUnauthorized: false }`** para permitir la conexión segura al servidor externo de Render[cite: 125, 127].

4.  **Configuración del Servidor y Rutas:**
    * [cite_start]En el archivo principal (`src/app.js`), inicializa **Express**[cite: 183, 184].
    * [cite_start]Aplica el middleware **`express.json()`** para parsear peticiones JSON[cite: 188].
    * [cite_start]Aplica el middleware **`express.static('public')`** para servir los archivos del frontend (HTML, CSS, JS puro)[cite: 189].
    * Define las rutas de la API, importando los controladores necesarios:
        * [cite_start]**`/users`** para registro y login[cite: 191].
        * [cite_start]**`/tasks`** para la gestión de tareas[cite: 192].
    * [cite_start]Inicia el servidor en el puerto definido por la variable de entorno **`process.env.PORT`** o por defecto **`3000`**[cite: 194, 195].

5.  **Instalación y Ejecución Local:**
    * [cite_start]Ejecuta **`npm install`** para descargar todas las dependencias del proyecto[cite: 217].
    * [cite_start]Ejecuta **`npm start`** para inicializar el servidor de Node.js[cite: 226].
    * [cite_start]Verifica que el servidor inicie correctamente ("Servidor corriendo en el puerto 3000")[cite: 229].

6.  **Control de Versiones:**
    * [cite_start]Realiza un commit de todos los cambios con un mensaje apropiado[cite: 234].
    * [cite_start]Sube el código a GitHub (Push), incluyendo la estructura completa[cite: 238]. [cite_start](Nota: Generalmente el archivo `.env` no se sube por seguridad, pero fue incluido en el proceso con fines demostrativos [cite: 238]).

---

## III. DESPLIEGUE FINAL EN RENDER

1.  **Creación del Servicio Web:**
    * [cite_start]En la plataforma Render, crea un **Nuevo Servicio Web**[cite: 273].
    * Conecta este servicio a tu repositorio de GitHub **`student-tasks-app`**.

2.  **Configuración de Variables de Entorno:**
    * [cite_start]Dentro de la configuración del Servicio Web en Render, añade las **Environment Variables**[cite: 274].
    * [cite_start]Configura la clave **`DATABASE_URL`** con la URL de conexión interna o externa de tu base de datos de Render[cite: 276].
    * [cite_start]Añade otras variables de entorno necesarias (ej. `SECRET_KEY` si se usa para JWT)[cite: 277].

3.  **Despliegue y Pruebas:**
    * Despliega el servicio. [cite_start]Render clonará el repositorio, ejecutará el comando `npm install` automáticamente, y lanzará el servidor[cite: 320, 321, 326].
    * [cite_start]Verifica los Logs para confirmar que el despliegue fue exitoso ("Your service is live")[cite: 294, 326].
    * [cite_start]Accede al enlace público de Render (ej. `student-tasks-app.onrender.com`) para realizar las pruebas de funcionalidad (Registro, Login, Creación de Tareas, etc.)[cite: 332, 335].
