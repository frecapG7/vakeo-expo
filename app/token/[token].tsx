import Styles from '@/constants/Styles';
import { useGetToken } from '@/hooks/api/useTokens';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function TokenRedirectionPage() {



    const {token} = useLocalSearchParams();
    const {data: trip} = useGetToken(String(token));

    const router = useRouter();

    useEffect(() => {
        if(!trip)
            return;
        
        router.dismissTo({
            pathname: "/[id]",
            params: {
                id: String(trip._id)
            }
        })
    },[trip, router]);

    return (
        <SafeAreaView style={Styles.container}>
            <View className='flex flex-grow items-center justify-center'>
                <ActivityIndicator size={50} />
            </View>

        </SafeAreaView>
    )
}