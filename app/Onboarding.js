import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useState } from 'react';
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function OnboardingScreen ({ navigation }){
  const [firstName, onChangeFirstName] = useState('');
  const [email, onChangeEmail] = useState('');
  const [error, setError] = useState("");

  const validateInput = () => {
    // Clear previous errors
    setError("");

    // Validate first name
    const nameRegex = /^[a-zA-Z]+$/;
    if (!firstName) {
      setError("First name cannot be empty.");
      return false;
    } else if (!nameRegex.test(firstName)) {
      setError("First name should contain only string characters.");
      return false;
    }
    // Validate email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email) {
      setError("Email cannot be empty.");
      return false;
    } else if (!emailRegex.test(email)) {
      setError("Invalid email address.");
      return false;
    }
    return true;
  };
  const handleSubmit = async() => {
    if (validateInput()) {
      await AsyncStorage.setItem('firstname', firstName);
      await AsyncStorage.setItem('email', email);
      alert("Form submitted successfully!");
      navigation.navigate('Profile');
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.logopicture}>
          <Image style={styles.logo} source={require('../assets/images/Logo.png')} />
        </View>
        <View style={styles.body}>
          <Text style={styles.text1}>Let us get to know you</Text>
          <Text style={styles.text1}>First Name</Text>
          <TextInput
            style={styles.text2}
            value={firstName}
            onChangeText={onChangeFirstName}
            placeholder={'first name'}
          />
          <Text style={styles.text1}>Email</Text>
          <TextInput
            style={styles.text2}
            value={email}
            onChangeText={onChangeEmail}
            placeholder={'email'}
            keyboardType={'email-address'}
          />
        </View>
        <View style={styles.space} />
        <View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
 }

const styles = StyleSheet.create({
  logopicture: {
    alignItems: 'center',
    marginVertical: 10,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  body: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  text1: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  text2: {
    height: 45,
    borderColor: '#EDEFEE',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  buttonStyle: {
    backgroundColor: '#F4CE14',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    width: 150,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  space: {
    height: 30,
  },
});