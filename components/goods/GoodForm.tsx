import { GROCERY_UNITS } from "@/constants/Units";
import { Good } from "@/types/models";
import { Control, useFormState, useWatch } from "react-hook-form";
import { Text, View } from "react-native";
import { FormAutocomplete } from "../form/FormAutocomplete";
import { FormNumberV2 } from "../form/FormNumberV2";
import { FormText } from "../form/FormText";

export const GoodForm = ({ control }: {
    control: Control<Partial<Good>>
}) => {

    const { isSubmitting } = useFormState({ control });
    const unitValue = useWatch({ control, name: 'unit' });
    const quantityValue = useWatch({ control, name: 'quantityNumber' });

    return (
        <View className="gap-4">
            <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom de l&apos;article</Text>
                <FormText
                    control={control}
                    name="name"
                    placeholder="Nom de l&apos;article"
                    rules={{ required: true }}
                    autoFocus
                    disabled={isSubmitting}
                />
            </View>
            <View className="flex-row gap-2">
                <View className="flex-1 gap-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantité</Text>
                    <FormNumberV2
                        control={control}
                        name="quantityNumber"
                        placeholder="0"
                        rules={{
                            validate: (value) => {
                                if (unitValue && (value === undefined || value === null || value === '')) {
                                    return 'Requis si une unité est saisie';
                                }
                                return true;
                            }
                        }}
                    />
                </View>
                <View className="flex-1 gap-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Unité</Text>
                    <FormAutocomplete
                        control={control}
                        name="unit"
                        placeholder="kg, L, etc."
                        suggestions={GROCERY_UNITS}
                        disabled={isSubmitting}
                        rules={{
                            validate: (value) => {
                                if (quantityValue && (value === undefined || value === null || value === '')) {
                                    return 'Requis si une quantité est saisie';
                                }
                                return true;
                            }
                        }}
                    />
                </View>
            </View>
        </View>
    );
}