
import HalalIcon from "@/assets/icons/halal-sign.png";
import KosherIcon from "@/assets/icons/kosher.png";
import NoAlcoholIcon from "@/assets/icons/no-alcohol.png";
import NoPorkIcon from "@/assets/icons/no-pork.png";
import VeganIcon from "@/assets/icons/vegan.png";
import { Image } from "expo-image";
import { View } from "react-native";

type ImageSize = 'xs' | 'sm' | 'sm2' | 'md' | 'lg' | 'xl';


const sizeToClassMap = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    sm2: 'w-14 h-14',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36'
};


const valueToSource = {
    "hasHalal": HalalIcon,
    "hasKasher": KosherIcon,
    "hasNoPork": NoPorkIcon,
    "hasVegan": VeganIcon,
    "hasNoAlcohol": NoAlcoholIcon,
}


export const RestrictionIcon = ({ value, size = "md" }: { value: string, size: ImageSize }) => {


    const sizeClass = sizeToClassMap[size];
    const source = valueToSource[value];

    return (
        <View className={`rounded-full items-center p-1 ${sizeClass}`}>
            <Image
                source={source}
                style={{
                    width: "100%",
                    height: "100%",
                }}
                contentFit="contain"
            />

        </View>
    )

}