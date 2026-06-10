import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { default as styles } from "@/constants/Styles";
import { useGetTrip, useShareTrip } from "@/hooks/api/useTrips";
import FontAwesome5 from "@react-native-vector-icons/fontawesome5/static";
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Text, View } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import Animated from "react-native-reanimated";
import { Toast } from "toastify-react-native";

export default function ShareTripPage() {
    const { id } = useLocalSearchParams<{id: string}>();

    const { data: trip } = useGetTrip(id);
    const { data: share } = useShareTrip(id);

    const link = useMemo(() => {
        if (!share?.value) return "";
        return `vakeoexpo://token/${encodeURIComponent(share.value)}`;
    }, [share?.value]);

    const handleCopy = async () => {
        const shareLink = link;
        await Clipboard.setStringAsync(shareLink);
        Toast.info("Lien copié dans le presse-papier");
    };


    return (
        <View style={styles.container} className="p-4">
            {/* // Header */}
            <Text className="text-2xl font-bold dark:text-white text-center mb-2">
                Partager "{trip?.name}"
            </Text>
            <Text className="text-md text-gray-500 dark:text-gray-400 text-center mb-8">
                Invitez vos amis à rejoindre l&apos;aventure
            </Text>
            <View className="items-center mt-4 ">
                {/* QR Code placeholder */}
                <View className="w-64 h-64 border-2 border-gray-300 dark:border-gray-600 rounded-xl justify-center items-center">

                    {link ?
                        <Animated.View>
                            <QRCode value={link} size={200} />
                        </Animated.View> :
                        <Animated.View className="h-64 w-64">
                            <Skeleton height={64} />
                        </Animated.View>
                    }
                </View>
            </View>
            <View className="w-full gap-4 mt-10">
                <Button
                    disabled={!link}
                    onPress={() => Linking.openURL(`https://wa.me/?text=${encodeURIComponent(link)}`)}
                    className="w-full flex-row justify-between items-center gap-2 bg-green-500 rounded-xl p-4"
                >
                    <View className="flex-row items-center gap-3">
                        <FontAwesome5 name="whatsapp" size={24} color="white" />
                        <Text className="text-white font-medium">Partager sur WhatsApp</Text>
                    </View>
                    <IconSymbol name="chevron.right" color="white" />
                </Button>
                <Button
                    disabled={!link}
                    onPress={() => Linking.openURL(`https://m.me/?link=${encodeURIComponent(link)}`)}
                    className="w-full flex-row justify-between items-center gap-2 bg-blue-600 rounded-xl p-4"
                >
                    <View className="flex-row items-center gap-3">
                        <FontAwesome5 name="facebook-messenger" size={24} color="white" />
                        <Text className="text-white font-medium">Partager sur Messenger</Text>
                    </View>
                    <IconSymbol name="chevron.right" color="white" />
                </Button>
                <Button
                    disabled={!link}
                    onPress={handleCopy}
                    className="w-full flex-row justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm"
                >
                    <View className="flex-row items-center gap-3">
                        <IconSymbol name="link" size={24} color="gray" />
                        <Text className="text-lg text-gray-800 dark:text-gray-200">
                            Copier le lien
                        </Text>
                    </View>
                    <IconSymbol name="chevron.right" color="gray" />
                </Button>
            </View>
        </View>
    );
}
