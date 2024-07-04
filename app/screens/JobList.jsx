import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Foundation } from "@expo/vector-icons";

const JobList = ({item}) => {
  return (
    <View style={styles.container}>
      <Image source={item.src} style={styles.ImagesProviders} />
      <Text style={{ fontSize: 14, fontWeight: "bold", marginLeft: 5 }}>
        {item.name}
      </Text>
      <Text style={{ fontSize: 12, marginLeft: 5, marginBottom:5, }}>{item.title}</Text>
      <View style={styles.ratingButton}>
        <View style={styles.ratingButton}>
          <Foundation name="star" size={10} color="#336aea" />
          <Text style={{ fontSize: 10, color: "#336aea" }}>{item.rating}</Text>
        </View>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={{ fontSize: 12, color: "white", textAlign: "center" }}>
            Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JobList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    margin: 5,
  },
  ImagesProviders: {
    width: 110,
    height: 90,
    margin: 5,
    backgroundColor: "white",
    borderRadius: 5,
  },
  ratingButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
    marginLeft:4,
  },
  detailsButton: {
    backgroundColor: "#336aea",
    padding: 2,
    width: 60,
    borderRadius: 5,
    marginRight:4,
    marginBottom:7
  },
});
