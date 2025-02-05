# BFF - Node.js (Autenticación y Proxy para FastAPI)

## 📌 Descripción

Este proyecto es un **Backend for Frontend (BFF)** desarrollado en **Node.js** con **Express**, encargado de la autenticación de usuarios y de actuar como puente entre el frontend y un backend en **FastAPI**.

## 🛠 Tecnologías utilizadas

- **Node.js** - Servidor backend
- **Express.js** - Framework para el API
- **MongoDB** - Base de datos para autenticación
- **Mongoose** - ODM para MongoDB
- **JWT (Json Web Token)** - Manejo de autenticación
- **Bcrypt.js** - Hashing de contraseñas
- **Axios** - Comunicación con FastAPI
- **Cors** - Habilitación de CORS
- **Dotenv** - Manejo de variables de entorno
- **Nodemon** - Recarga automática en desarrollo

## 📂 Estructura del Proyecto

```
📂 bff-node/
│── 📂 src/
│   │── 📂 config/          # Configuración (MongoDB, .env)
│   │── 📂 controllers/     # Controladores de autenticación
│   │── 📂 middleware/      # Middleware de seguridad
│   │── 📂 models/          # Modelos de MongoDB
│   │── 📂 routes/          # Rutas del API
│   │── 📂 services/        # Servicios auxiliares (hashing, JWT, conexión FastAPI)
│   │── index.js            # Punto de entrada
│── .env                    # Variables de entorno
│── package.json            # Dependencias
```

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el repositorio

```sh
git clone https://github.com/tu-repo/bff-node.git
cd bff-node
```

### 2️⃣ Instalar dependencias

```sh
npm install
```

### 3️⃣ Configurar variables de entorno

Crear un archivo `.env` en la raíz con:

```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/authdb
JWT_SECRET=supersecreto
FASTAPI_URL=http://localhost:8000
```

### 4️⃣ Ejecutar el servidor en desarrollo

```sh
npm run dev
```

El servidor se ejecutará en `http://localhost:5000`

## 🔑 Endpoints de Autenticación

### 📌 **Registro de usuario**

```http
POST /auth/register
```

#### 📌 **Body:**

```json
{
  "usuario": "jdoe",
  "nombre": "John",
  "apellido": "Doe",
  "correo": "jdoe@example.com",
  "telefono": "1234567890",
  "password": "password123"
}
```

### 📌 **Login de usuario**

```http
POST /auth/login
```

#### 📌 **Body:**

```json
{
  "usuario": "jdoe",
  "password": "password123"
}
```

#### 📌 **Respuesta:**

```json
{
  "token": "eyJhbGciOiJIUzI1..."
}
```
