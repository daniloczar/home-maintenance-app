import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Foundation } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/UserContext";
import Colors from "../Util/Colors";
import { collection, getFirestore, query, where, getDocs } from "firebase/firestore";
import { app } from "../../FirebaseConfig";

const SevicesList = ({ item }) => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    const db = getFirestore(app);
    const servicesRef = collection(db, "services");
    const service = query(servicesRef, where("user_id", "==", item.user_id));
    const serviceData = await getDocs(service);
    const servicesList = serviceData.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setServices(servicesList);
  };
  useEffect(() => {
    fetchServices();
  }, []);
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.user_img_url }} style={styles.ImagesProviders} />
      <Text style={{ fontSize: 14, fontWeight: "bold", marginLeft: 5 }}>{item.full_name}</Text>
      <Text style={{ fontSize: 12, marginLeft: 5, marginBottom: 5 }}>{item.service_title}</Text>
      <View style={styles.ratingButton}>
        <View style={styles.ratingButton}>
          <Foundation name="star" size={10} color="#6759FF" />
          <Text style={{ fontSize: 10, color: "#6759FF", fontWeight: "bold" }}>4.3</Text>
        </View>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => {
            user.user_type === "householder"
              ? navigation.navigate("ProviderCardHH", {
                  item,
                  services,
                })
              : navigation.navigate("ProviderCardSP", {
                  item,
                });
          }}
        >
          <Text style={{ fontSize: 12, color: "white", textAlign: "center" }}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SevicesList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    margin: 10,
  },
  ImagesProviders: {
    width: 150,
    height: 120,
    margin: 5,
    backgroundColor: "white",
    borderRadius: 5,
  },
  ratingButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
    marginLeft: 4,
  },
  detailsButton: {
    backgroundColor: Colors.primary,
    padding: 2,
    width: 70,
    borderRadius: 5,
    marginRight: 4,
    marginBottom: 7,
  },
});
