# Frontend (React + Vite)

Aplicación web ligera para administrar productos y categorías consumiendo los microservicios publicados detrás del API Gateway.

## Requisitos

- Node.js 18+ (se recomienda 20 LTS).
- Microservicios levantados y accesibles vía el API Gateway.

## Configuración

1. Copia el archivo de ejemplo y ajusta la URL del gateway si fuera necesario:
   ```bash
   cp .env.example .env
   # VITE_API_BASE_URL=http://localhost:8080
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Scripts disponibles

| Comando        | Descripción                                      |
|----------------|--------------------------------------------------|
| `npm run dev`  | Levanta el entorno de desarrollo en `5173`.      |
| `npm run build`| Genera la versión de producción en `dist/`.      |
| `npm run preview` | Sirve el build para verificación rápida.     |

## Funcionalidades

- **Listados**: muestra las categorías y productos retornados por los endpoints `/api/categorias` y `/api/productos`.
- **Formularios de registro**: permite crear nuevas categorías y productos con validaciones básicas (campos obligatorios, precio numérico y categoría existente).
- **Actualización manual**: botones para refrescar cada listado y botón general “Recargar todo”.

Toda la comunicación se realiza contra `VITE_API_BASE_URL`, por lo que basta con exponer los microservicios detrás del gateway para que el frontend refleje los cambios.
