import { StyleSheet, useColorScheme } from "react-native";
import { ThemeStyle } from './src/common/constants/ThemeStyle';
import { Colors } from "./src/common/constants/Colors";

function AppStyle() {
    const isDarkMode = useColorScheme() === 'dark';

    const extendStyle = StyleSheet.create({
        default: {
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            flex: 1
        },
    });
    return {
        default: StyleSheet.compose(ThemeStyle().defaultSystem, extendStyle.default)
    };
};

export default AppStyle;