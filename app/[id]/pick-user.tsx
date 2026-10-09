import { FormText } from "@/components/form/FormText";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Screen } from "@/components/ui/Screen";
import { useTrip } from "@/context/TripContext";
import { JoinTripInput, useJoinTrip } from "@/hooks/api/useTokens";
import { useGetStorageTrip, useUpdateStorageTrip } from "@/hooks/storage/useStorageTrips";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { TripUser } from "@/types/models";

/**
 * Claim de seat v3 (Phase 5) pour un trip déjà en stockage. Cas nominal : sans
 * `user` (trips migrés sans siège) — le claim passe par POST /v3/trips/:id/join,
 * plus d'écriture storage directe (elle ne mintait aucun token → 401 ensuite).
 *
 * Si le storage désigne déjà un seat (repasse sur l'écran, entrée future de
 * changement d'identité) : il est marqué « Moi », le tap dessus ne fait rien
 * (retour), et un changement part du header x-user-token : le back libère
 * l'ancien siège et réclame le nouveau dans la même requête join.
 *
 * Privé : impossible sans joinToken — seul un lien de partage rafraîchi le
 * permet ; état dédié au lieu d'une liste inutilisable.
 */
export default function PickTripUserPage() {

    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    // Tri-state 403 v3 porté par le contexte (même query que le layout, dédup) :
    // "loading" | "ready" — le refus d'accès (403) rend l'écran d'état du layout,
    // cet écran ne le voit jamais. NB : un `!trip` avec status "ready" reste
    // possible (erreur réseau) — couvert par l'état « Voyage privé » ci-dessous.
    const { trip, status } = useTrip();

    // Seat déjà réclamé ? Le storage le sait ; le trip chargé fournit nom + avatar
    // (pas de fetch supplémentaire).
    const { data: storageTrip } = useGetStorageTrip(String(id));
    const meSeat = trip?.users?.find(user => user._id === storageTrip?.user);

    const joinTrip = useJoinTrip(String(id));
    const updateStorageTrip = useUpdateStorageTrip(String(id));

    const { control, handleSubmit } = useForm({ defaultValues: { name: "" } });

    // Nouveau profil : opt-in — la carte révèle le formulaire au tap.
    const [showNewProfile, setShowNewProfile] = useState(false);

    const finishJoin = async (user: { _id: string }, token: string) => {
        await updateStorageTrip.mutateAsync({ _id: String(id), user: user._id, token });
        router.dismissTo({
            pathname: "/[id]/settings/avatar",
            params: {
                id: String(id)
            }
        });
    };

    // Public : claim sans joinToken (spec v3). Un seat déjà réclamé est grisé
    // (marqueur claimed du GET /trips) — le serveur reste juge au join : le
    // marqueur est un confort UX, pas une garantie.
    const claimNewSeat = async (input: JoinTripInput) => {
        try {
            // Changement de siège : le header x-user-token porte l'ancien siège
            // (storage non purgé) — le back libère l'ancien et réclame le nouveau
            // dans la même transaction. Si le join échoue, rien n'a été consommé :
            // l'ancien siège et son token restent intacts.
            const response = await joinTrip.mutateAsync(input);
            await finishJoin(response.user, response.token);
        } catch (err) {
            // Seat pris, plus de place… : toast déjà porté par l'interceptor.
            console.warn("Join : échec", err);
        }
    };

    const onPickSeat = (seat: TripUser) => {
        // Même siège : aucune écriture API, retour — déjà en place.
        if (meSeat && meSeat._id === seat._id) {
            router.back();
            return;
        }
        return claimNewSeat({ tripUserId: seat._id });
    };

    const onCreateSeat = handleSubmit(async (data: { name: string }) =>
        claimNewSeat({ name: data.name.trim() })
    );

    if (status === "loading")
        return (
            <Screen className="flex-1 bg-mist dark:bg-ink">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size={50} />
                </View>
            </Screen>
        );

    if (!trip || trip.isPrivate) {
        // Privé déjà membre (repasse sur l'écran) : on le dit — changer de place
        // exige un lien de partage rafraîchi, l'écran n'a pas de joinToken.
        if (trip && meSeat)
            return (
                <Screen className="flex-1 bg-mist dark:bg-ink">
                    <View className="flex-1 items-center justify-center gap-3 px-6">
                        <View className="w-20 h-20 rounded-full bg-amber/15 justify-center items-center mb-2">
                            <IconSymbol name="lock" size={36} color="#EE8B33" />
                        </View>
                        <Text className="text-xl font-bold text-night dark:text-white text-center">
                            Voyage privé
                        </Text>
                        <Text className="text-sm text-night/50 dark:text-white/50 text-center mb-4">
                            Tu es déjà dans ce voyage en tant que {meSeat.name}. Pour changer de place, demande un lien de partage à l&apos;organisateur.
                        </Text>
                        <Button
                            title="Retourner au voyage"
                            variant="contained"
                            className="w-full"
                            onPress={() => router.back()}
                        />
                    </View>
                </Screen>
            );
        return (
            <Screen className="flex-1 bg-mist dark:bg-ink">
                <View className="flex-1 items-center justify-center gap-3 px-6">
                    <View className="w-20 h-20 rounded-full bg-amber/15 justify-center items-center mb-2">
                        <IconSymbol name="lock" size={36} color="#EE8B33" />
                    </View>
                    <Text className="text-xl font-bold text-night dark:text-white text-center">
                        Voyage privé
                    </Text>
                    <Text className="text-sm text-night/50 dark:text-white/50 text-center mb-4">
                        Pour réclamer ta place, demande un lien de partage à l&apos;organisateur du voyage.
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
    }

    return (
        <Screen className="flex-1 bg-mist dark:bg-ink">
            <ScrollView contentContainerClassName="px-4 py-4 gap-4" keyboardShouldPersistTaps="handled">
                <Text className="text-sm text-night/50 dark:text-white/50 text-center px-4">
                    Qui es-tu sur ce voyage ?
                </Text>

                {trip.users?.map(user => {
                    const isMe = meSeat?._id === user._id;
                    // Réconciliation : le marqueur serveur grise les sièges pris — sauf
                    // le nôtre, identifié par le storage, pas par le marqueur.
                    const taken = !!user.claimed && !isMe;
                    return (
                        <Pressable
                            key={user._id}
                            accessibilityRole="button"
                            accessibilityLabel={isMe
                                ? `${user.name}, ton siège actuel`
                                : taken
                                    ? `${user.name}, siège déjà pris`
                                    : `Rejoindre en tant que ${user.name}`}
                            accessibilityState={{ disabled: taken }}
                            disabled={taken}
                            onPress={() => onPickSeat(user)}
                            className={`flex-row items-center gap-3 border border-mist dark:border-white/10 rounded-2xl p-4 ${taken
                                ? "bg-white/60 dark:bg-night/60 opacity-60"
                                : "bg-white dark:bg-night active:bg-amber/10"}`}
                        >
                            <Avatar name={user.name} size2="sm" alt={user.name.charAt(0)} src={user.avatar} />
                            <Text className="flex-1 text-lg text-night dark:text-white">
                                {user.name}
                            </Text>
                            {isMe
                                ? (
                                    <View className="bg-amber/15 rounded-full px-2.5 py-1">
                                        <Text className="text-xs font-semibold text-amber-deep">
                                            Moi
                                        </Text>
                                    </View>
                                )
                                : taken
                                    ? (
                                        <View className="bg-night/5 dark:bg-white/5 rounded-full px-2.5 py-1">
                                            <Text className="text-xs font-semibold text-night/50 dark:text-white/50">
                                                Déjà pris
                                            </Text>
                                        </View>
                                    )
                                    : <IconSymbol name="chevron.right" size={18} color="#9CA3AF" />}
                        </Pressable>
                    );
                })}

                {/* Nouveau profil : une carte de la liste, pas un formulaire toujours exposé. */}
                {showNewProfile ? (
                    <View className="gap-3">
                        <Text className="text-base font-semibold text-night dark:text-white px-1">
                            Ton nouveau profil
                        </Text>
                        <FormText
                            control={control}
                            name="name"
                            placeholder="Ton prénom"
                            rules={{ required: true }}
                        />
                        <Button
                            title="Créer mon profil"
                            variant="contained"
                            className="w-full"
                            onPress={onCreateSeat}
                            isLoading={joinTrip.isPending}
                        />
                        <Pressable onPress={() => setShowNewProfile(false)} className="py-1">
                            <Text className="text-sm text-night/50 dark:text-white/50 text-center">
                                Annuler
                            </Text>
                        </Pressable>
                    </View>
                ) : (
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Créer un nouveau profil"
                        accessibilityHint="Rejoindre avec ton propre nom"
                        onPress={() => setShowNewProfile(true)}
                        className="flex-row items-center gap-3 bg-white dark:bg-night border border-mist dark:border-white/10 rounded-2xl p-4 active:bg-amber/10"
                    >
                        <View className="w-10 h-10 rounded-full bg-amber/15 justify-center items-center">
                            <IconSymbol name="plus" size={22} color="#EE8B33" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg text-night dark:text-white">
                                Je ne suis pas dans la liste
                            </Text>
                            <Text className="text-xs text-night/50 dark:text-white/50">
                                Créer un nouveau profil pour ce voyage
                            </Text>
                        </View>
                        <IconSymbol name="chevron.right" size={18} color="#9CA3AF" />
                    </Pressable>
                )}
            </ScrollView>
        </Screen>
    );
}
