import { StyleSheet, Text, View, StatusBar } from "react-native";
import React, { useContext } from "react";
import NavBar from "../Navigations/NavBar";
import Header from "./Header";
import { UserContext } from "../contexts/UserContext";

const Home = ({ route}) => {
  const { user } = useContext(UserContext);
  return (
    <View style={styles.container}>
      <Header/>
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
