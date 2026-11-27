import { EventActionsDropdown } from "@/components/events/EventActionsDropdown";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTrip } from "@/context/TripContext";
import { useGetEvent } from "@/hooks/api/useEvents";
import { useGlassHeaderOptions } from "@/hooks/styles/useGlassHeaderOptions";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

export default function EventDetailsLayout() {

    const { id, eventId } = useLocalSearchParams();

    const { trip, me } = useTrip();
    // Meme query que la fiche : le cache partage evite un aller-retour en plus.
    const { data: event } = useGetEvent(trip?._id, String(eventId));

    // L'API refuse l'auto-signalement : un organisateur modifie, il ne signale pas.
    const isOwner = !!me && (event?.owners ?? []).some((owner) => owner._id === me._id);

    const glass = useGlassHeaderOptions();
    const router = useRouter();

    // Rien tant que l'event n'est pas charge : sinon « Signaler » apparaitrait
    // puis disparaitrait pour un organisateur.
    const headerActions = event ? (
        <EventActionsDropdown
            isOwner={isOwner}
            onEdit={() => router.push({
                pathname: "/[id]/events/[eventId]/edit",
                params: {
                    id: String(id),
                    eventId: String(eventId)
                }
            })}
            onReport={() => router.push({
                pathname: "/[id]/report",
                params: {
                    id: String(id),
                    subjectType: "event",
                    subjectId: String(event._id),
                    preview: [event.name, event.details].filter(Boolean).join(" · ")
                }
            })}
        />
    ) : null;

    return (
        <Stack screenOptions={{
            ...glass
        }}>
            <Stack.Screen name="index"
                options={{
                    headerShown: true,
                    headerLeft: () => <Button onPress={() => router.dismissTo({
                        pathname: "/[id]/(tabs)/planning",
                        params: {
                            id: String(id)
                        }
                    })}>
                        <IconSymbol name="arrow.left" />
                    </Button>,
                    // Le header porte le contexte (le trip) ; l'identité de l'event vit dans le héro.
                    headerTitle: trip?.name ?? "",
                    headerRight: () => headerActions
                }}
            />
            <Stack.Screen name="edit"
                options={{
                    title: "Modifier l'activité",
                    headerBackTitle: "Annuler"
                }}
            />
            <Stack.Screen name="edit-users"
                options={{
                    title: "Participants",
                    headerBackTitle: "Annuler"
                }}
            />
        </Stack>
    )
}
