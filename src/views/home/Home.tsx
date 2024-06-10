import React, { Fragment } from 'react';
import HomeHook from './Home.hook';
import HomeStyle from './Home.style';
import { ScrollView, Text } from 'react-native';

function Home(): React.JSX.Element {
    const elHook = HomeHook();
    const homeStyle = HomeStyle();

    if (elHook) {
        return (
            <Fragment>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={homeStyle.default}>Whereas disregard and contempt for human rights have resulted</Text>
                </ScrollView>
            </Fragment>
        );
    } else {
        return (
            <Fragment></Fragment>
        );
    }
}

export default Home;
