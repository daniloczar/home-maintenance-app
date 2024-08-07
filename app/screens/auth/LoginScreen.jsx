import React, { useContext, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./styles/LoginScreenStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "../../../FirebaseConfig";
import { getFirestore, getDocs, query, collection, where } from "firebase/firestore";
import { UserContext } from "../../contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const navigation = useNavigation();

  const clearLogin = () => {
    setEmail("");
    setPassword("");
  };
  const onFooterLinkPress = () => {
    clearLogin();
    navigation.navigate("Registration");
  };

  const onLoginPress = () => {
    console.log("LOGGED IN USER!!!!!");

    const auth = getAuth(app);
    const db = getFirestore(app);
    signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
      const userID = userCredential.user.uid;

      const getUser = query(collection(db, "users"), where("user_id", "==", userID));
      const querySnap = await getDocs(getUser);

      const userSnap = querySnap.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      await AsyncStorage.setItem("user", JSON.stringify(userSnap[0]));
      setUser(userSnap[0]);
      navigation.navigate("JobPage");
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
          </Text>
             <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Sign up
            </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
