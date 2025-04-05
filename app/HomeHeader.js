import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      const storedImage = await AsyncStorage.getItem('profileImage');
      if (storedImage) {
        setImage(storedImage);
      }
    };

    loadImage();
  }, []);

  const getInitials = () => {
    return "AB";
  };

  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/Logo.png')} style={styles.logo} />
      </View>
      <View style={styles.profileContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.initials}>{getInitials()}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    maxHeight: 70
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    height: 80,
    resizeMode: 'contain',
  },
  profileContainer: {
    alignItems: 'flex-end',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: 'white',
    fontSize: 16,
  },
});