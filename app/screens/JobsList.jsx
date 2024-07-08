import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { Foundation } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/UserContext";

const JobsList = ({ item }) => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.job_img_url }}
        style={styles.ImagesProviders}
      />
      <Text style={{ fontSize: 14, fontWeight: "bold", marginLeft: 5 }}>
        {item.job_title}
      </Text>
      <Text style={{ fontSize: 12, marginLeft: 5, marginBottom: 5 }}>
        {item.job_description}
      </Text>

      <Text>{item.service_category_name}</Text>
      <Text>£{item.job_max_budget}</Text>
      
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => {
            user.user_type === "householder"
              ? navigation.navigate("ProviderCardHH", {
                  item,
                })
              : navigation.navigate("ProviderCardSP", {
                  item: item,
                });
          }}
        >
          
            <Text>See more</Text>
          
        </TouchableOpacity>
      </View>
    
  );
};

export default JobsList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    margin: 10,
  },
  ImagesProviders: {
    width: 500,
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
    backgroundColor: "#336aea",
    padding: 2,
    width: 70,
    borderRadius: 5,
    marginRight: 4,
    marginBottom: 7,
  },
});
