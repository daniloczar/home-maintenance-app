import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import JobPage from "../screens/JobPage";
import Map from "../screens/Map";
import Profile from "./Profile";
import JobCardHH from "./cards/JobCardHH";
import JobCardSPJobs from "./cards/JobCardSPJobs";
import JobCardSPMyStuff from "./cards/JobCardSPMyStuff";
import ProviderCardHH from "./cards/ProviderCardHH";
import ProviderCardSP from "./cards/ProviderCardSP";
import JobPost from "./JobPost";
import Chats from "./Chats";
import Messages from "./Messages";
import MyStuff from "./MyStuff";

const Stack = createStackNavigator();

const MainScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobPage" component={JobPage} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ProviderCardHH" component={ProviderCardHH} />
    </Stack.Navigator>
  );
};

export default MainScreen;

const styles = StyleSheet.create({});
