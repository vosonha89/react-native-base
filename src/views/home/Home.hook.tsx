import { useEffect, useState } from 'react';
import { HomeState } from './Home.state';
// import { NavigationProp, useNavigation } from '@react-navigation/native';
// import { AppRouteParamList } from '../../../AppRouters';

function HomeHook() {
    const [componentState, setComponentState] = useState(new HomeState());
    // const navigation = useNavigation<NavigationProp<AppRouteParamList>>();

    /**
     * Load page
     */
    async function loadPage(): Promise<void> {
        const pageState: HomeState = componentState.copy();
        await pageState.init();
        setComponentState(pageState);
    }

    useEffect(() => {
        // userEffect implement here
        loadPage();
        console.log('Home load');
    }, []);
    return {
        componentState
    };
}

export default HomeHook;