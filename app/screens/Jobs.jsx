import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { Button } from "react-native-paper";
import styles from "./auth/styles/RegistrationScreenStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../contexts/UserContext";

const Jobs = ({ navigation }) => {
  const { setUser } = useContext(UserContext);
  const handleLogOut = async () => {
    const killUser = await AsyncStorage.setItem("user", "");
    setUser(null);
    navigation.navigate("Login");
  };
  return (
    <View>
      <TouchableOpacity style={styles.buttonChoice} onPress={handleLogOut}>
        <Text style={styles.buttonTitle}>LogOut</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Jobs;
