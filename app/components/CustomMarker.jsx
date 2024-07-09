import { StyleSheet, Text, View } from "react-native";
import { Marker } from "react-native-maps";
import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const CustomMarker = ({ serviceProvider, jobProvider, onPress }) => {
  const { user } = useContext(UserContext);
  if (user.user_type === "service_provider") {
    !jobProvider.longitude ? (jobProvider.longitude = -0.127726) : null;
    !jobProvider.latitude ? (jobProvider.latitude = 51.5034) : null;
  } else {
    !serviceProvider.longitude ? (serviceProvider.longitude = -0.127726) : null;
    !serviceProvider.latitude ? (serviceProvider.latitude = 51.5034) : null;
  }

  if (user.user_type === "householder") {
    return (
      <View>
        <Marker
          onPress={onPress}
          key={serviceProvider.id}
          coordinate={{ latitude: serviceProvider.latitude, longitude: serviceProvider.longitude }}
          description={serviceProvider.service_description}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 3,
              paddingHorizontal: 5,
              borderRadius: 20,
              shadowColor: "#171717",
              shadowOffset: { width: -2, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 20,
              shadowColor: "#52006A",
            }}
          >
            <Text>{serviceProvider.service_title}</Text>
          </View>
        </Marker>
      </View>
    );
  } else {
    return (
      <View>
        <Marker
          onPress={onPress}
          key={jobProvider.id}
          coordinate={{ latitude: jobProvider.latitude, longitude: jobProvider.longitude }}
          description={jobProvider.job_description}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 3,
              paddingHorizontal: 5,
              borderRadius: 20,
              shadowColor: "#171717",
              shadowOffset: { width: -2, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 20,
              shadowColor: "#52006A",
            }}
          >
            <Text>{jobProvider.job_title}</Text>
          </View>
        </Marker>
      </View>
    );
  }
};

export default CustomMarker;

const styles = StyleSheet.create({});
