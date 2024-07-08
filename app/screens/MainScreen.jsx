import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import JobPage from "../screens/JobPage";
import Map from "../screens/Map";
import Profile from "./Profile";
import JobCardHH from "./cards/JobCardHH";
import JobCardSP from "./cards/JobCardHH";
import ProviderCardHH from "./cards/ProviderCardHH";
import ProviderCardSP from "./cards/ProviderCardSP";
import JobPost from "./JobPost";
import Message from "./Message";
import Messages from "./Messages";
import MyStuff from "./MyStuff";

const Stack = createStackNavigator();

const MainScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobsPage" component={JobPage} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="JobCardHH" component={JobCardHH} />
      <Stack.Screen name="JobCardSP" component={JobCardSP} />
      <Stack.Screen name="ProviderCardHH" component={ProviderCardHH} />
      <Stack.Screen name="ProviderCardSP" component={ProviderCardSP} />
      <Stack.Screen name="MyStuff" component={MyStuff} />
      <Stack.Screen name="Message" component={Message} />
      <Stack.Screen name="Messages" component={Messages} />
      <Stack.Screen name="JobPost" component={JobPost} />
    </Stack.Navigator>
  );
};

export default MainScreen;

const styles = StyleSheet.create({});
