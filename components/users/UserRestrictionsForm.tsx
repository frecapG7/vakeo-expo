import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { translateRestriction } from "@/lib/userUtils";
import { useController } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { RestrictionIcon } from "./RestrictionIcon";


type UserRestrictionsFormProps = {
    control: any;
};

// Grille de tuiles sélectionnables (même langage que le picker d'avatar) —
// tap pour activer/désactiver, pas d'interrupteur.
// Libellés : translateRestriction = source unique, partagée avec la page des restrictions du trip.
const RESTRICTIONS = ["hasHalal", "hasKasher", "hasNoPork", "hasNoAlcohol", "hasVegan"];

const RestrictionTile = ({ control, name }: { control: any, name: string }) => {
    const { field: { value, onChange } } = useController({ control, name, defaultValue: false });
    const active = !!value;

    const handleToggle = () => {
        Haptics.selectionAsync();
        onChange(!active);
    };

    return (
        <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: active }}
            onPress={handleToggle}
            className="w-[31%] active:opacity-80"
        >
            <View
                className={`relative rounded-2xl p-3 items-center gap-2 border ${active
                    ? "border-amber-deep bg-amber/10 dark:bg-amber/15"
                    : "border-mist dark:border-white/10 bg-white dark:bg-night"
                    }`}
            >
                <View className="w-12 h-12 rounded-full items-center justify-center bg-mist dark:bg-white/10">
                    <RestrictionIcon value={name} size="xs" />
                </View>
                <Text
                    className="text-xs font-bold text-night dark:text-white text-center capitalize"
                    numberOfLines={2}
                >
                    {translateRestriction(name)}
                </Text>
                {active && (
                    <Animated.View
                        entering={ZoomIn}
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-deep items-center justify-center border-2 border-white dark:border-night"
                    >
                        <IconSymbol name="checkmark" color="#F6F8FD" size={12} />
                    </Animated.View>
                )}
            </View>
        </Pressable>
    );
};

export const UserRestrictionsForm = ({ control }: UserRestrictionsFormProps) => {
    return (
        <View className="flex-row flex-wrap gap-3">
            {RESTRICTIONS.map(name => (
                <RestrictionTile
                    key={name}
                    control={control}
                    name={name}
                />
            ))}
        </View>
    );
};
