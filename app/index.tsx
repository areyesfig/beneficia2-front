import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-teal-50 px-6 pt-10">
      <Text className="mb-2 text-3xl font-bold text-slate-800">Bienvenido</Text>
      <Text className="mb-10 text-base text-slate-600">
        Accede a beneficios y completa tu perfil RSH.
      </Text>

      <View className="gap-4">
        <Link href="/benefits" asChild>
          <Pressable className="rounded-3xl border border-teal-100 bg-white p-5 shadow-lg active:opacity-95">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-bold text-slate-800">Ver beneficios</Text>
                <Text className="mt-0.5 text-sm text-slate-600">Revisa tu elegibilidad y montos</Text>
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-600">
                <Text className="text-lg font-bold text-white">→</Text>
              </View>
            </View>
          </Pressable>
        </Link>

        <Link href="/profile/rsh" asChild>
          <Pressable className="rounded-3xl border border-teal-100 bg-white p-5 shadow-lg active:opacity-95">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-bold text-slate-800">
                  Registro Social de Hogares
                </Text>
                <Text className="mt-0.5 text-sm text-slate-600">Completa tu perfil para postular</Text>
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-full border border-teal-200">
                <Text className="text-lg font-semibold text-teal-600">→</Text>
              </View>
            </View>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
