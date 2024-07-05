import { Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import JobList from "./JobList";
import { UserContext } from "../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";

const servicesData = async () => {
  const servicesRef = collection(db, "users");
  const service = query(servicesRef, where("user_type", "==", "service"));
  const serviceData = await getDocs(service);
};

// house holders
const imagesCatData = [
  {
    key: 1,
    title: "Air Conditioner",
    src: require("../../assets/Images/air.png"),
  },
  {
    key: 2,
    title: "Plumbing",
    src: require("../../assets/Images/Plumber.png"),
  },
  { key: 3, title: "Laundry", src: require("../../assets/Images/Laundry.png") },
  {
    key: 4,
    title: "Electric Work",
    src: require("../../assets/Images/Multimeter.png"),
  },
];
const imagesProvider = [
  {
    key: 1,
    name: "Harper",
    title: "Cleaner",
    rating: 3.9,
    src: require("../../assets/Images/cleaner1.png"),
  },
  {
    key: 2,
    name: "Jackson",
    title: "Electrician",
    rating: 4.1,
    src: require("../../assets/Images/electrician1.png"),
  },
  {
    key: 3,
    name: "Ethan",
    title: "Painter",
    rating: 4.5,
    src: require("../../assets/Images/painter1.png"),
  },
  {
    key: 4,
    name: "Aiden",
    title: "Carpenter",
    rating: 3.7,
    src: require("../../assets/Images/carpenter1.png"),
  },
  {
    key: 5,
    name: "Lucas",
    title: "Plumber",
    rating: 4.8,
    src: require("../../assets/Images/plumber2.png"),
  },
];

const Jobs = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  return (
    <View>
      <View>
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../assets/Images/toggleMap.png")}
            style={{ width: 30, height: 30 }}
          />

          <Text
            style={{ fontSize: 18, color: "blue" }}
            onPress={() => {
              navigation.navigate("Map");
            }}
          >
            Toggle Map
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.categoryText}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Categories</Text>
      </View>
      <View style={styles.ImageContainer}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={imagesCatData}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <Image source={item.src} style={styles.Images} />
              <Text style={{ fontSize: 13, marginTop: 5 }}>{item.title}</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.categoryText}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Services
        </Text>
      </View>
      <View style={styles.ImageContainerProviders}>
        <FlatList
          data={imagesProvider}
          numColumns={2}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            // <Image source={item.src} style={styles.ImagesProviders} />
            <View>
              <JobList item={item} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Jobs;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    margin: 5,
    width: 110,
  },
  categoryText: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  Images: {
    width: 60,
    height: 50,
    margin: 2,
    backgroundColor: "white",
    borderRadius: 5,
  },
  ImageContainer: {
    display: "flex",
    paddingLeft: 5,
    paddingRight: 5,
  },
  ImageContainerProviders: {
    display: "flex",
    alignItems: "center",
  },
});
