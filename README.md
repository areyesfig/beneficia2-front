# Beneficia2 — App Móvil

Aplicación móvil (Expo / React Native) para descubrir beneficios del Estado chileno según tu perfil (RSH, edad, ingresos, etc.).

## Stack

- **Expo** (SDK 54) + **React Native**
- **expo-router** (navegación por archivos en `app/`)
- **NativeWind** (Tailwind para RN)
- **React Hook Form** + **Zod** + **@hookform/resolvers**
- **TanStack Query** para datos del API
- **Jest** para tests unitarios

## Requisitos

- Node.js 18+
- npm o pnpm
- [Expo Go](https://expo.dev/go) en el celular (o emulador iOS/Android)

## Instalación

```bash
npm install
```

## Variables de entorno

Copia la plantilla y ajusta en local (no subas `.env` al repo):

```bash
cp .env.example .env
```

| Variable | Descripción |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | URL del backend (obligatoria en producción). |
| `EXPO_PUBLIC_DEV_API_HOST` | Host del backend en red local (opcional; en Android emulador se usa 10.0.2.2 por defecto). |
| `EXPO_PUBLIC_DEV_API_PORT` | Puerto del backend en dev (opcional, por defecto 3000). |
| `EXPO_PUBLIC_DEV_USER_ID` | User ID para probar sin login (opcional). |

En producción configura `EXPO_PUBLIC_API_URL` en tu pipeline o EAS Secrets.

**Conectar con el backend local (Android emulador, iOS simulador, dispositivo):** ver [docs/CONEXION_BACKEND.md](docs/CONEXION_BACKEND.md).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el bundler de Expo. |
| `npm run android` | Abre en Android. |
| `npm run ios` | Abre en iOS. |
| `npm test` | Ejecuta Jest. |
| `npm run test:coverage` | Tests con cobertura. |

## Estructura del proyecto

```
app/                    # Rutas (expo-router)
  index.tsx             # Redirige a /wizard
  wizard.tsx            # Wizard de onboarding (perfil + RSH)
  home.tsx              # Pantalla principal
  benefits.tsx          # Lista de beneficios con filtros por categoría
  benefit/[id].tsx      # Detalle de beneficio
  profile/rsh.tsx      # Redirige a /wizard
src/
  config/               # API URL, user id (env)
  constants/            # Categorías de beneficios (mapeo backend → UI)
  features/
    benefits/           # API useUserMatches, BenefitCard, BenefitsFeed
    profile/            # RSHWizard (legacy, ya unificado en WizardScreen)
  screens/              # WizardScreen (wizard unificado)
  api/                  # Cliente axios
  components/           # ErrorBoundary, UI
  utils/                # format-currency, rut-validator
```

## Flujo principal

1. **Entrada** → Redirección a `/wizard`.
2. **Wizard** (6 pasos): nombre, edad, RUT, tramo RSH, cargas familiares, ingresos. Al finalizar se envía el perfil al backend y se navega a `/home`.
3. **Home** → Acceso a “Ver beneficios” y “Registro Social de Hogares” (lleva al wizard).
4. **Beneficios** → Lista con chips por categoría (Todo, Bonos, Vivienda, Salud, etc.) y detalle por beneficio con estado (elegible / falta info).

## Backend

La app espera un backend con al menos:

- `POST /auth/guest`, `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me`
- `GET /profile/:userId`, `PATCH /profile/:userId`
- `GET /benefits/:userId/match`

Repositorio del backend: [Beneficia2](https://github.com/areyesfig/Beneficia2).

## Checklist de pruebas manuales

Ejecutar con el backend local levantado y la app en Expo Go o emulador.

### Auth y onboarding

- [ ] **Arranque**: La app muestra carga breve y luego entra al wizard (o a home si ya hay perfil completo).
- [ ] **Wizard sin perfil**: Completar los 6 pasos (nombre, edad, RUT, RSH, cargas, ingresos). Al finalizar se guarda el perfil y redirige a `/home`.
- [ ] **Wizard con perfil**: Si ya existe perfil en el backend, al abrir el wizard los campos aparecen prellenados.
- [ ] **Guard de perfil**: Sin perfil completo, al intentar ir a “Ver beneficios” o Home por URL, la app redirige a `/wizard`.
- [ ] **Acceso a wizard con perfil completo**: Desde Home, poder entrar al wizard por “Registro Social de Hogares” o equivalente (el wizard sigue accesible aunque el usuario sea registered).

### Registro (guest → cuenta)

- [ ] **Crear cuenta desde wizard**: En el último paso del wizard, tocar “Crear cuenta para guardar y recibir alertas”. Lleva a `/register`.
- [ ] **Crear cuenta desde home**: En Home, tocar “Crear cuenta para guardar y recibir alertas”. Lleva a `/register`.
- [ ] **Formulario register**: Solo email y contraseña (mín. 8 caracteres). Enviar: se convierte el mismo usuario guest a registered, se guardan nuevos tokens y se redirige a `/home` (mismo userId; beneficios y perfil se mantienen).
- [ ] **Email duplicado**: Intentar registrar con un email ya usado; debe mostrar error y no crear usuario nuevo.
- [ ] **Seguir sin cuenta**: En `/register`, “Seguir sin cuenta” lleva a `/home`.

### Sesión y beneficios

- [ ] **Beneficios**: En Home, “Ver beneficios” muestra la lista según el perfil (guest o registered).
- [ ] **Cerrar y reabrir app**: Tras registrar, al reabrir la app se mantiene la sesión (no pide login de nuevo).
- [ ] **Refresh token**: Dejar la app en segundo plano más de 15 min (o simular token expirado) y usar de nuevo; si el refresh funciona, las peticiones siguen sin pedir login.

### Opcional

- [ ] **Login** (si existe pantalla): Iniciar sesión con email/contraseña de un usuario ya registrado; debe devolver tokens y redirigir correctamente.

## Licencia

Privado / sin licencia pública.
