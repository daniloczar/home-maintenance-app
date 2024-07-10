import { StyleSheet } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyStuff from "./MyStuff";
import JobCardSPMyStuff from "./cards/JobCardSPMyStuff";
import ProviderCardSP from "./cards/ProviderCardSP";
import JobPost from "./JobPost";
import JobCardHH from "./cards/JobCardHH";
const Stack = createStackNavigator();
export default function MyStuffsScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyStuff" component={MyStuff} />
      <Stack.Screen name="JobCardSPMyStuff" component={JobCardSPMyStuff} />
      <Stack.Screen name="ProviderCardSP" component={ProviderCardSP} />
      <Stack.Screen name="JobPost" component={JobPost} />
      <Stack.Screen name="JobCardHH" component={JobCardHH} />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({});
