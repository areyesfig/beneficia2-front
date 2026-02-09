import { Redirect } from "expo-router";

/**
 * Punto de entrada: redirige al Wizard como primera pantalla.
 * Tras completar el wizard, el usuario va a /home.
 */
export default function IndexScreen() {
  return <Redirect href="/wizard" />;
}
