import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import JobPage from "../screens/JobPage";
import Map from "../screens/Map";
import Profile from "./Profile";
import HomeHolder from "../screens/cards/HomeHolder";

const Stack = createStackNavigator();

const MainScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobsPage" component={JobPage} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="HomeHolder" component={HomeHolder} />
    </Stack.Navigator>
  );
};

export default MainScreen;

const styles = StyleSheet.create({});
