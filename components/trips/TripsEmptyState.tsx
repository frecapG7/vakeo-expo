import { Button } from "@/components/ui/Button";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { Text, View } from "react-native";

type TripsEmptyStateProps = {
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
    onCreate: () => void;
    onJoin: () => void;
};

/**
 * État vide de l’accueil « Mes projets » : skeletons en chargement,
 * carte de verre avec CTA (créer / rejoindre) si aucun voyage, retry si erreur.
 * Le fond brume / encre nuit est porté par ce composant (la page reste sur le fond système).
 */
export const TripsEmptyState = ({ isLoading, isError, onRetry, onCreate, onJoin }: TripsEmptyStateProps) => {

    let content: React.ReactNode;

    if (isLoading)
        content = (
            <View className="gap-5 w-full">
                <Skeleton height={256} />
                <Skeleton height={256} />
            </View>
        );

    else if (isError)
        content = (
            <View className="items-center gap-2">
                <IconSymbol name="exclamationmark.triangle" size={40} color="#EE8B33" />
                <Text className="text-h1 text-center text-night dark:text-white">Impossible de charger tes voyages</Text>
                <Text className="text-sm text-center text-gray-500 dark:text-gray-400">
                    Vérifie ta connexion, puis réessaie.
                </Text>
                <Button
                    className="border-2 border-night dark:border-white/25 px-4 py-2 rounded-xl mt-2"
                    title="Réessayer"
                    onPress={onRetry} />
            </View>
        );

    else
        content = (
            <GlassSurface style={{ borderRadius: 24 }}>
                <View className="items-center gap-3 p-6">
                    <IconSymbol name="map" size={40} color="#EE8B33" />
                    <Text className="text-h1 text-center text-night dark:text-white">Aucun voyage pour l’instant</Text>
                    <Text className="text-sm text-center text-gray-500 dark:text-gray-400">
                        Crée ton premier projet de voyage ou rejoins tes amis via un lien d’invitation.
                    </Text>
                    <View className="gap-3 w-full pt-2">
                        <Button
                            className="bg-amber p-4 rounded-2xl flex-row items-center justify-center gap-3"
                            onPress={onCreate}>
                            <IconSymbol name="plus.circle" size={28} color="#16265C" />
                            <Text className="text-base font-bold text-night">Créer un nouveau voyage</Text>
                        </Button>
                        <Button
                            className="border-2 border-night dark:border-white/25 bg-mist dark:bg-transparent p-4 rounded-2xl flex-row items-center justify-center gap-3"
                            onPress={onJoin}>
                            <IconSymbol name="link" size={28} color="#EE8B33" />
                            <Text className="text-base font-bold text-night dark:text-white">Rejoindre un voyage</Text>
                        </Button>
                    </View>
                </View>
            </GlassSurface>
        );

    return (
        <View className="flex-1 bg-mist dark:bg-ink justify-center px-6">
            {content}
        </View>
    );
};
