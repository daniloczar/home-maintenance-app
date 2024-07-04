import React, { useContext, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View, Modal } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import styles from "./styles/RegistrationScreenStyles";
import { app } from "../../../FirebaseConfig";
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { UserContext } from "../../contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegistrationScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [telephone, setTelephone] = useState();
  const [address, setAddress] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [town, setTown] = useState("");
  const [postcode, setPostcode] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const onFooterLinkPress = () => {
    navigation.navigate("Login");
  };

  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    const auth = getAuth(app);
    const db = getFirestore(app);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (response) => {
        userID = response.user.uid;
        const newUser = {
          user_id: userID,
          user_type: userType,
          email,
          full_name: fullName,
          telephone,
          street_name: address,
          house_number: houseNumber,
          town,
          postcode,
          timestamp: serverTimestamp(),
          user_img_url: "",
        };
        const users = collection(db, "users");
        await addDoc(users, data);
        await AsyncStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        navigation.navigate("Home");
        console.log("SIGN UP USER");
      })
      .catch((error) => {
        alert("Email already in use");
        console.log("ERROR", error);
      });
  };

  return (
    <View style={styles.container}>
      <Modal visible={isModalVisible}>
        <View style={styles.container}>
          <KeyboardAwareScrollView
            style={{ flex: 1, width: "100%" }}
            keyboardShouldPersistTaps="always"
          >
            <Image style={styles.logo} source={require("../../../assets/Images/logo.png")} />
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                style={styles.buttonChoice}
                onPress={() => {
                  setUserType("householder");
                }}
              >
                <Text style={styles.buttonTitle}>Householder</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonChoice}
                onPress={() => {
                  setUserType("service");
                }}
              >
                <Text style={styles.buttonTitle}>Service</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Telephone number"
              placeholderTextColor="#aaaaaa"
              keyboardType="numeric"
              onChangeText={(text) => setTelephone(text)}
              value={telephone}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Street"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setAddress(text)}
              value={address}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#aaaaaa"
              placeholder="House number"
              onChangeText={(text) => setHouseNumber(text)}
              value={houseNumber}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#aaaaaa"
              placeholder="Town"
              onChangeText={(text) => setTown(text)}
              value={town}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#aaaaaa"
              placeholder="Postcode"
              onChangeText={(text) => setPostcode(text)}
              value={postcode}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.buttonFinal} onPress={() => onRegisterPress()}>
              <Text style={styles.buttonTitle}>Complete registration</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Image style={styles.logo} source={require("../../../assets/Images/logo.png")} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={() => handleModal()}>
          <Text style={styles.buttonTitle}>Next</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Already got an account?
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
