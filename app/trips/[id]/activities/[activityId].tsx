import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useDeleteActivity, useGetActivity, usePutActivity } from "@/hooks/api/useActivities";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Pressable, SafeAreaView, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { ActivityForm } from "./components/ActivityForm";



export default function TripActivityDetails() {



    const { id, activityId } = useLocalSearchParams();
    const { data: trip } = useGetTrip(String(id));
    const { data: activity } = useGetActivity(String(id), String(activityId));


    const [edit, setEdit] = useState(false);


    const { control, handleSubmit, reset } = useForm();

    const updateActivity = usePutActivity(String(id), String(activityId));
    const deleteActivity = useDeleteActivity(String(id), String(activityId));

    const onSubmit = async (data: any) => {
        await updateActivity.mutateAsync({
            ...data,
            users: data.users.filter((user: any) => user.value).map((user: any) => user.id)
        });
        setEdit(false);
    }

    const onDelete = async () => {
        await deleteActivity.mutateAsync();
        setEdit(false);
    }

    useEffect(() => {
        reset({
            ...activity,
            users: trip?.users.map((user: any) => ({
                id: user.id,
                name: user.name,
                value: activity?.users.some((activityUser: any) => activityUser.id === user.id)
            })
            )
        })
    }, [reset, activity]);


    return (
        <Animated.ScrollView>

            <View className="flex flex-row justify-between items-center p-5">
                <Text className="text-3xl font-bold">{activity?.name}</Text>

                <Pressable onPress={() => setEdit(true)} className="flex flex-row justify-center items-center p-2 rounded-lg bg-gray-200">
                    <IconSymbol name="pencil" size={24} color="black" />
                </Pressable>
            </View>

            <View className="flex flex-col p-10 gap-5 divide-y divide-solid divide-gray-300">
                <View className="flex flex-row justify-between items-center">
                    <View className="flex flex-row items-center gap-2">
                        <IconSymbol name="calendar" size={24} color="black" />
                        <Text>Date</Text>
                    </View>
                    <View className="rounded-lg bg-gray-200 px-2 py-1">
                        <Text className="text-gray-800">{activity?.startDate}</Text>
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center">
                    <View className="flex flex-row items-center gap-2">
                        <IconSymbol name="person.circle" size={24} color="black" />
                        <Text>Participants</Text>
                    </View>
                    <View className="flex flex-row gap-2 rounded-lg bg-gray-200 items-center">
                        {activity?.users.map((user: any) => (
                            <Avatar key={user.id} size={32} name={user.name} color="green" />
                        ))}
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center">
                    <View className="flex flex-row items-center gap-2">
                        <IconSymbol name="link" size={24} color="black" />
                        <Text>Lien</Text>
                    </View>
                    <Text className="text-blue-500 underline max-w-40 truncate">
                        https://example.com/activity/zEZEHFEQRFQEZHFQERZGFQHJJFHQJFHGQFHGVZQJHFGVZGFLZGFGZERGHZBHFNJ?.BSDFJ.?BVQDSFVJ.QD
                    </Text>
                </View>
            </View>

            <SafeAreaView>
                <Modal transparent={false} visible={edit} animationType="slide" onRequestClose={() => setEdit(false)}>
                    <View>
                        <View className="flex flex-row justify-between items-center p-5">
                            <View className="flex flex-row items-center gap-2">
                                <Pressable onPress={() => setEdit(false)}>
                                    <IconSymbol name="xmark.circle" size={24} color="black" />
                                </Pressable>
                                <Text className="text-3xl font-bold">Modifier activité</Text>
                            </View>

                            <Button onPress={handleSubmit(onSubmit)} className="bg-blue-500 text-white px-4 py-2 rounded-lg" title="Terminer" />
                        </View>
                        <ActivityForm control={control} />

                        <View className="flex items-center justify-center p-5">
                            <Button onPress={onDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg w-1/2" title="Supprimer l'activité" />
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>

        </Animated.ScrollView >
    )



}