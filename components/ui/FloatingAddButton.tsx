import { Pressable } from "react-native";
import { IconSymbol } from "./IconSymbol";

export const FloatingAddButton = ({ onPress , accessibilityLabel = "Ajouter"}: { onPress: () => void, accessibilityLabel ?: string }) => (
  <Pressable
    className="absolute bottom-10 right-6 p-2 rounded-full border border-white bg-orange-400 items-center justify-center shadow"
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}>
    <IconSymbol name="plus" color="white" size={26} />
  </Pressable>
);
