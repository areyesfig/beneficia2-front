import { Link } from "expo-router";
import { View, Text } from "react-native";
import { Wallet, FileCheck } from "lucide-react-native";
import { cardStyle, chipStyle } from "@/styles/screenStyles";
import { theme } from "@/theme/theme";
import { VStack, HStack } from "@/theme/layout";
import { AnimatedPressableScale } from "@/components/AnimatedPressable";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <VStack spacing={theme.spacing.sm} style={{ paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.xl }}>
        <Text style={[theme.typography.h1, { color: theme.colors.text }]}>
          Hola 👋
        </Text>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary, maxWidth: 300 }]}>
          Revisa tus beneficios y completa tu perfil para postular.
        </Text>
      </VStack>

      <VStack spacing={theme.spacing.md} style={{ flex: 1, paddingHorizontal: theme.spacing.md }}>
        <Link href="/benefits" asChild>
          <AnimatedPressableScale
            style={[
              { overflow: "hidden", backgroundColor: theme.colors.surface, padding: theme.spacing.md },
              cardStyle.wrapper,
              cardStyle.shadowStrong,
            ]}
          >
            <HStack spacing={theme.spacing.md}>
              <View
                style={[
                  {
                    width: 56,
                    height: 56,
                    borderRadius: theme.borderRadius.lg,
                    backgroundColor: theme.colors.primaryTint,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  cardStyle.wrapper,
                ]}
              >
                <Wallet size={28} color={theme.colors.primary} strokeWidth={2} />
              </View>
              <VStack spacing={2} style={{ flex: 1 }}>
                <Text style={[theme.typography.body, { fontWeight: "600", color: theme.colors.text }]}>
                  Ver beneficios
                </Text>
                <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>
                  Elegibilidad y montos según tu perfil
                </Text>
              </VStack>
              <View
                style={[
                  {
                    width: 40,
                    height: 40,
                    borderRadius: theme.borderRadius.full,
                    backgroundColor: theme.colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  chipStyle.rounded,
                ]}
              >
                <Text style={{ fontSize: 18, fontWeight: "700", color: "#fff" }}>→</Text>
              </View>
            </HStack>
          </AnimatedPressableScale>
        </Link>

        <Link href="/profile/rsh" asChild>
          <AnimatedPressableScale
            style={[
              { overflow: "hidden", backgroundColor: theme.colors.surface, padding: theme.spacing.md },
              cardStyle.wrapper,
              cardStyle.shadow,
            ]}
          >
            <HStack spacing={theme.spacing.md}>
              <View
                style={[
                  {
                    width: 56,
                    height: 56,
                    borderRadius: theme.borderRadius.lg,
                    backgroundColor: theme.colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  cardStyle.wrapper,
                ]}
              >
                <FileCheck size={28} color={theme.colors.textSecondary} strokeWidth={2} />
              </View>
              <VStack spacing={2} style={{ flex: 1 }}>
                <Text style={[theme.typography.body, { fontWeight: "600", color: theme.colors.text }]}>
                  Registro Social de Hogares
                </Text>
                <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>
                  Completa tu perfil para postular
                </Text>
              </VStack>
              <View
                style={[
                  {
                    width: 40,
                    height: 40,
                    borderRadius: theme.borderRadius.full,
                    borderWidth: 2,
                    borderColor: theme.colors.primaryTintBorder,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  chipStyle.rounded,
                ]}
              >
                <Text style={[theme.typography.body, { fontWeight: "600", color: theme.colors.primary }]}>→</Text>
              </View>
            </HStack>
          </AnimatedPressableScale>
        </Link>
      </VStack>
    </View>
  );
}
