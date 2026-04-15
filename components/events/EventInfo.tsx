import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { Event, TripUser } from "@/types/models";
import { Text, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";

export const EventInfo = ({ event, me }: { event: Event, me: TripUser }) => {
    // const restrictions = useMemo(() => event ? buildRestrictions(event) : {}, [event]);
    // const [showAttendees, setShowAttendees] = useState(false);
    const { formatDate, formatHour } = useI18nTime();

    const { text } = useColors();

    return (

        <View>
            {/* <View className="gap-2 mx-5 my-5 shadow-lg shadow-orange-200 bg-white dark:bg-gray-900 rounded-xl">
                <View className="flex-row p-2 gap-2 items-center">
                    <View className="rounded-full bg-orange-200 p-2">
                        <IconSymbol name="calendar" size={30} color="gray" />
                    </View>
                    <View>
                        <Text className="uppercase text-gray-600 dark:text-gray-400">
                            Date & Heure
                        </Text>
                        <Text className="font-bold dark:text-white">
                            Choisis une date pour l'activité
                        </Text>
                    </View>
                </View>
                <View className="flex-1 px-5  justify-center">
                    <View className="flex-1 h-0.5 bg-orange-200" />
                </View>
                <View className="flex-row p-2 gap-2 items-center">
                    <View className="rounded-full bg-blue-200 p-2">
                        <IconSymbol name="map" size={30} color="gray" />
                    </View>
                    <View>
                        <Text className="uppercase text-gray-600 dark:text-gray-400">
                            lieu de rendez-vous
                        </Text>
                        <Text className="font-bold dark:text-white">
                            Choisis un lieu
                        </Text>
                    </View>
                </View>
            </View> */}
            <View className="flex-row gap-2">
                <View className="flex-1 rounded-xl bg-white dark:bg-gray-900 justify-center items-center ">
                    <IconSymbol name="calendar" color="orange" />
                    {!event?.startDate ?
                        <IconSymbol name="xmark" color={text} size={34} />
                        :
                        <View className="items-center">
                            <Text className="text-lg dark:text-white capitalize">
                                {event?.startDate && dayjs(event?.startDate).format("dddd")}
                            </Text>
                            <Text className="text-2xl font-bold dark:text-white">
                                {event?.startDate && dayjs(event?.startDate).date()}
                            </Text>
                            <Text className="text-lg dark:text-white capitalize">
                                {event?.startDate && dayjs(event?.startDate).format("MMMM")}
                            </Text>
                        </View>
                    }
                </View>
                <View className="flex-1 rounded-xl bg-white dark:bg-gray-900 items-center py-2">
                    <IconSymbol name="clock" color="orange" />
                    {!event?.startDate ?
                        <IconSymbol name="xmark" color={text} size={34} />
                        :
                        <View className="items-center">
                            <Text className="text-xl font-bold dark:text-white">
                                {event?.startDate && formatHour(event.startDate)}
                            </Text>
                            <Text className="dark:text-white">-</Text>
                            <Text className="text-xl font-bold dark:text-white">
                                {event?.endDate && formatHour(event.endDate)}
                            </Text>
                        </View>
                    }
                </View>
            </View>

            <View className="mx-2 my-5 gap-1">
                <View className="flex-row ml-3 items-end gap-1">
                    <IconSymbol name="doc.plaintext" color="orange" />
                    <Text className="capitalize font-bold ml-2 dark:text-white">
                        Détails
                    </Text>
                </View>
                <View className="rounded-xl px-2 py-4 bg-white dark:bg-gray-900">
                    <Text className="dark:text-white text-sm">
                        {event?.details ? event.details : "Pas de détails"}
                    </Text>
                </View>
            </View>
        </View>
    )
}
