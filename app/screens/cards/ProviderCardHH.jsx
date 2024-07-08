import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import BookingModal from "../BookingModal";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Rating, RatingInput } from "react-native-stock-star-rating";


const cardData = [
  {
    key: 1,
    name: "Paul Chain",
    title: "Professional Plumber",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. ",
    src: require("../../../assets/Images/plumber2.png"),
    skills: ["Deep Cleaning", "Windows", "Soft clean", "Upholstery"],

    service_category_name: "Plumbing",

    service_cost: 100,

    service_description: "stop leakages with permanent fix",

    service_id: "1",

    service_img_url_after:
      "https://cdn.treehouseinternetgroup.com/uploads/before_after/5351/medium/5f64e293ecf44_1600350680652.jpg",

    service_img_url_before:
      "https://cdn.treehouseinternetgroup.com/uploads/before_after/5351/medium/5f64e291c1b50_1600350688006.jpg",

    service_title: "Plumbing Service",

    user_id: "4",
    review_rating:3,
    review_description: "Satisfactory service"
  },
];
export default function ProviderCardHH() {
  const [image, setImage] = useState(0);
  const navigation = useNavigation();
  const [showModal, setShowModal]=useState (false)
  const handleHideModal = () => setShowModal(false);
  const [rating, setRating] = useState(0);

  return (
    
      <View style={styles.mainContainer}>
        <ScrollView style={{ height: "89%" }}>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              style={styles.backBnt}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-undo-sharp" size={24} color="#474747" />
            </TouchableOpacity>
            <Image
              source={cardData[image].src}
              style={{ width: "100%", height: 300 }}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.headerCard}>
              <View style={styles.textHeader}>
                <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                  {cardData[image].name}
                </Text>
                <Text style={{ fontSize: 18 }}>{cardData[image].title}</Text>
              </View>
            </View>
            <View
              style={{
                borderWidth: 0.6,
                borderColor: "grey",
                marginBottom: 15,
              }}
            ></View>
            <View style={styles.descriptionBox}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Description
              </Text>
              <Text style={{ fontSize: 13 }}>
                {cardData[image].description}
              </Text>
            </View>
            <View
              style={{
                borderWidth: 0.7,
                borderColor: "grey",
                marginBottom: 15,
              }}
            ></View>
            <View>
              <Text
                style={{ fontSize: 15, fontWeight: "bold", marginBottom: 5 }}
              >
                Gallery
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <Image
                  source={{
                    uri: "https://cdn.treehouseinternetgroup.com/uploads/before_after/5351/medium/5f64e293ecf44_1600350680652.jpg",
                  }}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 5,
                    marginBottom: 8,
                    marginRight: 8,
                  }}
                />
                <Image
                  source={{
                    uri: "https://cdn.treehouseinternetgroup.com/uploads/before_after/5351/medium/5f64e291c1b50_1600350688006.jpg",
                  }}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 5,
                    marginBottom: 8,
                  }}
                />
              </ScrollView>
            </View>
            <View
              style={{
                borderWidth: 0.7,
                borderColor: "grey",
                marginBottom: 15,
              }}
            ></View>
            <View style={styles.descriptionBox}>
              <Text
                style={{ fontSize: 15, fontWeight: "bold", marginBottom: 3 }}
              >
                Review
              </Text>
              <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
                <FontAwesome name="star" size={13} color="#edd902" />
                <FontAwesome name="star" size={13} color="#edd902" />
                <FontAwesome name="star" size={13} color="#edd902" />
                <FontAwesome name="star" size={13} color="#edd902" />
                <FontAwesome name="star-o" size={13} color="black" />
              </View>
              <Text style={{ marginTop: 6 }}>
                {cardData[image].review_description}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 10,
                marginTop: 15,
              }}
            >
              Leave a Review:
            </Text>
            <RatingInput
              rating={rating}
              setRating={setRating}
              size={20}
              maxStars={5}
              bordered={false}
            />
            <View>
              <TextInput
                placeholder="Review"
                numberOfLines={4}
                maxLength={40}
                multiline={true}
                style={styles.notes}
                onChange={(text) => setNote(text)}
              />
            </View>
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity>
                <Text style={styles.confirmBnt}>Post a review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View
          style={{ display: "flex", flexDirection: "row", margin: 8, gap: 8 }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "blue",
              padding: 13,
              alignItems: "center",
              borderRadius: 5,
              flex: 1,
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "blue",
              padding: 13,
              alignItems: "center",
              borderRadius: 5,
              flex: 1,
            }}
            onPress={() => setShowModal(true)}
          >
            <Text style={{ color: "white", fontSize: 20 }}>Book Now</Text>
          </TouchableOpacity>
        </View>
        <Modal animationType="slide" visible={showModal}>
          <BookingModal handleHideModal={handleHideModal} />
        </Modal>
      </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  backBnt: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: "#f2f2f2",
    padding: 5,
    borderRadius: 50,
  },
  textHeader: {
    marginBottom: 10,
  },
  descriptionBox: {
    marginBottom: 10,
  },
  headerCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainContainer: {
    marginLeft: -3,
    marginRight: -3,
  },
  notes: {
    borderWidth: 1,
    textAlignVertical: "top",
    padding: 15,
    height: 100,
    borderRadius: 10,
  },
  confirmBnt: {
    backgroundColor: "blue",
    textAlign: "center",
    color: "white",
    padding: 10,
    borderRadius: 10,
    fontSize: 17,
    elevation: 2,
  },
});
