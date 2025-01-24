import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Image, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaskedTextInput } from 'react-native-mask-text';
import { CheckBox } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity, GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Profile({
                                  initialFirstName = '',
                                  initialLastName = '',
                                  initialEmail = '',
                                  initialPhoneNumber = '',
                                  initialNotifications = {
                                    orderStatuses: false,
                                    passwordChanges: false,
                                    specialOffers: false,
                                    newsletter: false,
                                  },
                                  navigation,
                                }) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, onChangeLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [image, setImage] = useState(null);
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    const getUserData = async () => {
      const storedFirstName = await AsyncStorage.getItem('firstname');
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedFirstName) {
        setFirstName(storedFirstName);
      }
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };

    getUserData();
  }, []);

  const handleCheckboxChange = (key) => {
    setNotifications((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Onboarding');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View>
          <Text>Personal information</Text>
        </View>
        <View>
          <TouchableOpacity onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.initials}>{getInitials()}</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.name}>First Name</Text>
          <TextInput
            style={styles.textInput}
            value={firstName}
            onChangeText={setFirstName}
          />
          <Text style={styles.name}>Last Name</Text>
          <TextInput
            style={styles.textInput}
            value={lastName}
            onChangeText={onChangeLastName}
          />
          <Text style={styles.name}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.name}>Phone Number</Text>
          <MaskedTextInput
            style={styles.textInput}
            mask="(999) 999-9999"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="numeric"
          />
          <Text style={styles.name}>Email Notifications</Text>
          <CheckBox
            title="Order statuses"
            checked={notifications.orderStatuses}
            onPress={() => handleCheckboxChange('orderStatuses')}
          />
          <CheckBox
            title="Password changes"
            checked={notifications.passwordChanges}
            onPress={() => handleCheckboxChange('passwordChanges')}
          />
          <CheckBox
            title="Special offers"
            checked={notifications.specialOffers}
            onPress={() => handleCheckboxChange('specialOffers')}
          />
          <CheckBox
            title="Newsletter"
            checked={notifications.newsletter}
            onPress={() => handleCheckboxChange('newsletter')}
          />
          <Button title="Logout" onPress={handleLogout} />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  name: {
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  initials: {
    color: 'white',
    fontSize: 32,
  },
});