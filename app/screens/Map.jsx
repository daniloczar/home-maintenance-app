import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useState } from "react";
import services from "../../assets/data/servcies.json";
import CustomMarker from "../components/CustomMarker";
import MapServiceCard from "../components/MapServiceCard";

const Map = () => {
  const [selectedService, setSelectedService] = useState(null);
  return (
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
  );
};

export default Map;

const styles = StyleSheet.create({
  container: { paddingTop: 40 },
  map: { width: "100%", height: "100%" },
});
