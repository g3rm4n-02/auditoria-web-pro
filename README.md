# Proyecto Full Stack - Enhanced (listo para desplegar)
Incluye frontend estático, backend Express con autenticación (SQLite + JWT), Docker, docker-compose y GitHub Actions.

## Cómo levantar localmente (recomendado con Docker)
1. Copia `.env.example` a `.env` en la carpeta `backend` y rellena valores (SMTP y JWT_SECRET).
2. Desde la raíz del proyecto ejecuta:
   ```bash
   docker-compose up --build
   ```
3. Accede a:
   - Frontend: http://localhost:8080
   - Backend/API: http://localhost:3000

## Sin Docker (local)
Backend:
```bash
cd backend
npm install
# copiar .env.example -> .env y editar
npm start
```
Frontend: abrir `frontend/index.html` o servir con Live Server.

## Endpoints clave
- POST /api/register  { name, email, password }  -> registra y devuelve token
- POST /api/login     { email, password }         -> token
- GET /api/me         (Authorization: Bearer <token>)
- POST /api/contact   { name, email, message }    -> envía email
