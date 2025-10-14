import { EventForm } from "@/components/events/EventForm";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";




export default function NewTripEvent() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);



    const { me } = useContext(TripContext);

    const { control, setValue, handleSubmit } = useForm({
        defaultValues: {
            name: "",
            attendees: [],
            owners: [],

        }
    });

    useEffect(() => {
        setValue("attendees", trip.users.map(user => ({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            checked: true
        })));
    }, [trip, setValue]);


    useEffect(() => {
        const v = [];
        v.push({
            _id: me._id,
            name: me?.name,
            avatar: me?.avatar
        });
        setValue("owners", v);
        // setValue("owners", [{
        //     _id: me?._id,
        //     name: me._name
        // }]);
    }, [me, setValue]);


    const onSubmit = async (data) => {
        console.log(data);
    }

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => 
                <Button className="flex" onPress={handleSubmit(onSubmit)}>
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