import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { Avatar } from "@/components/ui/Avatar";
import { CalendarDayView } from "@/components/ui/CalendarDayView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useGetEvent } from "@/hooks/api/useEvents";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function TripActivityDetails() {



    const { id, activityId } = useLocalSearchParams();


    const { data: activity } = useGetEvent(id, activityId);

    const [openOwners, setOpenOwners] = useState(false);



    return (
        <SafeAreaView style={styles.container}>


            <View className="flex-row justify-between px-5">
                <CalendarDayView>
                    <View className="flex items-center m-1">
                        <IconSymbol name="pencil" size={24} color="dark" />
                        <Text className="text-sm">Ajouter des dates</Text>
                    </View>
                </CalendarDayView>



                <Pressable className="flex max-w-50 items-center justify-center gap-2 p-2" onPress={() => setOpenOwners(true)}>
                    <View className="flex-row items-center ">
                        {activity?.owners.map((owner) =>
                            <View key={owner._id} className="flex -ml-7 ">
                                <Avatar src={owner.src} size2="md" alt={owner.name.charAt(0)} />
                            </View>)}
                    </View>
                    <View className="max-w-40 -ml-7">
                        <Text className="dark:text-white tex-sm" numberOfLines={1} >
                            {activity?.owners.map((owner) => owner.name).join(", ")}
                        </Text>

                    </View>
                </Pressable>
            </View>




            <View className="my-5">
                <Text className="font-bold text-xl dark:text-white ml-2">
                    Participants
                </Text>
                <View className="rounded-lg bg-orange-100 dark:bg-gray-400 gap-2 px-2 py-4">
                    {activity?.attendees.map((attendee) =>
                        <View key={attendee._id} className="flex flex-row gap-2 items-center">
                            <Avatar alt={attendee.name.charAt(0)} size2="sm" src={attendee.avatar} />
                            <Text className="text-lg ">{attendee.name}</Text>
                        </View>)}
                </View>
            </View>

            <PickUsersModal open={openOwners}
                onClose={() => setOpenOwners(false)}
                users={activity?.owners}
                disabled
            />
        </SafeAreaView>
    )
}