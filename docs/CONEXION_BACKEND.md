# Conectar la app mobile al backend

## Requisitos

- Backend NestJS corriendo (por ejemplo `pnpm run start:dev` en `beneficia2/backend`).
- Backend escuchando en el puerto **3000** (por defecto).

## Desarrollo local

### Android (emulador)

No hace falta configuración: la app usa por defecto `http://10.0.2.2:3000` (el host desde el emulador).

1. Arranca el backend en tu Mac/PC.
2. Arranca la app: `npx expo start` y abre en el emulador Android.
3. Si usas datos reales (no mock), crea en mobile un `.env` con un usuario de prueba (ver más abajo).

### iOS (simulador o dispositivo físico)

El simulador y los dispositivos no pueden usar `localhost` ni `10.0.2.2`. Necesitas la **IP de tu Mac** en la red local.

1. Obtén tu IP (en Mac: Preferencias del Sistema → Red, o `ifconfig | grep "inet "`).
2. En la carpeta **mobile**, crea `.env` a partir de `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Edita `.env` y descomenta/ajusta:
   ```env
   EXPO_PUBLIC_DEV_API_HOST=192.168.1.10
   EXPO_PUBLIC_DEV_API_PORT=3000
   ```
   (Sustituye `192.168.1.10` por tu IP.)
4. Reinicia Expo (`npx expo start`) para que cargue las variables.

### CORS

El backend, si no tiene `CORS_ORIGIN` en su `.env`, permite todos los orígenes. Así la app Expo puede llamar al backend en desarrollo sin tocar CORS.

## Usuario de prueba (sin login)

Para usar beneficios, aplicaciones y perfil contra el backend necesitas un `userId` válido (por ejemplo el que devuelve el backend para un perfil existente).

1. Crea o obtén un usuario/perfil en el backend (por ejemplo vía seed o API).
2. En mobile `.env`:
   ```env
   EXPO_PUBLIC_DEV_USER_ID=<uuid-del-perfil>
   ```
3. Reinicia Expo.

Si no defines `EXPO_PUBLIC_DEV_USER_ID`, la app usa el id `anonymous-dev`; el backend debe reconocerlo o devolverá 404 en rutas que requieran usuario.

## Lista de beneficios

Por defecto la app usa el API `GET /benefits/:userId/match`. Si la petición falla (red, 401, etc.) se muestra el mensaje "No pudimos cargar los beneficios. Tira para reintentar." y se puede reintentar con pull-to-refresh o el botón Reintentar.

## Resumen rápido

| Entorno              | Acción |
|----------------------|--------|
| Android emulador     | Nada; backend en :3000. |
| iOS simulador / dispositivo | `.env` con `EXPO_PUBLIC_DEV_API_HOST=<tu-ip>` y opcionalmente `EXPO_PUBLIC_DEV_USER_ID`. |
| Producción           | `EXPO_PUBLIC_API_URL=https://tu-api.com` (HTTPS). |
