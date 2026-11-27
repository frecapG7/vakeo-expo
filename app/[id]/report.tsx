import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Screen } from "@/components/ui/Screen";
import { useTrip } from "@/context/TripContext";
import { useReportMessage } from "@/hooks/api/useMessages";
import { REPORT_REASONS, useReportContent } from "@/hooks/api/useReports";
import useColors from "@/hooks/styles/useColors";
import { ReportReason, ReportSubjectType } from "@/types/responses";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { Toast } from "toastify-react-native";

/** Libelles FR des motifs : l'API ne transporte que les cles (`spam`, `harassment`...). */
const REASON_LABELS: Record<ReportReason, string> = {
    spam: "Spam",
    harassment: "Harcèlement",
    illicit: "Contenu illicite",
    other: "Autre"
};

/** Limite du serveur (`contentReportService`) : coupee ici pour ne pas sortir en 422. */
const COMMENT_MAX_LENGTH = 500;

/**
 * Decalage du header natif, meme valeur que `app/new/setup-users.tsx` (seul ecran
 * de l'app dont le clavier est valide sur device). `KeyboardAvoidingView` mesure sa
 * frame par rapport a son parent, pas a l'ecran : sans ce decalage il se croit plus
 * haut qu'il n'est et sous-estime l'espace a reserver.
 */
const KEYBOARD_OFFSET = 64;

// Tuile de motif : choix unique, donc role bouton + etat selected (convention du projet).
const ReasonTile = ({ reason, active, disabled, onSelect }: {
    reason: ReportReason,
    active: boolean,
    disabled: boolean,
    onSelect: (reason: ReportReason) => void
}) => {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: active, disabled }}
            onPress={() => onSelect(reason)}
            disabled={disabled}
            className={`active:opacity-80 ${disabled ? "opacity-40" : ""}`}
        >
            <View className={`flex-row items-center justify-between rounded-2xl border px-4 py-3.5 ${active
                ? "border-amber-deep bg-amber/10 dark:bg-amber/15"
                : "border-mist dark:border-white/10 bg-white dark:bg-night"
                }`}>
                <Text className="text-base font-semibold text-night dark:text-white">
                    {REASON_LABELS[reason]}
                </Text>
                {active && (
                    <Animated.View
                        entering={ZoomIn}
                        className="w-6 h-6 rounded-full bg-amber-deep items-center justify-center"
                    >
                        <IconSymbol name="checkmark" color="#F6F8FD" size={12} />
                    </Animated.View>
                )}
            </View>
        </Pressable>
    );
};

/**
 * Signalement d'un contenu du voyage, en page presentee en modal (pattern
 * `links/new`). Une page plutot qu'un `Modal` RN : la presentation native prend
 * la safe area et le header a sa charge.
 *
 * Clavier : `behavior="padding"` (jamais `"height"`, qui decale un enfant au lieu
 * de reduire la zone et casse sur Android) + `keyboardVerticalOffset`, exactement
 * la configuration de `app/new/setup-users.tsx`. Le bouton vit dans le contenu
 * defilant, donc il reste atteignable meme si le decalage est imparfait.
 *
 * Cible passee en params par les ecrans appelants :
 * `/(id)/report?subjectType=message&subjectId=<id>&preview=<texte>[&eventId=<id>]`
 * (`eventId` sert uniquement a rafraichir la bonne liste de messages).
 */
export default function ReportSubject() {

    const { subjectType, subjectId, preview, eventId } = useLocalSearchParams<{
        subjectType?: string,
        subjectId?: string,
        preview?: string,
        /** Present uniquement depuis une conversation d'event (cle de cache). */
        eventId?: string
    }>();

    const { trip, me } = useTrip();
    const router = useRouter();
    const { inputPlaceHolder } = useColors();

    // Deux mutations, une seule surface de formulaire : `useReportMessage` ajoute
    // la mise a jour de `reportedByMe` dans le cache du chat.
    const reportMessage = useReportMessage(trip?._id, me?._id, eventId || undefined);
    const reportContent = useReportContent(trip?._id, me?._id);
    const isMessage = subjectType === "message";
    const isPending = isMessage ? reportMessage.isPending : reportContent.isPending;

    const [reason, setReason] = useState<ReportReason | null>(null);
    const [comment, setComment] = useState("");

    const handleSelectReason = (value: ReportReason) => {
        Haptics.selectionAsync();
        setReason(value);
    };

    const handleSubmit = () => {
        if (!reason || !subjectId || isPending) return;
        // Commentaire vide = non envoye : le serveur stocke null, inutile de pousser "".
        const trimmedComment = comment.trim() || undefined;
        const onSuccess = ({ alreadyReported }: { alreadyReported: boolean }) => {
            if (alreadyReported)
                Toast.success(isMessage ? "Message déjà signalé" : "Activité déjà signalée");
            else
                Toast.success(isMessage ? "Message signalé" : "Activité signalée");
            router.back();
        };

        if (isMessage)
            reportMessage.mutate({ messageId: String(subjectId), reason, comment: trimmedComment }, { onSuccess });
        else
            reportContent.mutate({
                subjectType: subjectType as ReportSubjectType,
                subjectId: String(subjectId),
                reason,
                comment: trimmedComment
            }, { onSuccess });
    };

    return (
        <Screen className="flex-1 bg-mist dark:bg-ink">
            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={KEYBOARD_OFFSET}
                className="flex-1">
                <ScrollView
                    className="flex-1"
                    contentContainerClassName="gap-5 p-5"
                    keyboardShouldPersistTaps="handled">

                    <View className="rounded-2xl border border-mist dark:border-white/10 bg-white dark:bg-night p-4">
                        <Text className="text-xs font-semibold text-night/50 dark:text-white/50 mb-1">
                            Contenu concerné
                        </Text>
                        <Text
                            className="text-sm text-night/80 dark:text-white/80"
                            numberOfLines={4}>
                            {preview}
                        </Text>
                    </View>

                    <View className="gap-2">
                        <Text className="text-sm font-semibold text-night dark:text-white">Motif</Text>
                        {REPORT_REASONS.map((value) => (
                            <ReasonTile
                                key={value}
                                reason={value}
                                active={reason === value}
                                disabled={isPending}
                                onSelect={handleSelectReason}
                            />
                        ))}
                    </View>

                    <View className="gap-2">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm font-semibold text-night dark:text-white">
                                Précisions
                            </Text>
                            <Text className="text-xs text-night/40 dark:text-white/40">
                                {comment.length}/{COMMENT_MAX_LENGTH}
                            </Text>
                        </View>
                        <TextInput
                            value={comment}
                            onChangeText={setComment}
                            className="bg-white dark:bg-night border border-mist dark:border-white/10 focus:border-amber-deep rounded-2xl p-3 h-28 text-night dark:text-white"
                            placeholder="Optionnel"
                            placeholderTextColor={inputPlaceHolder}
                            maxLength={COMMENT_MAX_LENGTH}
                            multiline
                            textAlignVertical="top"
                            editable={!isPending}
                        />
                    </View>

                    <Text className="text-xs text-night/50 dark:text-white/50">
                        {"L'auteur ne sera pas notifié et ne saura pas qui l'a signalé."}
                    </Text>

                    <Button
                        variant="contained"
                        title="Envoyer le signalement"
                        // Le motif est obligatoire cote serveur : pas de bouton actif sans choix.
                        disabled={!reason || !subjectId}
                        isLoading={isPending}
                        onPress={handleSubmit}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    );
}
