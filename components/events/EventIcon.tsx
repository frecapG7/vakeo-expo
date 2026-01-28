
import { EventType } from "@/types/models";
import { Image } from "expo-image";
import { View } from "react-native";
import GameEventIcon from "../../assets/icons/game_event_icon.png";
import MealEventIcon from "../../assets/icons/meal_event_icon.png";
import PartyEventIcon from "../../assets/icons/party_event_icon.png";
import SportEventIcon from "../../assets/icons/sport_event_icon.png";


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
    "SPORT": SportEventIcon
}


export const EventIcon = ({ name, size = "md" }: { name: EventType, size: ImageSize }) => {


    
    const sizeClass = sizeToClassMap[size];
    const source = nameToSource[name];

    return (
        <View className={`rounded-full p-1 ${sizeClass}`}>
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