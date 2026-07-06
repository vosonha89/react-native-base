import 'reflect-metadata';
import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigationContainerComponents from './src/common/components/NavigationContainerComponents';
import AppStyle from './App.style';
import LanguageHook from './src/common/hook/LanguageHook';

/**
 * Root application component.
 * Sets up theme, language, and navigation.
 * @returns the root JSX element.
 */
export function App(): React.JSX.Element {
  const languageHook = LanguageHook();
  const [isReady, setIsReady] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const appStyle = AppStyle();
  const statusbarColor = {
    backgroundColor: isDarkMode ? '#FFF' : '#000',
  };

  /**
   * Initialize language and mark app as ready.
   */
  async function init(): Promise<void> {
    await languageHook.languageService.initLanguage();
    setIsReady(true);
  }

  useEffect(() => {
    // userEffect implement here
    init();
  }, []);

  if (isReady) {
    return (
      <SafeAreaView style={appStyle.default}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={statusbarColor.backgroundColor}
        />
        <NavigationContainerComponents />
      </SafeAreaView>
    );
  } else {
    return <SafeAreaView></SafeAreaView>;
  }
}

export default App;
