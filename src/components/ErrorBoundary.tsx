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
        <View className="flex-1 items-center justify-center bg-white px-8">
          <Text className="mb-2 text-center text-lg font-semibold text-gray-900">
            Algo salió mal
          </Text>
          <Text className="mb-6 text-center text-gray-600">
            {this.state.error.message}
          </Text>
          <Pressable
            onPress={this.reset}
            className="rounded-xl bg-blue-600 px-6 py-3 active:opacity-90"
          >
            <Text className="font-semibold text-white">Reintentar</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
