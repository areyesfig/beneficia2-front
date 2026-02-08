import React, { type ErrorInfo, type ReactNode } from "react";
import { View, Text, Pressable } from "react-native";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary:", error, errorInfo);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <View className="flex-1 items-center justify-center bg-teal-50 px-8">
          <View className="w-full max-w-sm rounded-3xl border border-teal-100 bg-white p-8 shadow-lg">
            <Text className="mb-2 text-center text-xl font-bold text-slate-800">
              Algo salió mal
            </Text>
            <Text className="mb-6 text-center text-slate-600">
              {this.state.error.message}
            </Text>
            <Pressable
              onPress={this.reset}
              className="rounded-2xl bg-teal-600 py-3.5 active:opacity-90"
              style={{ alignItems: 'center' }}
            >
              <Text className="font-semibold text-white">Reintentar</Text>
            </Pressable>
          </View>
        </View>
      );
    }
    return this.props.children;
  }
}
