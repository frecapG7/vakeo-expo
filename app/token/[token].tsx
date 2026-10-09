import { FormText } from "@/components/form/FormText";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Screen } from "@/components/ui/Screen";
import { JoinTripResponse, SeatCandidate, useJoinTrip, useResolveToken } from "@/hooks/api/useTokens";
import { useGetTripUser } from "@/hooks/api/useTrips";
import { useAddStorageTrip, useGetStorageTrip } from "@/hooks/storage/useStorageTrips";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

/**
 * Flow join v3 (Phase 5) : le lien de partage est résolu (GET /v3/token/:value),
 * l'utilisateur choisit son siège (POST /v3/trips/:encodedId/join) et l'identité
 * complète { encodedId, user, token } est stockée AVANT la navigation.
 *
 * Sélection en tuiles façon « character select » (pattern settings/avatar) +
 * barre de confirmation fixe. Déjà membre (storage) : son siège actuel est
 * affiché et présélectionné ; un changement de siège part du header
 * x-user-token — le back libère l'ancien et réclame le nouveau dans le join.
 * Public : tuile
 * « nouveau profil » ({ name }) en plus des sièges libres.
 */
export default function TokenRedirectionPage() {

    const { token } = useLocalSearchParams<{ token: string }>();
    const router = useRouter();

    const { data: resolved, isError } = useResolveToken(token);
    const encodedId = resolved?.encodedId ?? "";

    // Déjà membre ? Le storage sait qui l'utilisateur était sur ce trip.
    const { data: storageTrip } = useGetStorageTrip(encodedId);
    const { data: me } = useGetTripUser(encodedId, storageTrip?.user, {
        enabled: !!storageTrip?.user
    });

    const joinTrip = useJoinTrip(encodedId);
    const addStorageTrip = useAddStorageTrip();

    const { control } = useForm({ defaultValues: { name: "" } });
    const nameValue = useWatch({ control, name: "name" });

    // Choix utilisateur ; retombe sur le siège actuel tant que rien n'est choisi (pas d'effect).
    type SeatSelection = SeatCandidate | "new" | null;
    const [picked, setPicked] = useState<SeatSelection>(null);
    const meSeat: SeatCandidate | null = me
        ? { _id: me._id, name: me.name, avatar: me.avatar }
        : null;
    const selected: SeatSelection = picked ?? meSeat;

    const finishJoin = async (response: JoinTripResponse) => {
        if (!resolved)
            return;
        // Identité v3 complète : encodedId + seat + token du seat. C'est ce token
        // que l'interceptor lira dans MMKV pour toutes les requêtes du trip ensuite.
        await addStorageTrip.mutateAsync({
            _id: resolved.encodedId,
            user: response.user._id,
            token: response.token
        });
        goToTrip();
    };

    const goToTrip = () => {
        router.dismissTo({
            pathname: "/[id]",
            params: {
                id: String(encodedId)
            }
        });
    };

    // Privé : le joinToken (valeur du lien) doit voyager avec le seat choisi (spec v3).
    const claimSeat = (tripUserId: string) => joinTrip.mutateAsync({
        ...(resolved?.trip.isPrivate && { joinToken: token }),
        tripUserId
    });

    const onConfirm = async () => {
        if (!resolved || !selected)
            return;
        // Même siège : aucune écriture API, retour au voyage.
        if (meSeat && selected !== "new" && selected._id === meSeat._id) {
            goToTrip();
            return;
        }
        try {
            // Changement de siège : le header x-user-token porte l'ancien siège
            // (storage non purgé) — le back libère l'ancien et réclame le nouveau
            // dans la même transaction. Si le join échoue, rien n'a été consommé :
            // l'ancien siège et son token restent intacts.
            const response = selected === "new"
                ? await joinTrip.mutateAsync({ name: String(nameValue ?? "").trim() })
                : await claimSeat(selected._id);
            await finishJoin(response);
        } catch (err) {
            // Seat pris, plus de place… : toast déjà porté par l'interceptor.
            console.warn("Join : échec", err);
        }
    };

    if (isError)
        return (
            <Screen edges={["top", "left", "right", "bottom"]} className="flex-1 bg-mist dark:bg-ink">
                <View className="flex-1 items-center justify-center gap-3 px-6">
                    <View className="w-20 h-20 rounded-full bg-danger/10 justify-center items-center mb-2">
                        <IconSymbol name="link" size={36} color="#E5484D" />
                    </View>
                    <Text className="text-2xl font-bold text-night dark:text-white text-center">
                        Lien invalide ou expiré
                    </Text>
                    <Text className="text-sm text-night/50 dark:text-white/50 text-center mb-6">
                        Ce lien de partage n&apos;est plus actif. Demande-en un nouveau à l&apos;organisateur du voyage.
                    </Text>
                    <Button
                        title="Retour à l'accueil"
                        variant="outlined"
                        className="w-full"
                        onPress={() => router.dismissAll()}
                    />
                </View>
            </Screen>
        );

    if (!resolved)
        return (
            <Screen edges={["top", "left", "right", "bottom"]} className="flex-1 bg-mist dark:bg-ink">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size={50} />
                </View>
            </Screen>
        );

    const { trip, availableSeats } = resolved;
    const seats = [...(meSeat ? [meSeat] : []), ...availableSeats];
    // Q7 : privé sans seat disponible et pas déjà membre = complet, aucun CTA possible —
    // l'organisateur doit libérer une place ou repartager un lien.
    const isFull = trip.isPrivate && availableSeats.length === 0 && !storageTrip?.user;

    if (isFull)
        return (
            <Screen edges={["top", "left", "right", "bottom"]} className="flex-1 bg-mist dark:bg-ink">
                <View className="flex-1 items-center justify-center gap-3 px-6">
                    <View className="w-20 h-20 rounded-full bg-amber/15 justify-center items-center mb-2">
                        <IconSymbol name="person.2" size={36} color="#EE8B33" />
                    </View>
                    <Text className="text-xl font-bold text-night dark:text-white text-center">
                        Voyage complet
                    </Text>
                    <Text className="text-sm text-night/50 dark:text-white/50 text-center">
                        Toutes les places sont déjà prises. Demande à l&apos;organisateur de libérer une place, puis réessaie avec un nouveau lien.
                    </Text>
                    <Button
                        title="Retour à l'accueil"
                        variant="outlined"
                        className="w-full mt-2"
                        onPress={() => router.dismissAll()}
                    />
                </View>
            </Screen>
        );

    // Le storage désigne un membre mais son identité n'est pas encore résolue.
    if (storageTrip?.user && !me)
        return (
            <Screen edges={["top", "left", "right", "bottom"]} className="flex-1 bg-mist dark:bg-ink">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size={50} />
                </View>
            </Screen>
        );

    const isCurrentSeat = (seat: SeatCandidate) =>
        !!meSeat && seat._id === meSeat._id;

    const confirmTitle = selected === "new"
        ? "Créer mon profil"
        : (selected && isCurrentSeat(selected))
            ? "Retourner au voyage"
            : "Confirmer";

    const renderBadge = (visible: boolean) => visible && (
        <Animated.View
            entering={ZoomIn}
            className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-deep items-center justify-center border-2 border-white dark:border-night"
        >
            <IconSymbol name="checkmark" color="#F6F8FD" size={12} />
        </Animated.View>
    );

    return (
        <Screen edges={["top", "left", "right", "bottom"]} className="flex-1 bg-mist dark:bg-ink">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <Animated.ScrollView
                    contentContainerClassName="px-4 py-6 pb-8"
                    keyboardShouldPersistTaps="handled"
                >
                    {/* En-tête */}
                    <Text className="text-2xl font-bold text-night dark:text-white text-center">
                        {trip.name}
                    </Text>
                    <Text className="text-sm text-night/50 dark:text-white/50 text-center mt-1">
                        {trip.isPrivate
                            ? "Choisis ta place parmi celles préparées par l'organisateur"
                            : "Choisis ta place ou crée ton profil"}
                    </Text>

                    {/* Héros : la sélection en cours, façon character select */}
                    {selected && (
                        <View className="items-center gap-2 pt-8 pb-6">
                            <Animated.View
                                key={selected === "new" ? "new" : selected._id}
                                entering={ZoomIn.duration(250)}
                                className="rounded-full p-1.5 border-2 border-amber-deep bg-white dark:bg-night"
                            >
                                <Avatar
                                    name={selected === "new" ? String(nameValue ?? "") : selected.name}
                                    src={selected === "new" ? undefined : selected.avatar}
                                    alt={(selected === "new" ? String(nameValue ?? "") : selected.name)?.charAt(0) || "?"}
                                    size2="xl"
                                />
                            </Animated.View>
                            <Text className="text-lg font-bold text-night dark:text-white">
                                {selected === "new"
                                    ? (String(nameValue ?? "").trim() || "Nouveau profil")
                                    : selected.name}
                            </Text>
                            <Text className="text-sm text-night/50 dark:text-white/50">
                                {selected !== "new" && isCurrentSeat(selected)
                                    ? "Ton siège actuel"
                                    : selected === "new"
                                        ? "Ton nouveau profil"
                                        : "Prêt à rejoindre"}
                            </Text>
                        </View>
                    )}

                    {/* Tuiles sièges (pattern character select) */}
                    <View className="flex-row flex-wrap gap-3">
                        {seats.map((seat, index) => {
                            const isSelected = selected !== "new" && selected?._id === seat._id;
                            const current = isCurrentSeat(seat);
                            return (
                                <Animated.View
                                    key={seat._id}
                                    entering={FadeIn.delay(index * 40)}
                                    className="w-[31%]"
                                >
                                    <Pressable
                                        accessibilityRole="button"
                                        accessibilityLabel={current
                                            ? `${seat.name}, ton siège actuel`
                                            : `Rejoindre en tant que ${seat.name}`}
                                        accessibilityHint="Sélectionne ce siège"
                                        accessibilityState={{ selected: isSelected }}
                                        onPress={() => {
                                            Haptics.selectionAsync();
                                            setPicked(seat);
                                        }}
                                        className="active:opacity-80"
                                    >
                                        <View className={`relative rounded-2xl p-2 items-center border ${isSelected
                                            ? "border-amber-deep bg-amber/10 dark:bg-amber/15"
                                            : "border-mist dark:border-white/10 bg-white dark:bg-night"
                                            }`}>
                                            <Avatar src={seat.avatar} alt={seat.name.charAt(0)} name={seat.name} size2="lg" />
                                            {renderBadge(isSelected)}
                                        </View>
                                        <Text
                                            className="text-xs text-center mt-1.5 text-night/60 dark:text-white/60"
                                            numberOfLines={1}
                                        >
                                            {current ? "Moi" : seat.name}
                                        </Text>
                                    </Pressable>
                                </Animated.View>
                            );
                        })}

                        {/* Public : tuile « nouveau profil » — crée un seat au nom donné */}
                        {!trip.isPrivate && (
                            <Animated.View
                                entering={FadeIn.delay(seats.length * 40)}
                                className="w-[31%]"
                            >
                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel="Créer un nouveau profil"
                                    accessibilityHint="Rejoindre avec ton propre nom"
                                    accessibilityState={{ selected: selected === "new" }}
                                    onPress={() => {
                                        Haptics.selectionAsync();
                                        setPicked("new");
                                    }}
                                    className="active:opacity-80"
                                >
                                    <View className={`relative rounded-2xl p-2 items-center border ${selected === "new"
                                        ? "border-amber-deep bg-amber/10 dark:bg-amber/15"
                                        : "border-mist dark:border-white/10 bg-white dark:bg-night"
                                        }`}>
                                        <View className="w-16 h-16 rounded-full bg-amber/15 items-center justify-center">
                                            <IconSymbol name="plus" size={28} color="#EE8B33" />
                                        </View>
                                        {renderBadge(selected === "new")}
                                    </View>
                                    <Text
                                        className="text-xs text-center mt-1.5 text-night/60 dark:text-white/60"
                                        numberOfLines={1}
                                    >
                                        Nouveau
                                    </Text>
                                </Pressable>
                            </Animated.View>
                        )}
                    </View>

                    {/* Nom du nouveau profil — visible seulement si la tuile est élue */}
                    {selected === "new" && (
                        <View className="mt-6">
                            <FormText
                                control={control}
                                name="name"
                                placeholder="Ton prénom"
                                rules={{ required: true }}
                            />
                        </View>
                    )}
                </Animated.ScrollView>

                {/* Barre de confirmation fixe — désactivée sans choix ni nom */}
                <View className="p-4 border-t border-mist dark:border-white/10 bg-white dark:bg-night">
                    <Button
                        variant="contained"
                        title={confirmTitle}
                        isLoading={joinTrip.isPending}
                        onPress={onConfirm}
                        disabled={!selected || (selected === "new" && !String(nameValue ?? "").trim())}
                    />
                </View>
            </KeyboardAvoidingView>
        </Screen>
    );
}
