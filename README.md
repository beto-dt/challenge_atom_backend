# Backend Challenge Atom

Este proyecto implementa un backend utilizando TypeScript, Express y Firebase Cloud Functions siguiendo los principios de Arquitectura Limpia.

## 🛠️ Tecnologías

- **TypeScript**: Para tipado estático y características modernas de JavaScript
- **Express.js**: Gestionar rutas y middleware
- **Firebase Cloud Functions**: Para desplegar funciones serverless
- **Firestore**: Base de datos NoSQL para almacenamiento
- **ESLint/Prettier**: Linting y formateo de código

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Cuenta de Firebase
- Firebase CLI (`npm install -g firebase-tools`)

## 🚀 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/beto-dt/challenge_atom_backend
   ```

2. Instala las dependencias:
   ```bash
   cd functions
   npm install
   ```

3. Inicializa Firebase (si aún no lo has hecho):
   ```bash
   firebase login
   firebase init
   ```

## ⚙️ Configuración

1. Crea un archivo `.env` en la carpeta raiz
   
  En el Correo va estar adjunto el .env para que funcione el proyecto 


## 💻 Desarrollo Local

1. Inicia el servidor de desarrollo:
   ```bash
   cd functions
   firebase emulators:start
   ```

2. El servidor estará disponible en `http://127.0.0.1:5001/challengeatombackend/us-central1/api/api/`

## 🌐 Despliegue

Despliega a Firebase Cloud Functions:
```bash
cd functions
npm run build && firebase deploy --only functions
```

## 📡 API Endpoints

### Usuarios
- `GET /api//users/:email` - Encontrar Usuario por correo
- `POST /api/users` - Crear Usuario por email


### Tareas
- `POST /api/tasks` - Crear Tarea
- `GET /api/tasks/:TaskId?userId=:UserId` - Obtener una tarea específica del usuario
- `GET /tasks?userId=:UserId` - Obtener todas las tareas del usuario
- `PUT /api/tasks/:TaskId` - Actualizar Tarea
- `DELETE /api/tasks/:TaskId?userId=:UserId` - Eliminar Tarea

## 📄 Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).

---

Desarrollado con ❤️ por [LuisAlberto De La Torre](https://github.com/beto-dt)
