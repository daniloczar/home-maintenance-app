import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/UserContext";
import Colors from '../Util/Colors'

const JobsList = ({ item }) => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.job_img_url }}
        style={styles.ImagesProviders}
      />
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          marginLeft: 5,
        }}
      >
        {item.job_title}
      </Text>
      <Text style={{ fontSize: 12, marginLeft: 5, marginBottom: 5 }}>
        {item.job_description}
      </Text>

      <Text style={{ fontSize: 12, marginLeft: 5, marginBottom: 5 }}>
        {item.service_category_name}
      </Text>
      <View style={styles.ratingButton}>
        <Text
          style={{
            fontSize: 14,
            marginLeft: 5,
            marginBottom: 5,
            fontWeight: "bold",
          }}
        >
          £ {item.job_max_budget}
        </Text>

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
          <Text
            style={{
              fontSize: 12,
              color: "white",
              textAlign: "center",
              padding: 4,
              fontWeight: "bold",
            }}
          >
            See More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JobsList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 8,
    margin: 10,
    width: 350,
  },
  ImagesProviders: {
    alignSelf: "center",
    width: "97%",
    height: 120,
    marginTop: 3,
    marginBottom: 5,
    backgroundColor: "white",
    borderRadius: 5,
  },
  detailsButton: {
    backgroundColor: Colors.primary,
    padding: 2,
    width: 70,
    borderRadius: 5,
    marginRight: 4,
    marginBottom: 7,
  },
  ratingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 4,
  },
});
