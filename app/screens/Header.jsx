import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from '../Util/Colors';
import { FontAwesome } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";


export default function Header() {
  return (
    <SafeAreaView >
      <View style={styles.container}>
        <View style={styles.profileMainContainer}>
          <View style={styles.profileContainer}>
            <FontAwesome6 name="house-chimney-crack" size={24} color="white" />
          </View>
            <View>
              <Text style={{ color: Colors.white, fontSize:20, fontWeight:'700' }}>Home Maintenance</Text>
            </View>
            <FontAwesome name="user-circle-o" size={28} color={"white"} />
        </View>
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder="Search"
            placeholderTextColor="#909090"
            style={styles.searchBar}
          />
          <View style={styles.searchButtonContainer}>
            <FontAwesome name="search" size={21} color="white" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileMainContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchBarContainer: {
    marginTop: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  searchBar: {
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    width: "85%",
  },
  searchButtonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 33,
    height: 33,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.white,
  },
});