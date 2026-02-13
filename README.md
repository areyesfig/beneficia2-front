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
  index.tsx             # Landing: hero + CTA "Ver mis beneficios" → /wizard
  wizard.tsx            # Wizard de onboarding (perfil + RSH)
  home.tsx              # Pantalla principal
  benefits.tsx          # Lista de beneficios con filtros por categoría
  benefit/[id].tsx      # Detalle de beneficio
src/
  config/               # API URL, user id (env)
  constants/            # Categorías de beneficios (mapeo backend → UI)
  features/
    benefits/           # API useUserMatches, BenefitCard, BenefitsFeed
    profile/            # profileApi, wizardStorage
  screens/              # WizardScreen, HomeScreen, BenefitsScreen, BenefitDetailScreen
  api/                  # Cliente axios + interceptors auth
  components/           # ErrorBoundary, AnimatedPressable
  utils/                # format-currency, rut-validator, safe-open-url
```

## Flujo principal

1. **Landing (index)** — El usuario ve el valor de la app y toca "Ver mis beneficios" → `/wizard`.
2. **Wizard** (6 pasos): nombre, edad, RUT, tramo RSH, cargas familiares, ingresos. Al finalizar se envía el perfil al backend y se navega a `/home`.
3. **Home** — Acceso a "Ver beneficios" y "Actualizar datos" (vuelve al wizard).
4. **Beneficios** — Lista desde el API con chips por categoría (Todo, Vivienda, Salud, Estudios, Pensiones, Empleo, etc.) y detalle por beneficio con estado (elegible / falta info). Pull-to-refresh para actualizar.

## Backend

La app espera un backend con al menos:

- `POST /auth/guest`, `POST /auth/refresh`
- `GET /profile/:userId`, `PATCH /profile/:userId`
- `GET /benefits/:userId/match`

Repositorio del backend: [Beneficia2](https://github.com/areyesfig/Beneficia2).

## Checklist de pruebas manuales (MVP)

Ejecutar con el backend local levantado y la app en Expo Go o emulador. Ver también [docs/MVP_CHECKLIST.md](docs/MVP_CHECKLIST.md).

### Onboarding y perfil

- [ ] **Arranque**: La app muestra la landing; al tocar "Ver mis beneficios" se abre el wizard.
- [ ] **Wizard sin perfil**: Completar los 6 pasos (nombre, edad, RUT, RSH, cargas, ingresos). Al finalizar se guarda el perfil y redirige a `/home`.
- [ ] **Wizard con perfil**: Si ya existe perfil en el backend, al abrir el wizard los campos aparecen prellenados.
- [ ] **Guard de perfil**: Sin perfil completo, al intentar ir a "Ver beneficios" o Home, la app redirige a `/wizard`.
- [ ] **Actualizar datos**: Desde Home, "Actualizar datos" limpia y vuelve al wizard.

### Sesión y beneficios

- [ ] **Beneficios**: En Home, "Ver beneficios" muestra la lista desde el API según el perfil (guest).
- [ ] **Pull-to-refresh**: En la lista de beneficios, tirar para actualizar y ver nuevos beneficios si el backend los tiene.
- [ ] **Detalle y postular**: Entrar a un beneficio, tocar "Postular" y que se abra el enlace oficial; el estado se envía al backend.
- [ ] **Cerrar y reabrir app**: Al reabrir, la sesión guest se mantiene (tokens en SecureStore).

## Licencia

Privado / sin licencia pública.
