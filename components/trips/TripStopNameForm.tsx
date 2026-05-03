import { TripStop } from '@/types/models';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { FormText } from '../form/FormText';
import { Button } from '../ui/Button';



interface TripStopNameFormProps {
    onSubmit: (data: TripStop) => Promise<void>;
    onCancel: () => void;
    tripStop?: TripStop;
}

export default function TripStopNameForm({
    onSubmit,
    onCancel,
    tripStop,
}: TripStopNameFormProps) {
    const { control, handleSubmit, reset, formState: { isSubmitSuccessful } } = useForm<TripStop>({
        defaultValues: {
            name: ""
        }
    });

    useEffect(() => {
        if (tripStop)
            reset(tripStop);
    }, [tripStop, reset]);


    useEffect(() => {
        if (isSubmitSuccessful)
            reset({
                name: ""
            });
    }, [isSubmitSuccessful, reset])



    return (
        <View className="w-full">
            <View className='mb-4'>
                <Text className='dark:text-white font-bold text-lg'>
                    {tripStop ? "Modifier" : "Ajouter"} une étape
                </Text>
            </View>
            <View>
                <Text className='font-bold ml-2 dark:text-white text-sm'>
                    Nom de l'étape*
                </Text>
                <FormText
                    control={control}
                    name="name"
                    placeholder="Saisis un nom d'étape (ex: Paris)"
                    rules={{
                        required: true
                    }}
                />
            </View>
            <View className="flex-row justify-around mt-4">
                <Button
                    variant="outlined"
                    onPress={onCancel}
                    title='Annuler'
                />
                <Button
                    variant="contained"
                    onPress={handleSubmit(onSubmit)}
                    title={tripStop ? "Modifier" : "Ajouter"}
                />
            </View>
        </View>
    );
}
