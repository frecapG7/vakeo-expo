import { IconSymbol } from "./IconSymbol";
import { Pressable } from "react-native";

export const FloatingAddButton = ({ onPress }: { onPress: () => void }) => (
  <Pressable
    className="absolute bottom-10 right-6 p-2 rounded-full border border-white bg-orange-400 items-center justify-center shadow"
    onPress={onPress}>
    <IconSymbol name="plus" color="white" size={26} />
  </Pressable>
);
