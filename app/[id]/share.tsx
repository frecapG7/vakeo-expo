import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTrip } from "@/context/TripContext";
import { useShareTrip } from "@/hooks/api/useTrips";
import { FontAwesome5 } from "@react-native-vector-icons/fontawesome5/static";
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useMemo } from "react";
import { Text, View } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import Animated from "react-native-reanimated";
import { Toast } from "toastify-react-native";

export default function ShareTripPage() {

    const { trip } = useTrip();
    const { data: share } = useShareTrip(trip._id);

    const link = useMemo(() => {
        if (!share?.value) return "";
        return `vakeoexpo://token/${encodeURIComponent(share.value)}`;
    }, [share?.value]);

    const handleCopy = async () => {
        const shareLink = link;
        await Clipboard.setStringAsync(shareLink);
        Toast.info("Lien copié dans le presse-papier");
    };

    // Boutons de partage : cartes All In, la couleur de marque ne vit que sur l'icône.
    const shareRowClass = "w-full flex-row justify-between items-center gap-2 bg-white dark:bg-night border border-mist dark:border-white/10 rounded-2xl p-4";

    return (
        <View className="flex-1 bg-mist dark:bg-ink">
            <Animated.ScrollView contentContainerClassName="px-4 py-5">
                {/* // Header */}
                <Text className="text-2xl font-bold text-night dark:text-white text-center mb-2">
                    Partager &quot;{trip?.name}&quot;
                </Text>
                <Text className="text-sm text-night/50 dark:text-white/50 text-center mb-8">
                    Invitez vos amis à rejoindre l&apos;aventure
                </Text>
                <View className="items-center mt-4 ">
                    {/* QR Code */}
                    <View className="w-64 h-64 rounded-2xl bg-white dark:bg-night border border-mist dark:border-white/10 justify-center items-center">

                        {link ?
                            <Animated.View>
                                <QRCode value={link} size={200} backgroundColor="#FFFFFF" />
                            </Animated.View> :
                            <Animated.View>
                                <Skeleton height={200} width={200} />
                            </Animated.View>
                        }
                    </View>
                </View>
                <View className="w-full gap-3 mt-10">
                    <Button
                        disabled={!link}
                        onPress={() => Linking.openURL(`https://wa.me/?text=${encodeURIComponent(link)}`)}
                        className={shareRowClass}
                    >
                        <View className="flex-row items-center gap-3">
                            <FontAwesome5 name="whatsapp"
                                size={22}
                                color="#25D366"
                                iconStyle="brand" />
                            <Text className="text-night dark:text-white font-medium">Partager sur WhatsApp</Text>
                        </View>
                        <IconSymbol name="chevron.right" size={18} color="#9CA3AF" />
                    </Button>
                    <Button
                        disabled={!link}
                        onPress={() => Linking.openURL(`https://m.me/?link=${encodeURIComponent(link)}`)}
                        className={shareRowClass}
                    >
                        <View className="flex-row items-center gap-3">
                            <FontAwesome5
                                name="facebook-messenger"
                                size={22}
                                color="#0084FF"
                                iconStyle="brand"
                            />
                            <Text className="text-night dark:text-white font-medium">Partager sur Messenger</Text>
                        </View>
                        <IconSymbol name="chevron.right" size={18} color="#9CA3AF" />
                    </Button>
                    <Button
                        disabled={!link}
                        onPress={handleCopy}
                        className={shareRowClass}
                    >
                        <View className="flex-row items-center gap-3">
                            <IconSymbol name="link" size={22} color="#EE8B33" />
                            <Text className="text-lg text-night dark:text-white">
                                Copier le lien
                            </Text>
                        </View>
                        <IconSymbol name="chevron.right" size={18} color="#9CA3AF" />
                    </Button>
                </View>
            </Animated.ScrollView>
        </View>
    );
}
