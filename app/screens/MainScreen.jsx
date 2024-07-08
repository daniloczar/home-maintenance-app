import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import JobPage from "../screens/JobPage";
import Map from "../screens/Map";
import Profile from "./Profile";
import HomeHolder from "../screens/cards/HomeHolder";
import Message from "./Message";
import Messages from "./Messages";

const Stack = createStackNavigator();

const MainScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobsPage" component={JobPage} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="HomeHolder" component={HomeHolder} />
      <Stack.Screen name="Message" component={Message} />
      <Stack.Screen name="Messages" component={Messages} />
    </Stack.Navigator>
  );
};

export default MainScreen;

const styles = StyleSheet.create({});
