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

    async function changeLanguage(language: string): Promise<void>{
        await languageHook.changeLanguage(language);
    }

    if (elHook) {
        return (
            <Fragment>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={homeStyle.default}>
                        {languageHook.text?.menu?.home}
                    </Text>
                    <View>
                        <Button title='Vietnamese' onPress={() => changeLanguage(LanguageCode.VI)}></Button>
                        <Button title='English' onPress={() => changeLanguage(LanguageCode.EN)}></Button>
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
