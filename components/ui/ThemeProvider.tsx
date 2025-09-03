import { themes } from '@/constants/Colors';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';



export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

    const { colorScheme = "light" } = useColorScheme();


    return (
        // <View style={themes[colorScheme]} className='flex flex-grow'>
        <View style={themes[colorScheme]} className='flex flex-grow'>
            {children}
        </View>
    )
}
