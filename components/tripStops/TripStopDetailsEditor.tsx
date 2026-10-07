import styles from "@/constants/Styles";
import { useTrip } from "@/context/TripContext";
import { Trip, TripStop } from "@/types/models";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState, type RefObject } from "react";
import { useForm } from "react-hook-form";
import { Pressable, Text, useColorScheme, View, type ViewProps } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { FormText } from "../form/FormText";
import { PollStatus } from "../polls/PollStatus";
import { Button } from "../ui/Button";
import { GlassSheetBackground } from "../ui/GlassSurface";
import { IconSymbol } from "../ui/IconSymbol";
import { BottomAccommodationForm } from "./BottomAccommodationForm";
import { BottomLocationForm } from "./BottomLocationForm";





interface AccommodationWizardProps {
    onClose: () => void;
    trip: Trip;
    tripStop?: TripStop;
    onSubmit: (data: TripStop) => Promise<void>;
    isSubmitting?: boolean;
    /**
     * Cible du blur Android : ref d'un <BlurTargetView> enveloppant le contenu
     * sous le sheet (la liste des étapes), cf. GlassSheetBackground.
     */
    blurTarget?: RefObject<View | null>;
}


export const TripStopDetailsEditor = ({
    onClose,
    trip,
    tripStop,
    onSubmit,
    isSubmitting,
    blurTarget
}: AccommodationWizardProps) => {

    const isDark = useColorScheme() === "dark";
    const isEdit = !!tripStop;
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [tabValue, setTabValue] = useState("location");
    const { me } = useTrip();
    const router = useRouter();

    // Identité stable pour backgroundComponent (sinon remontage du fond à chaque render).
    const SheetBackground = useCallback(
        (props: ViewProps) => <GlassSheetBackground {...props} blurTarget={blurTarget} />,
        [blurTarget]
    );




    const { control, handleSubmit, formState: { isDirty } } = useForm<TripStop>({ defaultValues: tripStop || { name: "" } });
    // Soumission puis fermeture animée : le onClose du sheet (post-animation) remonte au parent.
    const submitAndClose = async (data: TripStop) => {
        await onSubmit(data);
        bottomSheetRef.current?.close();
    };



    return (

        <BottomSheet
            ref={bottomSheetRef}
            backgroundComponent={SheetBackground}
            backgroundStyle={styles.bottomSheet}
            index={0}
            enablePanDownToClose={true}
            enableOverDrag={false}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
            snapPoints={["60%", "85%"]}
            onClose={onClose}
        >
            <BottomSheetView style={{ flex: 1 }}>
                <View className="flex-row items-end justify-between p-4">
                    <Text className="text-2xl font-bold text-night dark:text-white">
                        {isEdit ? `Étape ${tripStop?.name}` : "Nouvelle étape"}
                    </Text>
                    <Button
                        onPress={() => bottomSheetRef.current?.close()}
                        className="flex-row items-center">
                        <IconSymbol name="xmark.circle" color={isDark ? "#F6F8FD" : "#16265C"} size={24} />
                    </Button>
                </View>

                {/* Nom de l'étape — champ partagé par les deux onglets */}
                <View className="px-4">
                    <FormText
                        control={control}
                        name="name"
                        placeholder="Nom de l'étape (ex: Paris)"
                        rules={{
                            required: true
                        }}
                    />
                </View>

                {/* Horizontal Tab Navigation */}
                <View className="flex-row border-b border-mist dark:border-white/10 mt-2">
                    <Pressable
                        className={`flex-row items-center justify-center flex-1 py-2 ${tabValue === 'location' ? 'border-b-2 border-amber-deep' : ''}`}
                        onPress={() => setTabValue('location')}
                    >
                        <Text className={`text-center font-medium ${tabValue === 'location' ? 'text-amber-deep dark:text-amber' : 'text-night/60 dark:text-white/60'}`}>
                            Adresse
                        </Text>
                    </Pressable>
                    <Pressable
                        className={`flex-row items-center justify-center flex-1 py-2 ${tabValue === 'accommodation' ? 'border-b-2 border-amber-deep' : ''}`}
                        onPress={() => setTabValue('accommodation')}
                    >
                        <Text className={`text-center font-medium ${tabValue === 'accommodation' ? 'text-amber-deep dark:text-amber' : 'text-night/60 dark:text-white/60'}`}>
                            Hébergement
                        </Text>
                    </Pressable>
                </View>

                <Animated.View
                    key={tabValue}
                    entering={SlideInRight}
                    exiting={SlideOutLeft}
                    className="flex my-5 gap-4">
                    {tabValue === "location" ?
                        <View className="mx-4 gap-3">
                            {isEdit &&
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-sm font-semibold text-night/60 dark:text-white/60">
                                        Sondage
                                    </Text>
                                    <PollStatus poll={tripStop?.polls?.filter(p => !p.isClosed && p.type === "OtherPoll")?.[0]}
                                        selectedUser={me}
                                        onNewClick={() => {
                                            bottomSheetRef.current?.close();
                                            router.push({
                                                pathname: "/[id]/polls/new",
                                                params: {
                                                    id: trip._id,
                                                    type: "OtherPoll",
                                                    stop: tripStop?._id
                                                }
                                            }
                                            )
                                        }}
                                        onPollClick={(pollId) => {
                                            bottomSheetRef.current?.close();
                                            router.push({
                                                pathname: "/[id]/polls/[pollId]",
                                                params: {
                                                    id: trip._id,
                                                    pollId,
                                                }
                                            })
                                        }}
                                    />
                                </View>
                            }
                            <BottomLocationForm
                                control={control}
                            />
                        </View>
                        :
                        <View className="mx-4 gap-3">
                            {isEdit &&
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-sm font-semibold text-night/60 dark:text-white/60">
                                        Sondage
                                    </Text>
                                    <PollStatus poll={tripStop?.polls?.filter(p => !p.isClosed && p.type === "HousingPoll")?.[0]}
                                        selectedUser={me}
                                        onNewClick={() => {
                                            bottomSheetRef.current?.close();
                                            router.push({
                                                pathname: "/[id]/polls/new",
                                                params: {
                                                    id: trip._id,
                                                    type: "HousingPoll",
                                                    stop: tripStop?._id
                                                }
                                            })
                                        }}
                                        onPollClick={(pollId) => {
                                            bottomSheetRef.current?.close();
                                            router.push({
                                                pathname: "/[id]/polls/[pollId]",
                                                params: {
                                                    id: trip._id,
                                                    pollId
                                                }
                                            })
                                        }}
                                    />
                                </View>
                            }
                            <BottomAccommodationForm
                                control={control}
                            />
                        </View>
                    }
                </Animated.View>

                <View className="mx-10">
                    <Button variant="contained"
                        title={isEdit ? "Modifier" : "Ajouter l'étape"}
                        onPress={() => handleSubmit(submitAndClose)()}
                        isLoading={isSubmitting}
                        disabled={!isDirty}
                    />
                </View>
            </BottomSheetView>

        </BottomSheet>

    )

}
