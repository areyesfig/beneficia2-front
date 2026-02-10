# Análisis de la estructura del proyecto

## Visión general

El proyecto sigue una estructura **híbrida** típica de Expo + React Native:

- **`app/`** — Rutas (Expo Router, file-based). Páginas y rutas dinámicas.
- **`src/`** — Lógica, componentes, features, config y utilidades.

En conjunto la estructura **es correcta** y alineada con buenas prácticas. Abajo se detallan puntos fuertes y mejoras opcionales.

---

## Lo que está bien

### 1. Separación app vs src

- **`app/`**: solo rutas y pantallas mínimas (o redirects). Bien para Expo Router.
- **`src/`**: todo el código de negocio, sin mezclar rutas con lógica.

### 2. Features por dominio

- **`src/features/benefits/`**: API (useUserMatches), componentes (BenefitCard, BenefitsFeed). Todo lo de “beneficios” junto.
- **`src/features/profile/`**: componentes de perfil (RSHWizard). Escalable si añades más pantallas de perfil.

### 3. Capas claras

- **`src/api/`**: cliente HTTP y hooks globales (useUser).
- **`src/config/`**: api.ts, env.ts.
- **`src/components/`**: ErrorBoundary + `ui/` (Button, Card, Input).
- **`src/constants/`**, **`src/utils/`**: bien separados.

### 4. Rutas

- `app/benefit/[id].tsx` para detalle dinámico.
- `app/profile/rsh.tsx` → redirect a `/wizard` (flujo unificado). Coherente.

### 5. Aliases

- `@/*` → `src/*` en `tsconfig.json` permite imports limpios (`@/components/...`, `@/features/...`).

---

## Mejoras recomendadas (opcionales)

### 1. ~~Archivo fuera de lugar~~ (aplicado)

- **`mobile.code-workspace`** se movió a la raíz de `mobile/`.

### 2. ~~Código no usado en “beneficios”~~ (aplicado)

- Se eliminó **`useBenefits`**; la app usa solo **`useUserMatches`** para el listado de beneficios por usuario.

### 3. ~~Consistencia rutas ↔ pantallas~~ (aplicado)

- Todas las pantallas viven en **`src/screens/`** (HomeScreen, BenefitsScreen, WizardScreen, BenefitDetailScreen).
- **`app/`** solo re-exporta: `home.tsx`, `benefits.tsx`, `wizard.tsx` y `benefit/[id].tsx` importan desde `@/screens/`.

### 4. Dónde vive el “wizard” de perfil

- **`WizardScreen`** está en **`src/screens/`** pero conceptualmente es el onboarding/perfil (nombre, edad, RUT, RSH, cargas, ingresos).
- **Recomendación (opcional):** Si quieres que “perfil” agrupe todo, podrías moverlo a algo como `src/features/profile/screens/WizardScreen.tsx` y actualizar el import en `app/wizard.tsx`. No es obligatorio; `screens/` como carpeta de pantallas “globales” también es válido.

### 5. ~~RSHWizard sin uso~~ (aplicado)

- **RSHWizard** está documentado como `@legacy` en el JSDoc del componente; el flujo actual es `WizardScreen`. Se mantiene por si se necesita una pantalla “solo actualizar RUT/RSH”.

---

## Resumen

| Aspecto              | Estado   | Nota                                      |
|----------------------|----------|-------------------------------------------|
| app/ solo rutas      | Correcto | Expo Router bien usado                    |
| src/ por capas       | Correcto | api, config, components, features, utils  |
| Features por dominio | Correcto | benefits y profile separados              |
| Aliases @/           | Correcto | tsconfig paths                            |
| Archivo en feature   | Aplicado | mobile.code-workspace movido a raíz       |
| useBenefits vs useUserMatches | Aplicado | useBenefits eliminado; solo useUserMatches |
| RSHWizard            | Aplicado | Documentado como @legacy en JSDoc          |

En resumen: **la estructura del proyecto es correcta**. Las mejoras son opcionales y sirven para reducir código muerto, evitar archivos fuera de lugar y, si quieres, unificar un poco más la convención rutas/pantallas.
