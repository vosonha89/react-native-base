import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import NavigationContainerComponents from './src/common/components/NavigationContainerComponents';
import AppStyle from './App.style';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  
  const appStyle = AppStyle();
  const statusbarColor = {
    backgroundColor: isDarkMode ? Colors.light : Colors.dark
  };
  console.log(Colors.light);

  useEffect(() => {
    // userEffect implement here
  }, []);

  return (
    <SafeAreaView style={appStyle.default}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={statusbarColor.backgroundColor}
      />
      <NavigationContainerComponents />
    </SafeAreaView>
  );
}

export default App;
