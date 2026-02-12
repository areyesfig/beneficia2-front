import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { theme } from "@/theme/theme";

const queryClient = new QueryClient();

export default function RootLayout() {
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
              <Stack.Screen name="profile/rsh" options={{ title: "Registro Social de Hogares" }} />
            </Stack>
          </SafeAreaView>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
