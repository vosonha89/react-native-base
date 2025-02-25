import { StyleSheet } from 'react-native';
import { Colors } from './Colors';
import { BorderRadius } from './BorderRadius';
import { FontSizes, FontWeights } from './Fonts';

export default StyleSheet.create({
    fill: {
        flex: 1,
    },
    container: {
        flex: 1,
        flexGrow: 1,
        position: 'relative',
        backgroundColor: Colors.white
    },
    //textInput oneLine
    textInput: {
        borderRadius: BorderRadius.br12,
        borderStyle: 'solid',
        borderColor: Colors.darkGray,
        borderWidth: 1,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        paddingHorizontal: 16,
        color: Colors.neutral800,
    },
    //textInput multiLine
    textInputMultiline: {
        borderRadius: BorderRadius.br12,
        borderStyle: 'solid',
        borderColor: Colors.neutral200 as string,
        borderWidth: 1,
        height: 98,
        display: 'flex',
        paddingHorizontal: 16,
        color: Colors.neutral800 as string,
    },
    // button style
    primaryBtn: {
        borderRadius: BorderRadius.br12,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: Colors.primary600,
    },
    primaryTextBtn: {
        color: Colors.white as string,
        fontSize: FontSizes.s16,
        fontWeight: FontWeights.w700,
    },
    secondaryBtn: {
        borderRadius: BorderRadius.br12,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: Colors.primary50 as string,
    },
    thirdBtn: {
        borderRadius: BorderRadius.br12,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: Colors.primary50 as string,
    },
    thirdTextBtn: {
        color: Colors.skyBlue as string,
        fontSize: FontSizes.s16,
        fontWeight: FontWeights.w700,
    },
    disableBtn: {
        backgroundColor: Colors.neutral100 as string,
    },
    disableTextBtn: {
        color: Colors.neutral500 as string
    },
    errorText: {
        fontSize: FontSizes.s12,
        color: Colors.red as string,
    },
    defaultImgStyle: {
        width: '100%',
        height: '100%'
    },
    //padding
    p16: {
        padding: 16,
    },
    p32: {
        padding: 32,
    },
    //margin
    mTop16: {
        marginTop: 16,
    },
    mTop32: {
        marginTop: 32,
    },
    mBottom16: {
        marginBottom: 16,
    },
    mBottom32: {
        marginBottom: 32,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
    },
    centerRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    centerCol: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
});