import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import MyStuffHouseholder from "./MyStuffHouseholder";
import MyStuffServiceProvider from "./MyStuffHouseholder";
import { UserContext } from "../contexts/UserContext";

const MyStuff = () => {
  const {user} = useContext(UserContext);

  if (user.user_type === "Householder") {
  return (
    <View style={{ height: "100%" }}>
      <MyStuffHouseholder />
    </View>
  )} else return (
    <View style={{ height: "100%" }}>
      <MyStuffServiceProvider />
    </View>
  ); 
};

export default MyStuff;

const styles = StyleSheet.create({});
