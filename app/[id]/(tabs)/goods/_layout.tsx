import useColors from "@/hooks/styles/useColors";
import { Stack } from "expo-router";


export default function GoodsLayout() {


    const colors = useColors();



    return (
        <Stack screenOptions={{
            title: "Les courses",
              headerStyle: {
                backgroundColor: colors.background,
            },
            headerShadowVisible: false
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="details" options={{
                presentation: "modal",
                headerTitleStyle: {
                }
            }} />
        </Stack>
    )

}