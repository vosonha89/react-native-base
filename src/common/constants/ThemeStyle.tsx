import { StyleSheet } from 'react-native';

/**
 * Default value for themestyle
 */
export class ThemeStyleValues {
    public static readonly DefaultFont = 'Montserrat-VariableFont_wght';
    public static readonly DefaultColor = '#170206';
    public static readonly DefaultTextSize = 16;
    public static readonly DefaultTextWeight = 500;
}

/**
 * Default style for application
 */
export function ThemeStyle() {
    return StyleSheet.create({
        defaultFont: {
            fontFamily: ThemeStyleValues.DefaultFont
        },
        defaultColor: {
            color: ThemeStyleValues.DefaultColor
        },
        defaultTextSize: {
            fontSize: ThemeStyleValues.DefaultTextSize
        },
        defaultTextWeight: {
            fontWeight: ThemeStyleValues.DefaultTextWeight
        },
        defaultSystem: {
            fontFamily: ThemeStyleValues.DefaultFont,
            color: ThemeStyleValues.DefaultColor,
            fontSize: ThemeStyleValues.DefaultTextSize,
            fontWeight: ThemeStyleValues.DefaultTextWeight
        }
    });
};