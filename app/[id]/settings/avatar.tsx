import { Avatar } from "@/components/ui/Avatar";
import * as Haptics from "expo-haptics";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTrip } from "@/context/TripContext";
import { useGetTripUser, useUpdateTripUser } from "@/hooks/api/useTrips";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, ZoomIn } from "react-native-reanimated";

// Catalogue d'avatars en deux familles — mise en scène « sélection de personnage ».
const avatars = [
    { category: "perso", uri: "https://storage.googleapis.com/vakeo_dev/avatar/femme_neige.png" },
    { category: "perso", uri: "https://storage.googleapis.com/vakeo_dev/avatar/fille.png" },
    { category: "perso", uri: "https://storage.googleapis.com/vakeo_dev/avatar/garcon.png" },
    { category: "perso", uri: "https://storage.googleapis.com/vakeo_dev/avatar/homme_rando.png" },
    { category: "perso", uri: "https://storage.googleapis.com/vakeo_dev/avatar/papie.png" },
    { category: "perso", uri: "https://storage.googleapis.com/vakeo_dev/avatar/famille.png" },
    { category: "perso", uri: "https://storage.googleapis.com/vakeo_dev/avatar/fille_piscine.png" },
    { category: "perso", uri: "https://storage.googleapis.com/vakeo_dev/avatar/homme_noir_surf.png" },
    { category: "perso", uri: "https://storage.googleapis.com/vakeo_dev/avatar/chef_poule.png" },
    { category: "animaux", uri: "https://storage.googleapis.com/vakeo_dev/avatar/chat.png" },
    { category: "animaux", uri: "https://storage.googleapis.com/vakeo_dev/avatar/chien.png" },
    { category: "animaux", uri: "https://storage.googleapis.com/vakeo_dev/avatar/dauphin.png" },
    { category: "animaux", uri: "https://storage.googleapis.com/vakeo_dev/avatar/licorne.png" },
    { category: "animaux", uri: "https://storage.googleapis.com/vakeo_dev/avatar/marmotte.png" },
    { category: "animaux", uri: "https://storage.googleapis.com/vakeo_dev/avatar/morse.png" },
];

const CATEGORIES = ["perso", "animaux"] as const;
const CATEGORY_LABELS: Record<(typeof CATEGORIES)[number], string> = {
    perso: "Personnages",
    animaux: "Animaux",
};


export default function AvatarSetting() {

    const router = useRouter();
    const { me, trip } = useTrip();
    const { data: user } = useGetTripUser(trip._id, me?._id);
    const updateUser = useUpdateTripUser(trip._id, user?._id);
    // Choix utilisateur ; retombe sur l'avatar du seat tant que rien n'est choisi (pas d'effect).
    const [pickedAvatar, setPickedAvatar] = React.useState<string | null>(null);
    const selectedAvatar = pickedAvatar ?? user?.avatar ?? null;
    const isNewPick = !!pickedAvatar && pickedAvatar !== user?.avatar;

    const disabledAvatars = trip?.users.filter(u => u._id !== user?._id)?.map(u => u.avatar);

    const handleSelect = (uri: string) => {
        Haptics.selectionAsync();
        setPickedAvatar(uri);
    };

    const handleSave = async () => {
        if (selectedAvatar && user)
            await updateUser.mutateAsync({
                ...user,
                avatar: selectedAvatar
            });
        router.back();

    };

    // Libellé sous une tile : le propriétaire si pris, « Moi » si c'est l'avatar actuel.
    const getUserNameForAvatar = (uri: string): string => {
        const disabledUser = trip?.users.filter(u => u._id !== user?._id)
            ?.find(u => u.avatar === uri);
        if (disabledUser) {
            return disabledUser.name;
        }
        if (user?.avatar === uri) {
            return "Moi";
        }
        return "";
    };

    return (
        <View className="flex-1 bg-mist dark:bg-ink">
            <Animated.ScrollView contentContainerClassName="px-4 pb-6">

                {/* Héros : la sélection en cours, façon character select */}
                <View className="items-center gap-2 pt-4 pb-8">
                    {selectedAvatar && (
                        <Animated.View
                            key={selectedAvatar}
                            entering={ZoomIn.duration(250)}
                            className="rounded-full p-1.5 border-2 border-amber-deep bg-white dark:bg-night"
                        >
                            <Avatar src={selectedAvatar} size2="xl" />
                        </Animated.View>
                    )}
                    <Text className="text-2xl font-bold text-night dark:text-white">
                        {user?.name || "Ton avatar"}
                    </Text>
                    <Text className="text-sm text-night/50 dark:text-white/50">
                        {isNewPick ? "Nouveau look prêt à enregistrer" : "Ton avatar actuel"}
                    </Text>
                </View>

                {/* Catalogue par familles */}
                {CATEGORIES.map(category => {
                    const items = avatars.filter(a => a.category === category);
                    return (
                        <View key={category} className="mb-6">
                            <Text className="text-xs font-bold text-night/60 dark:text-white/60 mb-3 uppercase tracking-widest">
                                {CATEGORY_LABELS[category]}
                            </Text>
                            <View className="flex-row flex-wrap gap-3">
                                {items.map((item, index) => {
                                    const isSelected = selectedAvatar === item.uri;
                                    const isDisabled = disabledAvatars?.includes(item.uri);
                                    const userName = getUserNameForAvatar(item.uri);
                                    const ownerSuffix = userName === "Moi" ? ", mon avatar actuel" : userName ? `, déjà pris par ${userName}` : "";
                                    const tileLabel = `Avatar ${category === "perso" ? "personnage" : "animal"} ${index + 1}${ownerSuffix}`;

                                    return (
                                        <Animated.View
                                            key={item.uri}
                                            entering={FadeIn.delay(index * 40)}
                                            exiting={FadeOut}
                                            className="w-[31%]"
                                        >
                                            <Pressable
                                                accessibilityRole="button"
                                                accessibilityLabel={tileLabel}
                                                accessibilityHint="Sélectionne cet avatar"
                                                accessibilityState={{ selected: isSelected, disabled: isDisabled }}
                                                disabled={isDisabled}
                                                onPress={() => handleSelect(item.uri)}
                                                className={isDisabled ? "opacity-40" : "active:opacity-80"}
                                            >
                                                <View
                                                    className={`relative rounded-2xl p-2 items-center border ${isSelected
                                                        ? "border-amber-deep bg-amber/10 dark:bg-amber/15"
                                                        : "border-mist dark:border-white/10 bg-white dark:bg-night"
                                                        }`}
                                                >
                                                    <Avatar src={item.uri} size2="lg" />
                                                    {isDisabled && (
                                                        <View className="absolute top-1 right-1 bg-ink/70 rounded-full p-1">
                                                            <IconSymbol name="lock.fill" color="#F6F8FD" size={12} />
                                                        </View>
                                                    )}
                                                    {isSelected && (
                                                        <Animated.View
                                                            entering={ZoomIn}
                                                            className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-deep items-center justify-center border-2 border-white dark:border-night"
                                                        >
                                                            <IconSymbol name="checkmark" color="#F6F8FD" size={12} />
                                                        </Animated.View>
                                                    )}
                                                </View>
                                                {!!userName && (
                                                    <Text
                                                        className="text-xs text-center mt-1.5 text-night/60 dark:text-white/60"
                                                        numberOfLines={1}
                                                    >
                                                        {userName}
                                                    </Text>
                                                )}
                                            </Pressable>
                                        </Animated.View>
                                    );
                                })}
                            </View>
                        </View>
                    );
                })}
            </Animated.ScrollView>

            {/* Barre d'action fixe — désactivée tant que rien ne change (pas de PUT no-op) */}
            <View className="p-4 border-t border-mist dark:border-white/10 bg-white dark:bg-night">
                <Button
                    variant="contained"
                    title="Enregistrer mon avatar"
                    isLoading={updateUser.isPending}
                    onPress={handleSave}
                    disabled={!isNewPick}
                />
            </View>
        </View>
    );
}
