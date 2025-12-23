import { EventForm } from "@/components/events/EventForm";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { usePostEvent } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";




export default function NewTripActivity() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);

    const { mutateAsync: postEvent, isPending } = usePostEvent(String(id));

    const { me } = useContext(TripContext);

    const { control, setValue, reset, handleSubmit } = useForm({
        defaultValues: {
            name: "",
            attendees: [],
            owners: [],
            type: "",
            details: ""

        }
    });
    const type = useWatch({
        control,
        name: "type"
    });

    useEffect(() => {
        setValue("attendees", trip?.users.map(user => ({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            checked: false
        })));
    }, [trip, setValue]);

    const onSubmit = async (data) => {
        await postEvent({
            ...data,
            attendees: data.attendees.filter(attendee => attendee.checked)
        });
        router.back();
        Toast.success("Nouvelle activité ajoutée");

    }

    const navigation = useNavigation();

    useEffect(() => {
        if (type)
            navigation.setOptions({
                headerRight: () =>
                    <Button className="flex" onPress={handleSubmit(onSubmit)} isLoading={isPending}>
                        <Text className="text-lg dark:text-white">
                            Ajouter
                        </Text>
                    </Button>

            })
    }, [navigation, isPending, type]);
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}>

                {!type &&
                    <Animated.View entering={SlideInRight} exiting={SlideOutLeft}
                        className="flex-1 justify-center my-5">
                        <Text className="text-xl font-bold mx-1 my-2 dark:text-white">
                            Quel type d'événement veux tu créer ?
                        </Text>
                        <View className="flex-1 flex-row flex-wrap gap-5 p3-2 justify-center items-center">

                            <Button className="w-[40%] rounded-lg border items-center p-5 dark:bg-gray-400" onPress={() => setValue("type", "ACTIVITY")}>
                                <IconSymbol name="flame" size={34} color="black" />
                                <Text>Activité</Text>
                            </Button>
                            <Button className="w-[40%] rounded-xl border items-center p-5 dark:bg-gray-400" onPress={() => setValue("type", "MEAL")}>
                                <IconSymbol name="suit.spade" size={34} color="black" />
                                <Text>Repas</Text>
                            </Button>
                            <Button className="w-[40%] rounded-xl border items-center p-5" onPress={() => setValue("type", "ACTIVITY")} disabled>
                                <IconSymbol name="sportscourt" size={34} color="black" />
                                <Text>Sport</Text>
                            </Button>
                            <Button className="w-[40%] rounded-xl border items-center p-5" onPress={() => setValue("type", "ACTIVITY")} disabled>
                                <IconSymbol name="moon.stars.fill" size={34} color="black" />
                                <Text>Soirée</Text>
                            </Button>

                        </View>
                    </Animated.View>
                }

                {type &&
                    <Animated.View entering={SlideInRight} exiting={SlideOutLeft} className="flex-1">
                        <EventForm control={control} />
                    </Animated.View>
                }
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}