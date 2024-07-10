import React, { useContext, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View, Modal, Pressable } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import styles from "./styles/RegistrationScreenStyles";
import { app } from "../../../FirebaseConfig";
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { UserContext } from "../../contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { onBackgroundMessage } from "firebase/messaging/sw";

export default function RegistrationScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("householder");
  const [telephone, setTelephone] = useState();
  const [address, setAddress] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [town, setTown] = useState("");
  const [postcode, setPostcode] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setUser } = useContext(UserContext);
  const [houseButton, setHouseButton] = useState(false);
  const [serviceButton, setServiceButton] = useState(false);

  const handleServiceButton = () => {
    setServiceButton(!serviceButton);
    setHouseButton(false);
    setUserType("service");
  };

  const handleHouseButton = () => {
    setHouseButton(!houseButton);
    setServiceButton(false);
    setUserType("householder");
  };

  const clearService = () => {
    setServiceCategory("");
    setServiceTitle("");
    setServiceDescription("");
  };

  clearRegistration = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setUserType("");
    setTelephone("");
    setAddress("");
    setHouseNumber("");
    setTown("");
    setPostcode("");
    clearService();
  };

  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const navigation = useNavigation();
  const onFooterLinkPress = () => {
    clearRegistration();
    navigation.navigate("Login");
  };
  const auth = getAuth(app);
  const db = getFirestore(app);

  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

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
          service_title: serviceTitle,
          service_description: serviceDescription,
          service_category: serviceCategory,
        };
        const users = collection(db, "users");
        await addDoc(users, newUser);
        await AsyncStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        navigation.navigate("JobPage");
        console.log("SIGN UP USER");
      })
      .catch((error) => {
        alert("Email already in use");
        console.log("ERROR", error);
      });
  };
  {
  }
  if (userType === "householder") {
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
                  style={[styles.buttonChoice, houseButton ? styles.selected : null]}
                  onPress={handleHouseButton}
                >
                  <Text style={styles.buttonTitle}>Householder</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.buttonChoice, serviceButton ? styles.selected : null]}
                  onPress={handleServiceButton}
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
            <Text style={styles.footerText}>Already got an account?</Text>
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  } else if (userType === "service") {
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
              <TextInput
                style={styles.input}
                placeholderTextColor="#aaaaaa"
                placeholder="Service provided"
                onChangeText={(text) => setServiceCategory(text)}
                value={serviceCategory}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholderTextColor="#aaaaaa"
                placeholder="Service title"
                onChangeText={(text) => setServiceTitle(text)}
                value={serviceTitle}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholderTextColor="#aaaaaa"
                placeholder="Service description"
                onChangeText={(text) => setServiceDescription(text)}
                value={serviceDescription}
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
            <Text style={styles.footerText}>Already got an account?</Text>
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
