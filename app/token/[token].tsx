import Styles from '@/constants/Styles';
import { useGetToken } from '@/hooks/api/useTokens';
import { useAddStorageTrip } from '@/hooks/storage/useStorageTrips';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function TokenRedirectionPage() {



    const { token } = useLocalSearchParams();
    const { data: trip } = useGetToken(String(token));
    const { mutate: addStorageTrip } = useAddStorageTrip();

    const router = useRouter();

    useEffect(() => {
        if (!trip)
            return;

        addStorageTrip(trip, {
            onSuccess: () => router.dismissTo({
                pathname: "/[id]",
                params: {
                    id: String(trip._id)
                }
            })
        });

    }, [trip, router, addStorageTrip]);

    return (
        <SafeAreaView style={Styles.container}>
            <View className='flex flex-grow items-center justify-center'>
                <ActivityIndicator size={50} />
            </View>

        </SafeAreaView>
    )
}