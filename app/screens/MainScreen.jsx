import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import JobPage from "../screens/JobPage";
import Map from "../screens/Map";
import Profile from "./Profile";

import ProviderCardHH from "./cards/ProviderCardHH";
import JobCardSPJobs from "./cards/JobCardSPJobs";


const Stack = createStackNavigator();

const MainScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobPage" component={JobPage} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ProviderCardHH" component={ProviderCardHH} />
      <Stack.Screen name="JobCardSPJobs" component={JobCardSPJobs} />
    </Stack.Navigator>
  );
};

export default MainScreen;

const styles = StyleSheet.create({});
