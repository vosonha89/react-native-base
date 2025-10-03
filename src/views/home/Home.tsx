import React, { Fragment } from 'react';
import HomeHook from './Home.hook';
import HomeStyle from './Home.style';
import { Button, ScrollView, Text, View } from 'react-native';
import LanguageHook from '../../common/hook/LanguageHook';
import { LanguageCode } from 'one-frontend-framework';

function Home(): React.JSX.Element {
    const languageHook = LanguageHook();
    const elHook = HomeHook();
    const homeStyle = HomeStyle();

    if (elHook) {
        return (
            <Fragment>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={homeStyle.default}>
                        {languageHook.text?.menu?.home}
                    </Text>
                    <View>
                        <Button title='Vietnamese' onPress={() => languageHook.changeLanguage(LanguageCode.VI)}></Button>
                        <Button title='English' onPress={() => languageHook.changeLanguage(LanguageCode.EN)}></Button>
                    </View>
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
