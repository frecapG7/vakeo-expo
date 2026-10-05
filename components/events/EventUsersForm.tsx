import { containsUser } from "@/lib/utils";
import { Event, Trip, TripUser } from "@/types/models";
import { Control, useFieldArray, useFormState } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { Avatar } from "../ui/Avatar";
import { IconSymbol } from "../ui/IconSymbol";
import { Toast } from "toastify-react-native";

/**
 * Sélection des participants (checkbox) et des responsables (étoile).
 * Règles : l'étoile n'existe que sur les participants ; décocher un owner
 * retire son étoile ; la dernière étoile ne se retire pas (toast d'erreur).
 */
export const EventsUsersForm = ({ trip, control, me }: { trip: Trip, control: Control<Event>, me?: TripUser }) => {

    const { fields: attendees, remove, append } = useFieldArray({
        control,
        name: "attendees",
        keyName: "customId",
    })

    const { fields: owners, append: appendOwner, remove: removeOwner } = useFieldArray({
        control,
        name: "owners",
        keyName: "customId",
    })

    const { isSubmitting } = useFormState({ control });

    const toggleAttendee = (user: TripUser) => {
        const index = attendees?.map(u => u._id)?.indexOf(user._id);
        if (index >= 0) {
            // Décocher un responsable retire aussi son étoile.
            const ownerIndex = owners?.map(o => o._id)?.indexOf(user._id);
            if (ownerIndex >= 0)
                removeOwner(ownerIndex);
            remove(index);
        } else {
            append(user);
        }
    }

    const toggleOwner = (user: TripUser) => {
        const index = owners?.map(o => o._id)?.indexOf(user._id);
        if (index >= 0) {
            if (owners.length <= 1) {
                Toast.error("Au moins un responsable est requis");
                return;
            }
            removeOwner(index);
        } else {
            appendOwner(user);
        }
    }

    return (
        <View className="flex-1 gap-3 px-4 pb-4">
            <View className="flex flex-row justify-end">
                <Pressable onPress={() => trip?.users.filter(user => !containsUser(user, attendees)).forEach(u => append(u))}>
                    <Text className="underline text-amber-deep dark:text-amber font-bold">
                        Sélectionner tous
                    </Text>
                </Pressable>
            </View>

            <View className="flex gap-2">
                {trip?.users?.map((user) => {
                    const checked = containsUser(user, attendees);
                    const isOwner = containsUser(user, owners);
                    const role = isOwner ? "Responsable" : (checked ? "Participant" : "Ne participe pas");
                    return (
                        <Pressable
                            key={user._id}
                            className={`flex-row items-center gap-3 rounded-2xl px-4 py-3.5 border bg-white dark:bg-night border-mist dark:border-white/10 ${isSubmitting ? "opacity-50" : ""}`}
                            disabled={isSubmitting}
                            onPress={() => toggleAttendee(user)}
                        >
                            <Avatar src={user.avatar}
                                alt={user.name.charAt(0)}
                                size2="sm" />

                            <View className="flex-1">
                                <Text className="text-base font-bold text-night dark:text-white">
                                    {user.name}{user._id === me?._id ? " (toi)" : ""}
                                </Text>
                                <Text className="text-xs text-gray-400">
                                    {role}
                                </Text>
                            </View>

                            {/* Etoile : uniquement sur les participants (le Pressable imbriqué prend le toucher) */}
                            {checked &&
                                <Pressable
                                    onPress={() => toggleOwner(user)}
                                    hitSlop={6}
                                    className={`h-10 w-10 rounded-full items-center justify-center ${isOwner ? "bg-amber/30" : ""}`}
                                >
                                    <IconSymbol
                                        name={isOwner ? "star.fill" : "star"}
                                        size={17}
                                        color={isOwner ? "#EE8B33" : "gray"}
                                    />
                                </Pressable>
                            }

                            {/* Checkbox participation */}
                            <View className={`h-7 w-7 rounded-lg border-2 items-center justify-center ${checked
                                ? "bg-amber-deep border-amber-deep"
                                : "border-gray-300 dark:border-white/25"
                                }`}>
                                {checked &&
                                    <IconSymbol name="checkmark" size={16} color="white" />
                                }
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            <Text className="text-[11px] text-gray-400 leading-4">
                L&apos;étoile désigne les responsables de l&apos;organisation. Au moins un responsable est requis.
            </Text>
        </View>
    )
}
