import { FormText } from "@/components/form/FormText"
import { FormTextArea } from "@/components/form/FormTextArea"
import { Button } from "@/components/ui/Button"
import useI18nTime from "@/hooks/i18n/useI18nTime"
import dayjs from "dayjs"
import { useMemo, useState } from "react"
import { Control, useController, useFieldArray } from "react-hook-form"
import { Pressable, Text, View } from "react-native"
import AnimatedCheckbox from "react-native-checkbox-reanimated"

import { TripUser } from "@/types/models"
import { PickUsersModal } from "../modals/PickUsersModal"
import { Avatar } from "../ui/Avatar"
import { IconSymbol } from "../ui/IconSymbol"




interface IUser extends TripUser {
    checked: boolean,
    customId: string
}


export interface EventFormValues {
    name: string,
    startDate: Date;
    endDate: Date;
    details: string;
    owners: IUser[];
    attendees: IUser[];
}


const buildDateTime = (date, time) => {
    return new Date(date.toISOString().split("T")[0] + "T" + time.toISOString().split("T")[1]);
}


export const EventForm = ({ control, }: {
    control: Control<EventFormValues>,
}) => {

    const { fields: owners, remove, append } = useFieldArray({
        control,
        name: "owners",
        keyName: "customId", // This is important to uniquely identify each user
        // de: trip?.users.map(user => ({ id: user.id, name: user.name, value: true })) || []
    })
    const { fields: attendees, update } = useFieldArray({
        control,
        name: "attendees",
        keyName: "customId", // This is important to uniquely identify each user
        // de: trip?.users.map(user => ({ id: user.id, name: user.name, value: true })) || []
    })


    const [editOwners, setEditOwners] = useState(false);

    const { formatDate, getTime } = useI18nTime();


    const [pickDateTime, setPickDateTime] = useState<string>("");
    const { field: { value: startDate, onChange: setStartDate },
        fieldState: { error: startDateError } }
        = useController({
            control,
            name: "startDate",
            rules: {
                validate: (v) => {
                    if (!v && !!endDate)
                        return "La date de début est obligatoire"
                    if (v > endDate)
                        return "La date de début est postérieure à la date de fin"
                }
            }
        });
    const { field: { value: endDate, onChange: setEndDate },
        fieldState: { error: endDateError } } = useController({
            control,
            name: "endDate",
            rules: {
                validate: (v) => {
                    if (!v && !!startDate)
                        return "La date de fin est obligatoire"
                    if (v < startDate)
                        return "La date de fin est antérieure à la date de début"
                },

            }
        });

    const [mode, setMode] = useState("date");


    const handleDismiss = () => {
        if (mode === "time")
            setMode("date")
        else if (mode === "date")
            setPickDateTime("");
    }

    const handleSet = (date) => {
        let v;
        if (mode === "date")
            v = date;
        else if (mode === "time")
            if (pickDateTime === "startDate")
                v = buildDateTime(startDate, date);
            else
                v = buildDateTime(endDate || startDate, date);

        if (pickDateTime === "startDate")
            setStartDate(v)
        else
            setEndDate(v);
    }

    const value = useMemo(() => {
        let v;
        if (pickDateTime === "startDate")
            v = startDate;
        else if (pickDateTime === "endDate")
            v = endDate;

        return dayjs(v).toDate() || new Date();
    }, [startDate, endDate, pickDateTime])

    return (
        <View>
            <View className="flex">
                <Text className="text-lg font-bold  italic ml-5 dark:text-white">
                    Nom
                </Text>
                <FormText control={control} name="name" rules={{ required: true }} />
            </View>
            <View className="my-2">
                <Text className="text-lg font-bold italic ml-5 dark:text-white">
                    Dates
                </Text>
                <View className={`flex-row grow bg-gray-200 rounded-lg ${(startDateError || endDateError) && "border border-red-400"}`}>
                    <Pressable className="grow items-center active:opacity-75 py-0.5" onPress={() => {
                        setMode("date");
                        setPickDateTime("startDate");

                    }}>
                        <Text>{startDate ? formatDate(startDate) : "Début"}</Text>
                        <Text>{startDate ? getTime(startDate) : "-"}</Text>
                    </Pressable>
                    <View className="w-0.5 my-1 bg-black" />
                    <Pressable className="grow items-center active:opacity-75 py-0.5" onPress={() => setPickDateTime("endDate")}>
                        <Text>{endDate ? formatDate(endDate) : "Fin"}</Text>
                        <Text>{endDate ? getTime(endDate) : "-"}</Text>
                    </Pressable>
                </View>
            </View>


            <View className="flex-1 mt-1 gap-2">
                <View className="flex flex-row justify-between" >
                    <Text className="text-lg font-bold  italic ml-5 dark:text-white">
                        Responsables
                    </Text>

                </View>
                <View className="flex gap-5 bg-gray-200 rounded-lg py-2 ">
                    {owners?.map((owner, index) => (
                        <View key={owner._id} className="flex flex-row items-center justify-between px-5" >
                            <View className="flex-row gap-2 items-center">
                                <Avatar src={owner.avatar} alt={owner.name.charAt(0)} size2="sm" />
                                <Text className="text-lg font-bold">{owner.name}</Text>
                            </View>
                            <Button onPress={() => remove(index)} className="bg-red-500 dark:bg-gray-700 rounded-full p-1">
                                <IconSymbol name="trash" size={20} color="black" />
                            </Button>
                        </View>
                    ))}
                    <Button className="p-2" onPress={() => setEditOwners(true)}>
                        <Text className="font-bold text-xl text-blue-500">Ajouter un responsable</Text>
                    </Button>

                </View>
            </View>

            <View className="my-5">
                <Text className="text-lg capitalize font-bold italic ml-5 dark:text-white">
                    Détails
                </Text>
                <FormTextArea control={control}
                    name="details"
                    rules={{
                        maxLength: 255
                    }} />
            </View>

            <View className="flex-1 mt-5 ">
                <View className="flex flex-row justify-between" >
                    <Text className="text-lg font-bold italic ml-5 dark:text-white">
                        Participants
                    </Text>
                    <Button
                        onPress={() => attendees.forEach((f, index) => update(index, {
                            ...f,
                            checked: true
                        }))}>
                        <Text className="underline text-blue-400 font-bold">Sélectionner tous</Text>
                    </Button>
                </View>
                <View className="flex gap-5 bg-gray-200 rounded-lg py-2">
                    {attendees?.map((attendee, index) => (
                        <Pressable key={attendee._id}
                            className="flex flex-row items-center justify-between px-5"
                            onPressOut={() => {
                                debugger
                                update(index, {
                                ...attendee,
                                checked: !attendee.checked
                            })
                            }}>
                            <View className="flex-row gap-1 items-center">
                                <Avatar src={attendee.avatar} alt={attendee.name.charAt(0)} size2="sm" />
                                <Text className="text-lg font-bold">{attendee.name}</Text>
                            </View>

                            <View className="w-10 h-10">
                                <AnimatedCheckbox checked={attendee.checked}
                                    highlightColor="#4444ff"
                                    checkmarkColor="#483AA0"
                                    boxOutlineColor="#4444ff"
                                />
                            </View>
                        </Pressable>
                    ))}

                </View>
            </View>


            <PickUsersModal open={editOwners}
                onClose={() => setEditOwners(false)}
                users={attendees?.map((u) => ({
                    ...u,
                    checked: owners.map(o => String(o._id)).includes(String(u._id))
                })) || []}
                onClick={(user, index) => {
                    if (user.checked)
                        remove(index);
                    else
                        append(user);
                }} />

            {/* {!!pickDateTime &&

                <DateTimePicker
                    is24Hour
                    testID="dateTimePicker"
                    value={value}
                    mode={mode}
                    display="default"
                    onChange={(event, date) => {
                        if (event.type === "dismissed")
                            handleDismiss()
                        else if (event.type === "set") {
                            handleSet(date);
                            if (mode === "date")
                                setMode("time")
                            else
                                setPickDateTime("")
                        }
                    }}
                    minimumDate={dayjs().subtract(6, "month").toDate()}
                    maximumDate={dayjs().add(6, "month").toDate()}
                />
            } */}
        </View>
    )
}