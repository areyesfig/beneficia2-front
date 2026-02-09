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
| `EXPO_PUBLIC_DEV_API_HOST` | Host del backend en red local (opcional, solo desarrollo). |
| `EXPO_PUBLIC_DEV_USER_ID` | User ID para probar sin login (opcional). |

En producción configura `EXPO_PUBLIC_API_URL` en tu pipeline o EAS Secrets.

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

- `PATCH /profile/:userId` — actualizar perfil (nombre, birthDate, rshPercentage, income).
- `GET /benefits/:userId/match` — lista de beneficios con estado de match para ese usuario.

Repositorio del backend: [Beneficia2](https://github.com/areyesfig/Beneficia2).

## Licencia

Privado / sin licencia pública.
