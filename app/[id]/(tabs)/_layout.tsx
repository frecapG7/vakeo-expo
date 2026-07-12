import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function ItemDetailsLayout() {


    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index" >
                <NativeTabs.Trigger.Label>
                    Accueil
                </NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{ default: "house", selected: "house.fill" }}
                    md="home"
                />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="planning">
                <NativeTabs.Trigger.Label>
                    Planning
                </NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{ default: "calendar.circle", selected: "calendar.circle.fill" }}
                    md="calendar_month" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="messages">
                <NativeTabs.Trigger.Label>
                    Messages
                </NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{ default: "bubble.right", selected: "bubble.right.fill" }}
                    md="chat" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}