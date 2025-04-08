import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Image, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaskedTextInput } from 'react-native-mask-text';
import { CheckBox } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity, GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Profile({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState(null);
  const [notifications, setNotifications] = useState({
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
  });

  useEffect(() => {
    const loadUserData = async () => {
      const storedFirstName = await AsyncStorage.getItem('firstname');
      const storedLastName = await AsyncStorage.getItem('lastname');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      const storedImage = await AsyncStorage.getItem('profileImage');
      const storedNotifications = await AsyncStorage.getItem('notifications');

      if (storedFirstName) setFirstName(storedFirstName);
      if (storedLastName) setLastName(storedLastName);
      if (storedEmail) setEmail(storedEmail);
      if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
      if (storedImage) setImage(storedImage);
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
    };

    loadUserData();
  }, []);

  // Save user data to AsyncStorage
  const saveUserData = async () => {
    await AsyncStorage.setItem('firstname', firstName);
    await AsyncStorage.setItem('lastname', lastName);
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('phoneNumber', phoneNumber);
    await AsyncStorage.setItem('profileImage', image || '');
    await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
  };

  const handleCheckboxChange = (key) => {
    setNotifications((prevState) => {
      const updatedNotifications = { ...prevState, [key]: !prevState[key] };
      AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications)); // Save immediately
      return updatedNotifications;
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      await AsyncStorage.setItem('profileImage', imageUri);
    }
  };

  const removeImage = async () => {
    setImage(null);
    await AsyncStorage.removeItem('profileImage');
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
          <Text style={styles.sectionTitle}>Personal information</Text>
        </View>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.initials}>{getInitials()}</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <Button title="Change" onPress={pickImage} />
            <View style={styles.buttonSpace} />
            <Button title="Remove" onPress={removeImage} />
          </View>
        </View>
        <Text style={styles.name}>First Name</Text>
        <TextInput
          style={styles.textInput}
          value={firstName}
          onChangeText={setFirstName}
          onBlur={saveUserData}
        />
        <Text style={styles.name}>Last Name</Text>
        <TextInput
          style={styles.textInput}
          value={lastName}
          value={lastName}
          onChangeText={(text) => setLastName(text)}
          onBlur={saveUserData}
        />
        <Text style={styles.name}>Email</Text>
        <TextInput
          style={styles.textInput}
          value={email}
          onChangeText={(text) => setEmail(text)}
          onBlur={saveUserData}
        />
        <Text style={styles.name}>Phone Number</Text>
        <MaskedTextInput
          style={styles.textInput}
          mask="(999) 999-9999"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          keyboardType="numeric"
          onBlur={saveUserData}
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
        <Button title="Save Changes" onPress={saveUserData} />
        <View style={styles.space} />
        <Button title="Logout" onPress={handleLogout} />
        <View style={styles.space} />
        <Button title="Go to Menu" onPress={() => navigation.navigate('Home')} />
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 16,
  },
  buttonSpace: {
    width: 16,
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
  space: {
    height: 16,
  },
  horizontalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  horizontalButton: {
    flex: 1,
    padding: 10,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
  },
});