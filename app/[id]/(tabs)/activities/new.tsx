import { EventForm, EventFormValues } from "@/components/events/EventForm";
import { EventIcon } from "@/components/events/EventIcon";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { usePostEvent } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import { toLabel } from "@/lib/eventUtils";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Text, View } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { Toast } from "toastify-react-native";




export default function NewTripActivity() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(String(id));

    const { mutateAsync: postEvent, isPending } = usePostEvent(String(id));

    const { me } = useContext(TripContext);

    const { control, setValue, reset, handleSubmit } = useForm<EventFormValues>({
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
        <Animated.ScrollView style={styles.container}>
            {!type &&
                <Animated.View entering={SlideInRight} exiting={SlideOutLeft}
                    className="flex-1 justify-center my-5">
                    <Text className="text-xl font-bold mx-1 my-2 dark:text-white">
                        Que prévoies tu ?
                    </Text>
                    <View className="flex-1 flex-row flex-wrap gap-5 p3-2 justify-center items-center">

                        {["MEAL", "RESTAURANT", "SPORT", "PARTY", "ACTIVITY"]
                            .map((value) => (
                                <Button className="w-[40%] rounded-lg border items-center p-5 dark:bg-gray-400"
                                    onPress={() => setValue("type", value)}
                                    key={value}>
                                    <EventIcon name={value} size="lg" />
                                    <Text className="capitalize font-bold">{toLabel({type: value})}</Text>
                                </Button>

                            ))}

                    </View>
                </Animated.View>
            }

            {type &&
                <Animated.View entering={SlideInRight} exiting={SlideOutLeft} className="flex-1">
                    <EventForm control={control} />
                </Animated.View>
            }
        </Animated.ScrollView>
    )
}