import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import { collection, getFirestore, query, where, getDocs } from "firebase/firestore";
import { app } from "../../FirebaseConfig";

const MapServiceCard = ({ service, job }) => {
  const { user } = useContext(UserContext);
  const [services, setServices] = useState([]);
  const navigation = useNavigation();

  const fetchServices = async () => {
    const db = getFirestore(app);
    const servicesRef = collection(db, "services");
    const serviceQuery = query(servicesRef, where("user_id", "==", service.user_id));
    const serviceData = await getDocs(serviceQuery);
    const servicesList = serviceData.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setServices(servicesList);
  };
  useEffect(() => {
    fetchServices();
  }, [service]);

  if (user.user_type === "householder") {
    return (
      <View style={[styles.card, styles.shadowProp, styles.elevation]}>
        <Image style={styles.image} source={{ uri: service.user_img_url }} />
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{service.service_title}</Text>
          <Text style={styles.description}>{service.service_description}</Text>
          <View style={styles.footer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("ProviderCardHH", { item: service, services })}
              >
                <Text style={styles.buttonTitle}>Book now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rating}>
              <Text>★ 4.6</Text>
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View style={[styles.card, styles.shadowProp, styles.elevation]}>
        <Image style={styles.image} source={{ uri: job.job_img_url }} />
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{job.job_title}</Text>
          <Text style={styles.description}>{job.job_description}</Text>
          <View style={styles.footer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("ProviderCardSP", { item: job })}
              >
                <Text style={styles.buttonTitle}>Book now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rating}>
              <Text>★ 4.6</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
  },
  elevation: {
    elevation: 24,
    shadowColor: "#000",
  },
});
