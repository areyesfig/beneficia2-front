# Flujo: Wizard sin autenticación visible

## Objetivo

- **Una sola entrada**: el usuario ve beneficios y puede postular sin crear cuenta ni iniciar sesión.
- **Wizard como único paso previo**: se recogen datos (nombre, edad, RUT, **tramo RSH**, cargas, ingresos) para calcular elegibilidad.
- **RSH** se usa en el backend para verificar cada beneficio y mostrar solo los que aplican.
- **Postular** = abrir la página oficial del beneficio (`urlApply`) para que el usuario complete el trámite allí.

## Flujo actual

1. **Inicio** (`/`) → Un botón "Ver mis beneficios" lleva a `/wizard`.
2. **Wizard** (`/wizard`) → 6 pasos (nombre, edad, RUT, RSH, cargas, ingresos). Al finalizar se guarda el perfil en el backend (con usuario invitado interno) y se navega a `/home`.
3. **Home / Beneficios** → Lista de beneficios según el perfil (RSH, ingresos, etc.). El usuario puede abrir el detalle y, si es elegible, **Postular** abre la URL externa de postulación.
4. Si falta información para un beneficio, se ofrece ir a `/wizard` para completar o actualizar datos.

## Detalles técnicos

- **Auth**: Por detrás se usa un usuario invitado (guest) para tener un `userId` y poder llamar a `GET /benefits/:userId/match` y `PATCH /profile/:userId`. El usuario no ve pantallas de registro ni login.
- **Match**: El backend usa el perfil guardado (RSH, ingresos, edad, etc.) para calcular elegibilidad y devolver la lista de beneficios con estado (ELIGIBLE / MISSING_DATA).
- **Postulación**: En detalle de beneficio, el botón "Postular" abre `benefit.urlApply` en el navegador; la postulación real ocurre en la página del organismo.

## Rutas sin perfil

- `/`, `/index`, `/wizard`, `/register` no exigen perfil completo.
- `/home`, `/benefits`, `/benefit/:id` exigen perfil completo; si no lo hay, el guard redirige a `/wizard`.
