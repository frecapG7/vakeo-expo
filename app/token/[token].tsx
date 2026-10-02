import Styles from '@/constants/Styles';
import { Screen } from '@/components/ui/Screen';
import { useGetToken } from '@/hooks/api/useTokens';
import { useAddStorageTrip } from '@/hooks/storage/useStorageTrips';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function TokenRedirectionPage() {

    const { token } = useLocalSearchParams();
    const { data, isError } = useGetToken(token);
    // useTokens.js n'est pas typé : réponse v1 GET /token/v2/:token → { _id, name, image }.
    // Flow à refondre en Phase 5 (resolve v3 + join).
    const trip = data as { _id: string } | undefined;
    const { mutate: addStorageTrip } = useAddStorageTrip();

    const router = useRouter();

    useEffect(() => {
        if (isError)
            router.dismissAll();
    }, [isError, router])

    useEffect(() => {
        if (!trip)
            return;
        // Stockage lean v3 : encodedId seul — name/image ne sont plus stockés
        // (l'affichage vit sur l'hydrate batch). Flow v1 à refondre en Phase 5.
        addStorageTrip({ _id: trip._id }, {
            onSuccess: () => router.dismissTo({
                pathname: "/[id]",
                params: {
                    id: String(trip._id)
                }
            })
        });
    }, [trip, router, addStorageTrip]);

    return (
        <Screen style={Styles.container}>
            <View className='flex flex-grow items-center justify-center'>
                <ActivityIndicator size={50} />
            </View>
        </Screen>
    )
}
