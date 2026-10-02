import { Wordmark } from "@/components/brand/Wordmark";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

/**
 * Wordmark tappable — retour à la home depuis n'importe quel écran de l'app
 * (dismissAll remonte à la racine). `onMedia` pour les rendus sur photo
 * (header flottant du dashboard).
 */
export const WordmarkHomeButton = ({ size = 18, onMedia = false }: { size?: number, onMedia?: boolean }) => {
    const router = useRouter();

    return (
        <Pressable
            onPress={() => router.dismissAll()}
            hitSlop={12}
            accessibilityLabel="Retour à l'accueil"
            accessibilityRole="button">
            <Wordmark size={size} onMedia={onMedia} />
        </Pressable>
    );
};
