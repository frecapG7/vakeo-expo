import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import { IconSymbol } from "./IconSymbol";

export const FloatingAddButton = ({ onPress, accessibilityLabel = "Ajouter", style }: { onPress: () => void, accessibilityLabel?: string, style?: StyleProp<ViewStyle> }) => (
  <Pressable
    className="absolute bottom-10 right-6 p-2 rounded-full border border-white bg-amber-deep items-center justify-center shadow"
    style={style}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}>
    <IconSymbol name="plus" color="white" size={26} />
  </Pressable>
);
