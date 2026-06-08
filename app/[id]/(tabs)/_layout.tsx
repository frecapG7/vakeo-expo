
import { NativeTabs } from "expo-router/build/native-tabs";

export default function ItemDetailsLayout() {


    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index" >
                <NativeTabs.Trigger.Label>
                    Accueil
                </NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf="house.fill"
                    md="home"
                />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="planning">
                <NativeTabs.Trigger.Label>
                    Planning
                </NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="calendar.circle.fill" md="calendar_month" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="messages">
                <NativeTabs.Trigger.Label>
                    Messages
                </NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="bubble.fill" md="chat" />
            </NativeTabs.Trigger>
        </NativeTabs>

    );
}