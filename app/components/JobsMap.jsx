import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React from "react";
import services from "../../assets/data/servcies.json";

const JobsMap = () => {
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
      >
        {services.map((service) => {
          return (
            <Marker
              key={service.id}
              coordinate={{ latitude: service.latitude, longitude: service.longitude }}
              title={service.title}
              description={service.description}
            />
          );
        })}
      </MapView>
    </View>
  );
};

export default JobsMap;

const styles = StyleSheet.create({
  container: { paddingTop: 40 },
  map: { width: "100%", height: "100%" },
});
