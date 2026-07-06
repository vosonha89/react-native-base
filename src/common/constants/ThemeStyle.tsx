import { StyleSheet } from 'react-native';

/**
 * Default values for application theming.
 */
export class ThemeStyleValues {
  /** Default font family used across the app. */
  public static readonly DefaultFont = 'Montserrat-VariableFont_wght';
  /** Default text color. */
  public static readonly DefaultColor = '#170206';
  /** Default font size for body text. */
  public static readonly DefaultTextSize = 16;
  /** Default font weight for body text. */
  public static readonly DefaultTextWeight = 500;
}

/**
 * Default style for application.
 * @returns a StyleSheet object with default system styles.
 */
export function ThemeStyle() {
  return StyleSheet.create({
    defaultFont: {
      fontFamily: ThemeStyleValues.DefaultFont,
    },
    defaultColor: {
      color: ThemeStyleValues.DefaultColor,
    },
    defaultTextSize: {
      fontSize: ThemeStyleValues.DefaultTextSize,
    },
    defaultTextWeight: {
      fontWeight: ThemeStyleValues.DefaultTextWeight,
    },
    defaultSystem: {
      fontFamily: ThemeStyleValues.DefaultFont,
      color: ThemeStyleValues.DefaultColor,
      fontSize: ThemeStyleValues.DefaultTextSize,
      fontWeight: ThemeStyleValues.DefaultTextWeight,
    },
  });
}
