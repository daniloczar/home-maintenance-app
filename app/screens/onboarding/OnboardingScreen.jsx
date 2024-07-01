import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";

const OnboardingScreen = () => {
  const onLetsGetStartedPress = () => {};
  return (
    <View style={{ paddingTop: 100 }}>
      <Image style={styles.logo} source={require("../../../assets/logo.png")} />

      <View style={{ paddingTop: 150, paddingLeft: 100, paddingRight: 100 }}>
        <TouchableOpacity style={styles.button} onPress={() => onLetsGetStartedPress()}>
          <Text style={styles.buttonTitle}>Let's get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  logo: {
    height: 250,
    width: 250,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#788eec",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
