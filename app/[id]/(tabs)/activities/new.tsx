import { EventForm } from "@/components/events/EventForm";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { usePostEvent } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";




export default function NewTripActivity() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);

    const postEvent = usePostEvent(String(id));

    const { me } = useContext(TripContext);

    const { control, setValue, handleSubmit } = useForm({
        defaultValues: {
            name: "",
            attendees: [],
            owners: [],
            type: "ACTIVITY"

        }
    });

    useEffect(() => {
        setValue("attendees", trip?.users.map(user => ({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            checked: true
        })));
    }, [trip, setValue]);

    const onSubmit = async (data) => {
        await postEvent.mutateAsync({
            ...data,
            attendees: data.attendees.filter(attendee => attendee.checked)
        });
        router.back();
        Toast.success("Nouvelle activité ajoutée");

    }

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <Button className="flex" onPress={handleSubmit(onSubmit)} isLoading={postEvent.isPending}>
                    <Text className="text-lg dark:text-white">
                        Ajouter
                    </Text>
                </Button>

        })
    })
    return (
        <SafeAreaView style={styles.container}>
            <View className="flex-1">
                <EventForm control={control} />
            </View>
        </SafeAreaView>
    )
}