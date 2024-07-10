import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MyStuff from "../screens/MyStuff";
import Chats from "../screens/Chats";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import MainScreen from "../screens/MainScreen";
import Header from "../screens/Header";

const Tab = createBottomTabNavigator();
export default function NavBar() {
  return (
    <>
      <Header />
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Jobs"
          component={MainScreen}
          options={{
            tabBarLabel: ({ color }) => (
              <Text
                style={{
                  color: color,
                  fontSize: 12,
                }}
              >
                Jobs
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <Image
                tintColor={color}
                source={require("../../assets/Images/drilling-machine.png")}
                style={{ width: 25, height: 25 }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="MyStuff"
          component={MyStuff}
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={{ color: color, fontSize: 12 }}>My Stuff</Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="toolbox-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Chats"
          component={Chats}
          options={{
            tabBarLabel: ({ color }) => <Text style={{ color: color, fontSize: 12 }}>Chats</Text>,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="message-text-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({});
