import { StyleSheet } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Chats from "./Chats";
import Messages from "./Messages";
const Stack = createStackNavigator();
export default function ChatScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="Messages" component={Messages} />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({});
