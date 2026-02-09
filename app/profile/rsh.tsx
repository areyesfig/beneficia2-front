import { Redirect } from "expo-router";

/**
 * Registro Social de Hogares unificado con el wizard de onboarding.
 * Redirige al wizard para que el usuario complete o actualice su perfil (nombre, edad, RUT, RSH, cargas, ingresos).
 */
export default function RSHScreen() {
  return <Redirect href="/wizard" />;
}
