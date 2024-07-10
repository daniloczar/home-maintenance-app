import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import BookingModal from "../BookingModal";
import { useNavigation } from "@react-navigation/native";
import { Rating, RatingInput } from "react-native-stock-star-rating";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../../FirebaseConfig";
import { UserContext } from "../../contexts/UserContext";
import StarRating from "./StarRating";
import Colors from "../../Util/Colors";

export default function ProviderCardHH({ route }) {
  const [showModal, setShowModal] = useState(false);
  const handleHideModal = () => setShowModal(false);
  const [note, setNote] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const navigation = useNavigation();
  const { item, services } = route.params;
  const { user } = useContext(UserContext);

  const handleConfirmRating = async () => {
    const db = getFirestore(app);

    if (note) {
      const review = {
        fullName: user.full_name,
        user_id: user.user_id,
        review_rating: rating,
        review_description: note,
        created_at: serverTimestamp(),
        service_id: item.service_id,
      };

      try {
        const reviews = await collection(db, "reviews");
        await addDoc(reviews, review);
        alert("Review confirmed!");
      } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error confirming review. Please try again.");
      } finally {
        navigation.navigate("JobPage");
      }
    } else {
      alert("Please leave your review.");
    }
  };

  const getReviews = async () => {
    const db = getFirestore(app);
    const reviewRef = collection(db, "reviews");
    const reviewsQuery = query(reviewRef, where("service_id", "==", item.service_id));
    const reviewData = await getDocs(reviewsQuery);
    const reviewList = reviewData.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at.toDate(),
    }));
    reviewList.sort((a, b) => b.created_at - a.created_at);
    setReviews(reviewList);
  };

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={{ height: "89%" }}>
        <View style={styles.imageContainer}>
          <TouchableOpacity style={styles.backBnt} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-undo-sharp" size={24} color="#474747" />
          </TouchableOpacity>
          <Image source={{ uri: item.user_img_url }} style={{ width: "100%", height: 300 }} />
        </View>
        <View style={styles.container}>
          <View style={styles.headerCard}>
            <View style={styles.textHeader}>
              <Text style={{ fontSize: 22, fontWeight: "bold" }}>{item.full_name}</Text>
              <Text style={{ fontSize: 18 }}>{item.service_title}</Text>
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
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Description</Text>
            <Text style={{ fontSize: 13 }}>{item.service_description}</Text>
          </View>
          <View
            style={{
              borderWidth: 0.7,
              borderColor: "grey",
              marginBottom: 15,
            }}
          ></View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: "bold", marginBottom: 5 }}>Gallery</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <Image
                source={{
                  uri: services[0].service_img_url_after,
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
                source={{ uri: services[0].service_img_url_before }}
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
            <Text style={{ fontSize: 15, fontWeight: "bold", marginBottom: 3 }}>Review</Text>
            <View>
              <FlatList
                data={reviews}
                renderItem={({ item }) => (
                  <View
                    style={{
                      marginTop: 13,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      <StarRating item={item} />
                      <Text>{item.created_at.toDateString()}</Text>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>{item.fullName}</Text>
                    <Text>{item.review_description}</Text>
                    <View
                      style={{
                        borderWidth: 0.7,
                        borderColor: "#cecece",
                        marginBottom: 2,
                        marginTop: 10,
                      }}
                    ></View>
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
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
              onChangeText={(text) => setNote(text)}
            />
          </View>
          <View style={{ marginTop: 15 }}>
            <TouchableOpacity onPress={handleConfirmRating}>
              <Text style={styles.confirmBnt}>Post a review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={{ display: "flex", flexDirection: "row", margin: 8, gap: 8 }}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
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
            backgroundColor: Colors.primary,
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
    backgroundColor: Colors.primary,
    textAlign: "center",
    color: "white",
    padding: 10,
    borderRadius: 10,
    fontSize: 17,
    elevation: 2,
  },
});
