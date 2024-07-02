import { StyleSheet, Text, View, StatusBar } from "react-native";
import React from "react";
import NavBar from "../Navigations/NavBar";
import Header from "./Header";

const Home = () => {
  return (
    <View style={styles.container}>
      <Header />

      <NavBar />

      <StatusBar style="auto" />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
