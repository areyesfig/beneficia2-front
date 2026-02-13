# Checklist MVP — Beneficia2

Análisis de lo que está listo y lo que conviene revisar antes de sacar el MVP.

---

## ✅ Lo que está listo (app móvil)

### Flujo principal
- **Landing (index)** — Hero, valor del producto, CTA "Ver mis beneficios" → `/wizard`.
- **Wizard (6 pasos)** — Nombre, edad, RUT (validado), tramo RSH, cargas familiares, ingresos. Guarda en backend (`PATCH /profile/:userId`) y navega a `/home`.
- **Guard de perfil** — Si el usuario no tiene perfil completo, al ir a `/home` o `/benefits` se redirige a `/wizard`.
- **Home** — Acceso a "Ver beneficios" y "Actualizar datos" (borra wizard y vuelve a `/wizard`).
- **Lista de beneficios** — Datos de `GET /benefits/:userId/match`, filtros por categoría (Todo, Vivienda, Salud, Estudios, Pensiones, Empleo, Niñez, Adulto Mayor), vista grid/lista, pull-to-refresh y refetch al montar.
- **Detalle de beneficio** — Por id desde la lista; botones "Postular" (abre `urlApply`) y "Ocultar"; estado elegible / falta info.
- **Auth** — Flujo guest: `POST /auth/guest` con deviceId, tokens en SecureStore, interceptors con Bearer y refresh en 401.

### Infra y calidad
- **API** — `apiClient` (axios) con baseURL desde `EXPO_PUBLIC_API_URL` o dev host; HTTPS obligatorio en producción.
- **Env** — `.env.example` con variables documentadas; en dev usa `EXPO_PUBLIC_DEV_API_HOST` (por defecto IP fija para iOS; en Android 10.0.2.2).
- **ErrorBoundary** — Pantalla "Algo salió mal" con botón Reintentar.
- **Categorías** — Alineadas con backend (BONOS_Y_PENSIONES, CAPACITACION_Y_EMPLEO, etc.) e iconos en cards.
- **Tests** — Jest para RUT y format-currency.
- **README** — Instalación, env, scripts, estructura y flujo.

---

## ⚠️ Revisar o ajustar antes del MVP

### 1. Backend encendido y accesible
- En dispositivo físico: en `.env` debe estar **tu IP local** en `EXPO_PUBLIC_DEV_API_HOST` (el valor por defecto `192.168.68.107` puede no ser tu red).
- Ver [docs/CONEXION_BACKEND.md](CONEXION_BACKEND.md).

### 2. Usuario y perfil en backend
- La app usa **guest** y espera que el backend tenga `POST /auth/guest`, `GET /profile/:userId`, `PATCH /profile/:userId`, `GET /benefits/:userId/match`.
- Para probar sin login: `EXPO_PUBLIC_DEV_USER_ID` en `.env` (debe existir ese usuario/perfil en el backend).

### 3. ~~Lista de beneficios cuando falla el API~~ ✅ Hecho
- Si `GET /benefits/:userId/match` falla, la app muestra "No pudimos cargar los beneficios. Tira para reintentar." y botón Reintentar; ya no se usan mocks en ese caso.

### 4. Endpoint de postulación
- Al tocar "Postular" se llama `POST /applications/${userId}/status` con `{ benefitId, status }`. Verificar que el backend exponga esa ruta y persista el estado.

### 5. App.tsx
- El entry real es **expo-router** (`main: "expo-router/entry"`). `App.tsx` en la raíz es la plantilla por defecto de Expo y no se usa en el flujo actual. Opcional: borrarlo o dejarlo por si se usa en otro contexto.

### 6. ~~Dependencias no usadas~~ ✅ Hecho
- **react-native-confetti-cannon** — Ya quitada de `package.json`.

---

## 📋 Backend (recordatorio para MVP)

Comprobar que el backend tenga:

- **Auth:** `POST /auth/guest`, `POST /auth/refresh`.
- **Perfil:** `GET /profile/:userId`, `PATCH /profile/:userId` (crear/actualizar perfil del usuario).
- **Beneficios:** `GET /benefits/:userId/match` — todos los beneficios activos con status de match para ese usuario.
- **Aplicaciones:** `POST /applications/:userId/status` (o equivalente) para guardar "Postulé" / "Ocultar".
- **Scraper:** Ventanilla Única por sitemap; beneficios con `isActive: true` y `requirements` para el matching.
- **CORS** y **origen** configurados para la URL de la app en producción.

---

## Resumen

| Área           | Estado   | Acción sugerida                          |
|----------------|----------|------------------------------------------|
| Flujo usuario  | Listo    | Probar en dispositivo con backend local |
| Beneficios API | Listo    | Confirmar que el scraper pobló la BD     |
| Errores de red | ✅ Hecho | Error en lista + Reintentar cuando falla el API |
| Env / IP       | Revisar  | Ajustar `EXPO_PUBLIC_DEV_API_HOST`             |
| Limpieza       | ✅ Hecho | confetti-cannon quitada; README actualizado   |

Con esto el MVP está en condiciones de salir; los puntos opcionales mejoran claridad y mantenimiento.
