import { TripContext } from "@/context/TripContext";
import { useGetUnreadCount } from "@/hooks/api/useMessages";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useContext } from "react";

export default function ItemDetailsLayout() {


    const { me, trip } = useContext(TripContext);
    const { data: unreadCount = 0 } = useGetUnreadCount(trip?._id, me?._id);

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
            <NativeTabs.Trigger name="conversations">
                <NativeTabs.Trigger.Label>
                    Messages
                </NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{ default: "bubble.right", selected: "bubble.right.fill" }}
                    md="chat" />
                {unreadCount > 0 &&
                    <NativeTabs.Trigger.Badge>
                        {unreadCount > 9 ? '9+' : String(unreadCount)}
                    </NativeTabs.Trigger.Badge>
                }
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}