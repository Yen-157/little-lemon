import { Image, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SplashScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      const firstName = await AsyncStorage.getItem('firstname');
      const email = await AsyncStorage.getItem('email');

      if (onboardingCompleted === 'true' && firstName && email) {
        navigation.replace('Profile');
      } else {
        navigation.replace('Onboarding');
      }
    };

    // Display the logo for 3 seconds
    setTimeout(() => {
      setIsLoading(false);
      checkOnboardingStatus();
    }, 3000);
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={styles.logopic}>
        <Image style={styles.logo1} source={require('../assets/images/Logo.png')} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  logopic: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo1: {
    height: 50,
  },
});

export default SplashScreen;