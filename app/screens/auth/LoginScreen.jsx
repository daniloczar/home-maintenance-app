import React, { useContext, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./styles/LoginScreenStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "../../../FirebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { UserContext } from "../../contexts/UserContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(UserContext);

  const onFooterLinkPress = () => {
    navigation.navigate("Registration");
  };

  const onLoginPress = () => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    let user_id = "";
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        user_id = userCredential.user.email;
      })
      .catch((error) => {
        alert(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("ERROR", error);
      });
    const userRef = doc(db, "users", user_id);
    const userSnap = getDoc(userRef).then((data) => {
      console.log(data);
      if (userSnap.exists()) {
        const data = response.data();
        console.log(data);
        navigation.navigate("Home", { user: data });
      } else {
        alert("User does not exist anymore.");
      }
    });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <Image style={styles.logo} source={require("../../../assets/Images/logo.png")} />
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
        <TouchableOpacity style={styles.button} onPress={() => onLoginPress()}>
          <Text style={styles.buttonTitle}>Log in</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Don't have an account?
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Sign up
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
