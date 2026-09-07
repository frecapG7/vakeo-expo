import GameEventIcon from "@/assets/icons/game_event_icon.png";
import MealEventIcon from "@/assets/icons/meal_event_icon.png";
import PartyEventIcon from "@/assets/icons/party_event_icon.png";
import RestaurantEventIcon from "@/assets/icons/restaurant_event_icon.png";
import SportEventIcon from "@/assets/icons/sport_event_icon.png";

// ✨ 1. On importe tes 3 nouvelles images ici ✨
import TransportEventIcon from "@/assets/icons/transport_event_icon.png";
import ExcursionEventIcon from "@/assets/icons/excursion_event_icon.png";
import OtherEventIcon from "@/assets/icons/other_event_icon.png";

import { EventType } from "@/types/models";
import { Image } from "expo-image";
import { View } from "react-native";

type ImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeToClassMap = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36'
};

const nameToSource = {
    "ACTIVITY": GameEventIcon,
    "MEAL": MealEventIcon,
    "PARTY": PartyEventIcon,
    "SPORT": SportEventIcon,
    "RESTAURANT": RestaurantEventIcon,
    // ✨ 2. On fait correspondre tes catégories avec les images importées ✨
    "TRANSPORT": TransportEventIcon,
    "EXCURSION": ExcursionEventIcon,
    "OTHER": OtherEventIcon
}

export const EventIcon = ({ name, size = "md" }: { name: EventType | string, size: ImageSize }) => {

    const sizeClass = sizeToClassMap[size];
    const source = nameToSource[name as keyof typeof nameToSource] || GameEventIcon;

    return (
        <View className={`rounded-full items-center p-1 ${sizeClass}`}>
            <Image
                source={source}
                style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 100
                }}
                contentFit="contain"
            />
        </View>
    )
}