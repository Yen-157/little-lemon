import * as React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from './Onboarding';
import SplashScreen from './SplashScreen';
import Profile from './Profile';
import HomeScreen from './Home';


const Stack = createNativeStackNavigator();

function Index() {
  return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
  );
}

export default Index;