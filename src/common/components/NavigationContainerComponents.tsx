import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppRouterStack } from '../../../AppRouters';
import Home from '../../views/home/Home';

/**
 * Navigation container component.
 * Sets up the stack navigator with Home as the initial route.
 * @returns the NavigationContainer JSX element.
 */
export function NavigationContainerComponents(): React.JSX.Element {
  return (
    <NavigationContainer>
      <AppRouterStack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <AppRouterStack.Screen
          name="Home"
          component={Home}
          initialParams={{ needLogin: false }}
        />
      </AppRouterStack.Navigator>
    </NavigationContainer>
  );
}

export default NavigationContainerComponents;
