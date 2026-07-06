import { StyleSheet, useColorScheme } from 'react-native';
import { ThemeStyle } from './src/common/constants/ThemeStyle';
import { Colors } from './src/common/constants/Colors';

/**
 * Application-level dynamic styles.
 * Uses color scheme to toggle between light and dark backgrounds.
 * @returns composed default style object.
 */
export function AppStyle() {
  const isDarkMode = useColorScheme() === 'dark';

  const extendStyle = StyleSheet.create({
    default: {
      backgroundColor: isDarkMode ? Colors.black : Colors.white,
      flex: 1,
    },
  });
  return {
    default: StyleSheet.compose(
      ThemeStyle().defaultSystem,
      extendStyle.default,
    ),
  };
}

export default AppStyle;
