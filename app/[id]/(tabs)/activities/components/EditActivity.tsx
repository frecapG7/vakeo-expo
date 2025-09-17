import { Button } from "@/components/ui/Button"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { ThemeProvider } from "@/components/ui/ThemeProvider"
import { useDeleteActivity, usePutActivity } from "@/hooks/api/useActivities"
import { useStyles } from "@/hooks/styles/useStyles"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Modal, Pressable, Text, View } from "react-native"
import Animated from "react-native-reanimated"
import { ActivityForm } from "./ActivityForm"



export const EditActivity = ({ trip, activity, open, onClose }: {
    trip?: any,
    activity?: any,
    open: boolean,
    onClose: (refresh?: boolean) => void
}) => {

    const { container } = useStyles();
    const { control, handleSubmit, reset } = useForm();

    const updateActivity = usePutActivity(String(trip?.id), String(activity?.id));
    const deleteActivity = useDeleteActivity(String(trip?.id), String(activity?.id));

    const onSubmit = async (data: any) => {
        await updateActivity.mutateAsync({
            ...data,
            users: data.users.filter((user: any) => user.value).map((user: any) => user.id)
        });
        onClose();
    }

    const onDelete = async () => {
        await deleteActivity.mutateAsync();
        onClose(false);
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
    }, [reset, activity, trip]);

    return (
        <Modal transparent={false} visible={open} animationType="slide" onRequestClose={() => onClose(false)}>
            <ThemeProvider>
                <Animated.View style={container} >
                    <View className="flex flex-row justify-between items-center p-5">
                        <View className="flex flex-row items-center gap-2">
                            <Pressable onPress={() => onClose()}>
                                <IconSymbol name="xmark.circle" size={24} color="black" />
                            </Pressable>
                            <Text className="text-2xl font-bold text-secondary">Modifier</Text>
                        </View>

                        <Button onPress={handleSubmit(onSubmit)} className="bg-primary-200 text-white px-4 py-2 rounded-lg" title="Terminer" />
                    </View>
                    <ActivityForm control={control} />

                    <View className="flex items-center justify-center p-5">
                        <Button onPress={onDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg w-1/2" title="Supprimer l'activité" />
                    </View>
                </Animated.View>
            </ThemeProvider>
        </Modal>
    )
}