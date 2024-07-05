import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";

const MapServiceCard = ({ service }) => {
  return (
    <View style={[styles.card, styles.shadowProp, styles.elevation]}>
      <Image style={styles.image} source={require("../../assets/Images/plumberCartoon.png")} />
      <View style={styles.rightContainer}>
        <Text style={styles.title}>{service.title}</Text>
        <Text style={styles.description}>{service.description}</Text>
        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => onLoginPress()}>
              <Text style={styles.buttonTitle}>Book now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rating}>
            <Text>★{service.numberOfStars}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MapServiceCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    position: "absolute",
    bottom: 50,
    left: 10,
    right: 10,
    overflow: "hidden",
  },
  rightContainer: { flex: 1, paddingTop: 5, paddingLeft: 5 },
  title: {
    fontSize: 18,
    marginBottom: 2,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  description: { color: "gray" },
  image: {
    width: 100,
    height: 100,
  },
  rating: { alignSelf: "flex-end", margin: 3 },
  buttonContainer: {
    alignSelf: "flex-start",
  },
  button: {
    backgroundColor: "#6759FF",
    height: 30,
    width: 100,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  elevation: {
    elevation: 20,
    shadowColor: "#52006A",
  },
});