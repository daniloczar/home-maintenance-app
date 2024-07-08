import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import MyStuffHouseholder from "./MyStuffHouseholder";
import MyStuffServiceProvider from "./MyStuffServiceProvider";
import { UserContext } from "../contexts/UserContext";

const MyStuff = () => {
  const {user} = useContext(UserContext);
  if (user.user_type === "householder") {
    return (
      <View style={{ height: "100%" }}>
        <MyStuffHouseholder />
      </View>
    )
  } 
  else if(user.user_type==='service_provider'){ 
    return (
      <View style={{ height: "100%" }}>
        <MyStuffServiceProvider />
      </View>
    )
  }; 
};

export default MyStuff;

const styles = StyleSheet.create({});
