import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export class AppScreenProps {
    public needLogin: boolean = false;
}

export type AppSreenStackParamList = {
    Home: AppScreenProps;
};

export type AppRouteParamList = {
    Home: 'Home';
};

export type AppHomeScreenProps = NativeStackScreenProps<AppSreenStackParamList, AppRouteParamList['Home']>;

export const AppRouterStack = createNativeStackNavigator<AppSreenStackParamList>();