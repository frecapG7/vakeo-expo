import { usePostLinkPreview } from '@/hooks/api/useLinkPreview';
import { isValidUrl } from '@/lib/utils';
import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { Control, useController, useWatch } from 'react-hook-form';
import { Text, View } from 'react-native';
import Animated, { BounceInRight } from 'react-native-reanimated';
import { FormLink } from '../form/FormLink';
import { FormText } from '../form/FormText';
import { FormTextArea } from '../form/FormTextArea';


interface LinkFormProps {
    control: Control
}

export default function LinkForm({
    control
}: LinkFormProps) {

    const postLinkPreview = usePostLinkPreview();
    const url = useWatch({ control, name: "url" });


    const { field: { value: title, onChange: setTitle } } = useController({
        control,
        name: "title"
    });

    const { field: { value: icon, onChange: setIcon } } = useController({
        control,
        name: "icon"
    });

    // Auto-fetch preview when URL changes
    useEffect(() => {
        if (url && isValidUrl(url)) {
            const fetchPreview = async () => {
                try {
                    const response = await postLinkPreview.mutateAsync(url);
                    if (response.success && response.data) {
                        // Auto-fill extracted data
                        setTitle(response.data.title || "");
                        // setValue("description", response.data.description || "");
                        setIcon(response.data.icon || "");
                    }
                } catch (error) {
                    console.error("Failed to fetch link preview:", error);
                }
            };
            const debounceTimer = setTimeout(fetchPreview, 500);
            return () => clearTimeout(debounceTimer);
        }
    }, [url, setIcon, setTitle, postLinkPreview]);



    useEffect(() => {
        if (!url) {
            setIcon("");
            setTitle("");
        }
    }, [url, setIcon, setTitle]);



    return (
        <View className="w-full">

            <View className="gap-4">
                <View className="gap-1">
                    <Text className='font-bold ml-2 dark:text-white text-sm'>
                        URL*
                    </Text>
                    <View className="flex-row items-center gap-2 ">
                        {icon && (
                            <Animated.View entering={BounceInRight} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                <Image source={{ uri: icon }} style={{ width: 28, height: 28 }} contentFit="cover" />
                            </Animated.View>
                        )}
                        <View className="flex-1">
                            <FormLink
                                control={control}
                                name="url"
                                placeholder="https://splitwise.com/..."
                                required
                            />
                        </View>
                    </View>
                </View>

                <View className="gap-1">
                    <Text className='font-bold ml-2 dark:text-white text-sm'>
                        Titre*
                    </Text>
                    <FormText
                        control={control}
                        name="title"
                        placeholder="Splitwise"
                        rules={{
                            required: true
                        }}
                    />
                </View>

                <View className="gap-1">
                    <Text className='font-bold ml-2 dark:text-white text-sm'>
                        Description
                    </Text>
                    <FormTextArea
                        control={control}
                        name="description"
                        placeholder="Description du lien"
                    />
                </View>

            </View>
        </View>
    );
}
