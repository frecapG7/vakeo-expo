import { FormSwitch } from "@/components/form/FormSwitch";
import { useWatch } from "react-hook-form";
import { Text, View } from "react-native";
import { RestrictionIcon } from "./RestrictionIcon";


type UserRestrictionsFormProps = {
    control: any;
};

export const UserRestrictionsForm = ({ control }: UserRestrictionsFormProps) => {

    const hasHalal = useWatch({ control, name: "hasHalal", defaultValue: false });
    const hasKasher = useWatch({ control, name: "hasKasher", defaultValue: false });
    const hasNoPork = useWatch({ control, name: "hasNoPork", defaultValue: false });
    const hasNoAlcohol = useWatch({ control, name: "hasNoAlcohol", defaultValue: false });
    const hasVegan = useWatch({ control, name: "hasVegan", defaultValue: false });

    return (
        <View className="gap-4">
            <View className={`flex-row justify-between items-center border-b ${hasHalal ? "border-blue-400" : "border-gray-800 dark:border-gray-400"} pr-10 pb-1`}>
                <View className="flex-row gap-2 items-center">
                    <View className="rounded-full bg-white">
                        <RestrictionIcon value="hasHalal" size="sm" />
                    </View>
                    <Text className="dark:text-white text-lg font-bold">Halal</Text>
                </View>
                <FormSwitch
                    control={control}
                    name="hasHalal"
                />
            </View>

            <View className={`flex-row justify-between items-center border-b ${hasKasher ? "border-blue-400" : "border-gray-800 dark:border-gray-400"} pb-1 pr-10`}>
                <View className="flex-row gap-2 items-center">
                    <View className="rounded-full bg-white">
                        <RestrictionIcon value="hasKasher" size="sm" />
                    </View>
                    <Text className="dark:text-white text-lg font-bold">Kasher</Text>
                </View>
                <FormSwitch
                    control={control}
                    name="hasKasher"
                />
            </View>

            <View className={`flex-row justify-between items-center border-b ${hasNoPork ? "border-blue-400" : "border-gray-800 dark:border-gray-400"} pb-1 pr-10`}>
                <View className="flex-row gap-2 items-center">
                    <View className="rounded-full bg-white">
                        <RestrictionIcon value="hasNoPork" size="sm" />
                    </View>
                    <Text className="dark:text-white text-lg font-bold">Pas de porc</Text>
                </View>
                <FormSwitch
                    control={control}
                    name="hasNoPork"
                />
            </View>

            <View className={`flex-row justify-between items-center border-b ${hasNoAlcohol ? "border-blue-400" : "border-gray-800 dark:border-gray-400"} pb-1 pr-10`}>
                <View className="flex-row gap-2 items-center">
                    <View className="rounded-full bg-white">
                        <RestrictionIcon value="hasNoAlcohol" size="sm" />
                    </View>
                    <Text className="dark:text-white text-lg font-bold">Pas d&apos;alcool</Text>
                </View>
                <FormSwitch
                    control={control}
                    name="hasNoAlcohol"
                />
            </View>

            <View className={`flex-row justify-between items-center border-b ${hasVegan ? "border-blue-400" : "border-gray-800 dark:border-gray-400"} pb-1 pr-10`}>
                <View className="flex-row gap-2 items-center">
                    <View className="rounded-full bg-white">
                        <RestrictionIcon value="hasVegan" size="sm" />
                    </View>
                    <Text className="dark:text-white text-lg font-bold">Végétarien</Text>
                </View>
                <FormSwitch
                    control={control}
                    name="hasVegan"
                />
            </View>
        </View>
    );
};
