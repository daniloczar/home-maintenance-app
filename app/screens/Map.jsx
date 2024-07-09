import { StyleSheet, View, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import React, { useContext, useState } from "react";

import CustomMarker from "../components/CustomMarker";
import MapServiceCard from "../components/MapServiceCard";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../contexts/UserContext";

const Map = ({ navigation, route }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const { allServicesProviders, allJobsProviders } = route.params;
  const { user } = useContext(UserContext);

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
            setSelectedJob(null);
          }}
        >
          {user.user_type === "service_provider"
            ? allJobsProviders.map((jobProvider, index) => {
                return (
                  <CustomMarker
                    key={index}
                    jobProvider={jobProvider}
                    onPress={() => {
                      setSelectedJob(allJobsProviders[index]);
                    }}
                  />
                );
              })
            : allServicesProviders.map((serviceProvider, index) => {
                return (
                  <CustomMarker
                    key={index}
                    serviceProvider={serviceProvider}
                    onPress={() => {
                      setSelectedService(allServicesProviders[index]);
                    }}
                  />
                );
              })}
        </MapView>
        {(selectedService || selectedJob) && (
          <MapServiceCard service={selectedService} job={selectedJob} />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backBnt} onPress={() => navigation.goBack()}>
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
