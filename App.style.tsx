import { StyleSheet, useColorScheme } from "react-native";
import { ThemeStyle } from './src/common/constants/ThemeStyle';
import { Colors } from 'react-native/Libraries/NewAppScreen';

function AppStyle() {
    const isDarkMode = useColorScheme() === 'dark';

    const extendStyle = StyleSheet.create({
        default: {
            backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
            flex: 1
        },
    });
    return {
        default: StyleSheet.compose(ThemeStyle().defaultSystem, extendStyle.default)
    };
};

export default AppStyle;