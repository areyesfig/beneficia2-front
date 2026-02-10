# Mejoras sugeridas para el proyecto

## 1. Arquitectura y entrada de la app

- **Expo Router**: Mencionaste Expo Router pero el proyecto usa `App.tsx` como entrada. Migrar a la carpeta `app/` con rutas (`_layout.tsx`, `index.tsx`, `(tabs)/`, etc.) para navegación por archivos.
- **Punto de entrada**: Si mantienes `App.tsx`, que use al menos un layout con SafeArea y una ruta/pantalla que integre `RSHWizard` o `BenefitsFeed` para probar los flujos.

## 2. Configuración de NativeWind y aliases

- **Tailwind/NativeWind**: No hay `tailwind.config.js` ni `global.css` referenciado. Sin esto, las clases `className` de los componentes pueden no aplicarse. Configurar NativeWind v4 según la [doc oficial](https://www.nativewind.dev/).
- **Alias `@/`**: En `tsconfig.json` añadir `"paths": { "@/*": ["src/*"] }` para imports como `import { validateRut } from '@/utils/rut-validator'` y evitar rutas relativas largas.

## 3. Completar lo planteado en la estructura inicial

- **`src/api/`**: Cliente Axios (base URL, interceptors) y hooks de TanStack Query (`useUser`). Beneficios por usuario: `useUserMatches` en `src/features/benefits/api/`.
- **`src/components/ui/`**: Átomos reutilizables (Button, Input, Card) con NativeWind para unificar estilo y usarlos en RSHWizard y BenefitCard.
- **`src/utils/format-currency.ts`**: Formatear pesos chilenos (CLP); usarlo en `BenefitCard` en lugar de `toLocaleString` directo.

## 4. Calidad de código y pruebas

- **ESLint + Prettier**: Reglas para React/TypeScript y formato consistente.
- **Tests**: Jest + React Native Testing Library; al menos tests unitarios para `rut-validator.ts` y uno de integración para un paso del RSHWizard o BenefitCard.

## 5. Experiencia de desarrollo y consistencia

- **Variables de entorno**: `expo-constants` o `react-native-dotenv` para `API_URL` y config por entorno.
- **Manejo de errores**: Componente o boundary global de error (Error Boundary) y mensajes amigables.
- **Accesibilidad**: Revisar `accessibilityLabel`, `accessibilityHint` en botones e inputs (RUT, Stepper, Postular).
- **Tipos exportados**: Barrel files (`index.ts`) en `features/benefits`, `features/profile` y `components/ui` para imports más limpios.

## Prioridad sugerida (implementado)

| Prioridad | Mejora | Estado |
|-----------|--------|--------|
| Alta | Configurar NativeWind + alias `@/` | ✅ `tailwind.config.js`, `global.css`, `metro.config.js`, `babel.config.js`, `tsconfig.json` paths |
| Alta | Expo Router con `app/` y pantalla RSH/Benefits | ✅ `app/_layout.tsx`, `app/index.tsx`, `app/benefits.tsx`, `app/profile/rsh.tsx`, entry `expo-router/entry` |
| Media | `format-currency.ts` + BenefitCard | ✅ `src/utils/format-currency.ts`, BenefitCard usa `formatCurrency` |
| Media | Componentes UI (Button, Input, Card) | ✅ `src/components/ui/` + barrel `index.ts` |
| Media | API + useUser / useUserMatches | ✅ `src/api/client.ts`, `src/api/hooks/useUser.ts`, QueryClient en layout, benefits usa `useUserMatches` con fallback mock |
| Baja | ESLint, tests, Error Boundary | ✅ `eslint.config.mjs`, `src/utils/rut-validator.test.ts`, `src/components/ErrorBoundary.tsx` en layout |
