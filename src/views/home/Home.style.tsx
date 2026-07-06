import { StyleSheet } from 'react-native';
import { ThemeStyle } from '../../common/constants/ThemeStyle';

const themeStyle = ThemeStyle();
const extendStyle = StyleSheet.create({
  default: {
    // extend here, e.g. padding, margin, alignment
  },
});

/**
 * Module-level style for Home view.
 * Composed once at import time; no per-render allocation.
 */
const HomeStyle = {
  default: StyleSheet.compose(themeStyle.defaultSystem, extendStyle.default),
} as const;

export default HomeStyle;
