import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { theme } from "@/theme/theme";
import { useAuthStore } from "@/features/auth/authStore";
import { getProfile, isProfileComplete } from "@/features/profile/api/profileApi";

/** Rutas que no exigen perfil completo (siempre accesibles). */
function isGuardedRoute(pathname: string): boolean {
  const raw = (pathname ?? "").trim();
  const withSlash = raw && raw.startsWith("/") ? raw : raw ? `/${raw}` : "/";
  const normalized = withSlash.replace(/\/$/, "") || "/";
  const allowed =
    normalized === "/" ||
    normalized === "/index" ||
    normalized.startsWith("/wizard");
  return !allowed;
}

/** Cache agresivo: evita refetch en cada navegación; los datos se consideran frescos 5 min y se mantienen 30 min en memoria. */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min: no refetch automático mientras sea "fresco"
      gcTime: 30 * 60 * 1000, // 30 min: mantener en caché aunque no haya suscriptores
      refetchOnMount: false, // no refetch al montar una pantalla que use la query
      refetchOnWindowFocus: false, // no refetch al volver a la app (evita lentitud al tocar un beneficio)
    },
  },
});

export default function RootLayout() {
  const [authReady, setAuthReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId);

  useEffect(() => {
    useAuthStore.getState().bootstrapAuth().finally(() => setAuthReady(true));
  }, []);

  useEffect(() => {
    if (!authReady || !userId || !isGuardedRoute(pathname ?? "")) return;
    let cancelled = false;
    getProfile(userId).then((profile) => {
      if (cancelled) return;
      if (!isProfileComplete(profile)) {
        router.replace("/wizard");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [authReady, userId, pathname, router]);

  if (!authReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
            <Stack
            screenOptions={{
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.primary,
              headerTitleStyle: { fontWeight: "700", fontSize: 18, color: theme.colors.text },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: theme.colors.background },
            }}
            >
              <Stack.Screen name="index" options={{ title: "Inicio", headerShown: false }} />
              <Stack.Screen
                name="wizard"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="home"
                options={{
                  title: "Inicio",
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="benefits"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </SafeAreaView>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
