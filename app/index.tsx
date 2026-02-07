import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white px-6 pt-8">
      <Text className="mb-2 text-2xl font-bold text-gray-900">Bienvenido</Text>
      <Text className="mb-8 text-gray-600">
        Accede a beneficios y completa tu perfil RSH.
      </Text>

      <Link href="/benefits" asChild>
        <Pressable className="mb-4 rounded-xl bg-blue-600 py-3.5 active:opacity-90">
          <Text className="text-center font-semibold text-white">Ver beneficios</Text>
        </Pressable>
      </Link>

      <Link href="/profile/rsh" asChild>
        <Pressable className="rounded-xl border border-gray-300 bg-white py-3.5 active:opacity-90">
          <Text className="text-center font-semibold text-gray-700">
            Completar Registro Social de Hogares
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
