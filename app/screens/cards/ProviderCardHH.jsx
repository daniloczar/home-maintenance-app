import {
  Alert,
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
import { Avatar } from "react-native-paper";
import { format } from "date-fns";
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
  updateDoc,
} from "firebase/firestore";
import { app } from "../../../FirebaseConfig";
import { UserContext } from "../../contexts/UserContext";
import StarRating from "./StarRating";
import Colors from "../../Util/Colors";
const db = getFirestore(app);

export default function ProviderCardHH({ route }) {
  const [showModal, setShowModal] = useState(false);
  const handleHideModal = () => setShowModal(false);
  const [note, setNote] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const navigation = useNavigation();
  const { item, services } = route.params;
  const { user } = useContext(UserContext);
  const [avgRating,setAvgRating]=useState(0)
  console.log(">>>>",item)
  const handleConfirmRating = async () => {

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
        Alert.alert("Review confirmed!");
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
    try {
      const reviewRef = collection(db, "reviews")
      const reviewsQuery = query(reviewRef, where("service_id", "==", item.service_id))
      const reviewData = await getDocs(reviewsQuery)
      const reviewList = await Promise.all(
        reviewData.docs.map(async (doc) => {
          const review = { id: doc.id, ...doc.data(), created_at: doc.data().created_at.toDate() };

          // Fetch user data based on user_id
          const userSnapshot = await getDocs(query(collection(db, "users"), where("user_id", "==", review.user_id)));
          const userData = userSnapshot.docs[0] ? userSnapshot.docs[0].data() : null;

          return {
            ...review,
            fullName: userData ? userData.full_name : 'Anonymous',
            avatar: userData ? userData.user_img_url : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRadJ-YmNxJTg6v9iO22fzR_65KenYJHFB5zg&s',
          };
        })
      );
      const ratingsArray = reviewList.map((review) => Number(review.review_rating))
      reviewList.sort((a, b) => b.created_at - a.created_at)
      setReviews(reviewList)
      setAvgRating(ratingsArray.reduce((acc, val) => acc + val, 0) / ratingsArray.length)
      console.log(avgRating)
      console.log(ratingsArray)
    } catch (err) {
      console.log('Error getting reviews: ', err);
    }
  };

  const handleMessageClick = async () => {
    const db = getFirestore(app);
    const chatRef = await collection(db, "chats");

    const chatIdQuery = query(
      chatRef,
      where("sent_by_user_id", "==", user.user_id),
      where("sent_to_user_id", "==", item.user_id)
    );

    const chatIdQueryData = await getDocs(chatIdQuery);
    const chatIdData = chatIdQueryData.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    let docRef;

    if (!chatIdData.length) {
        docRef = await addDoc(chatRef, {
        chat_id: "",
        created_at: new Date(),
        service_id: item.service_id,
        sent_by_user_id: user.user_id,
        sent_to_user_id: item.user_id,
      });

      await updateDoc(docRef, { chat_id: docRef.id });
      const chatobj = {
        chatId: docRef.id,
        sentTo: user.full_name,
        sent_by_user_id: user.user_id,
        sent_to_user_id: item.user_id,
        sentByUserImgUrl: user.user_img_url,
        sentToUserImgUrl: item.user_img_url,
      };
  
      navigation.navigate('Messages', chatobj)
    } else {
      docRef = chatIdData[0]
      console.log("docRef", docRef)
      const chatobj = {
        chatId: docRef.chat_id,
        sentTo: user.full_name,
        sent_by_user_id: user.user_id,
        sent_to_user_id: item.user_id,
        sentByUserImgUrl: user.user_img_url,
        sentToUserImgUrl: item.user_img_url,
      };
  
      navigation.navigate('Messages', chatobj)

    }
    //navigation.navigate("ChatScreen");

 


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
            <Text style={{ fontSize: 15, fontWeight: "bold", marginBottom: 3 }}>Rating</Text>
              <View style={styles.averageRatingContainer}>
                <Text style={styles.averageRatingText}>{avgRating?avgRating.toFixed(1):0}</Text>
                <StarRating item={{ review_rating: avgRating }} />
                <Text style={styles.reviewCountText}>  {reviews.length} Reviews</Text>
              </View>
            <View>
            {reviews.map(review=>(
                <View key={review.review_id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Avatar.Image
                      style={styles.avatar}
                      size={50}
                      source={{ uri: review.avatar }}
                    />
                    <View style={styles.reviewInfo}>
                      <Text style={styles.userName}>{review.fullName}</Text>
                      <Text style={styles.reviewDate}>
                        {format(review.created_at, 'MMM dd, yyyy')}
                      </Text>
                    </View>
                  </View>
                  <StarRating item={review} />
                  <Text style={styles.reviewText}>{review.review_description}</Text>
                </View>
              ))}
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
              placeholder="Enter your review"
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
          onPress={handleMessageClick}
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
  averageRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom:5,
  },
  averageRatingText: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
  reviewCountText: {
    fontSize: 15,
    color: "blue",
    marginLeft: 5,
  },
  reviewCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    marginRight: 10,
  },
  reviewInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewText: {
    fontSize: 14,
    marginTop: 5,
  },
  ratingDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: "grey",
  },
});
