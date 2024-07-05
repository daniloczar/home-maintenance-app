import { StyleSheet, Text, View } from "react-native";
import { Marker } from "react-native-maps";
import React from "react";

const CustomMarker = ({ service, onPress }) => {
  return (
    <View>
      <Marker
        onPress={onPress}
        key={service.id}
        coordinate={{ latitude: service.latitude, longitude: service.longitude }}
        description={service.description}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 3,
            paddingHorizontal: 5,
            borderRadius: 20,
          }}
        >
          <Text>{service.title}</Text>
        </View>
      </Marker>
    </View>
  );
};

export default CustomMarker;

const styles = StyleSheet.create({});
