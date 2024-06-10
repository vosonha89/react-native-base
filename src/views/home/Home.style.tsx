import { StyleSheet } from "react-native";
import { ThemeStyle } from '../../common/constants/ThemeStyle';

function HomeStyle() {
    const extendStyle = StyleSheet.create({
        default: {
        },
    });
    return {
        default: StyleSheet.compose(ThemeStyle().defaultSystem, extendStyle.default)
    };
};

export default HomeStyle;