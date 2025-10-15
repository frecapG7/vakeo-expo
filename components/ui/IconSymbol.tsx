// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { useColorScheme } from 'nativewind';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'xmark.circle': 'cancel',
  'pencil': 'edit',
  "person.circle": "person",
  "plus.circle": "add-circle-outline",
  "plus": "add",
  "checkmark.circle": "check-circle",
  "checkmark.circle.fill": "check-circle",
  "calendar": "calendar-month",
  "eurosign.circle": "euro-symbol",
  "bed.double": "bed",
  "ellipsis.circle": "more-horiz",
  "flame": "local-fire-department",
  "arrow.left": "arrow-back",
  "cart": "shopping-cart",
  "link": "insert-link",
  "trash": "delete-outline",
  "suit.spade": "fastfood",
  "list.dash": "format-list-bulleted",
  "clock": "access-time",
  "exclamationmark.triangle": "warning",
  "magnifyingglass": "search",
  "star": "star-border",
  "star.fill": "star",
  "circle": "radio-button-off",
  "circle.fill": "radio-button-checked",
  "message": "chat-bubble-outline",
  "doc.on.doc": "content-copy",
  "list.bullet" : "list" 
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const { colorScheme } = useColorScheme();
  return <MaterialIcons color={color ? color : colorScheme === "dark" ? "dark" : "white"} size={size} name={MAPPING[name]} style={style} />;
}
