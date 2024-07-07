import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useState } from "react";
import services from "../../assets/data/servcies.json";
import CustomMarker from "../components/CustomMarker";
import MapServiceCard from "../components/MapServiceCard";
import { Ionicons } from "@expo/vector-icons";

const Map = ({ navigation }) => {
  const [selectedService, setSelectedService] = useState(null);
  return (
    <View>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 51.509865,
            longitude: -0.118092,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={() => {
            setSelectedService(null);
          }}
        >
          {services.map((service, index) => {
            return (
              <CustomMarker
                key={index}
                service={service}
                onPress={() => {
                  setSelectedService(services[index]);
                }}
              />
            );
          })}
        </MapView>
        {selectedService && <MapServiceCard service={selectedService} />}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backBnt}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-undo-circle" size={28} color="#6759FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {},
  map: {
    height: "100%",
    width: "100%",
  },
  buttonContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    borderWidth: 2,
    borderColor: "#6759FF",
    padding: 5,
    borderRadius: 50,
  },
});
