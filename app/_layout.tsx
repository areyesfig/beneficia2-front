import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
              headerStyle: { backgroundColor: "#f0fdfa" },
              headerTintColor: "#0f766e",
              headerTitleStyle: { fontWeight: "700", fontSize: 18 },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: "#f0fdfa" },
            }}
            >
              <Stack.Screen name="index" options={{ title: "Inicio", headerShown: false }} />
              <Stack.Screen
                name="wizard"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="home" options={{ title: "Inicio" }} />
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
