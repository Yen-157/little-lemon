import { Image, StyleSheet, Text, TextInput, Button, View } from 'react-native';
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
    // Inputs are valid
    return true;
  };
  // Proceed with your submission logic here
  const handleSubmit = async() => {
    if (validateInput()) {
      await AsyncStorage.setItem('firstname', firstName);
      await AsyncStorage.setItem('email', email);
      alert("Form submitted successfully!");
    }
  };
  return(
  <>
    <View style={styles.logopicture}>
      <Image style={styles.logo} source={require('../assets/images/Logo.png')}/>
    </View>
    <View style={styles.body}>
      <Text style={styles.text1}> Let us get to know you </Text>
      <Text style={styles.text1}> First Name </Text>
      <TextInput
        style={styles.text2}
        value={firstName}
        onChangeText={onChangeFirstName}
        placeholder={'first name'}
      />
      <Text style={styles.text1}> Email </Text>
      <TextInput
        style={styles.text2}
        value={email}
        onChangeText={onChangeEmail}
        placeholder={'email'}
        keyboardType={'email-address'}
      />
    </View>
    <View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        style={styles.buttonStyle}
        title ="Next"
        onPress={() => {
          handleSubmit();
          navigation.navigate('Profile');
        }}
      >
      </Button>
    </View>

  </>
)}

const styles = StyleSheet.create({
  logopicture: {
  },
  logo: {
    alignSelf: 'center',
    margin: 20,
  },
  body: {
    backgroundColor: "#A6A3A3"
  },
  text1: {},
  text2: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 13,
    borderColor: '#EDEFEE',
    backgroundColor: '#EDEFEE',
  },
  buttonStyle:{
    fontSize: 16,
    color: 'white',
    backgroundColor: 'green',
    padding: 5,
    marginTop: 32,
    minWidth: 50,
    marginBottom: 16,
  },
});