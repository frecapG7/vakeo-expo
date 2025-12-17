import { Trip } from "@/types/models";
import { ImageBackground, View } from "react-native";




export const BackgroundHeader = ({ trip }: { trip: Trip }) => {


    return (
        <ImageBackground
            source={{ uri: trip?.image }}
            style={{
                width: "100%",
                height: "100%",
            }} >
            <View className="opacity-50 bg-black flex-1" />
        </ImageBackground>
    )
}