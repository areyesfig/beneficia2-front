import React from "react";
import { Pressable, PressableProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const springConfig = { damping: 15, stiffness: 400 };

/**
 * Pressable con feedback de escala (react-native-design - Reanimated).
 * onPressIn: scale 0.97, onPressOut: scale 1.
 */
export function AnimatedPressableScale({
  children,
  style,
  onPress,
  onPressIn,
  onPressOut,
  ...rest
}: PressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[style, animatedStyle]}
      onPress={onPress}
      onPressIn={(e) => {
        scale.value = withSpring(0.97, springConfig);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, springConfig);
        onPressOut?.(e);
      }}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
