import { useContext, useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { collection, doc, getDocs, getFirestore, setDoc, where, query } from "@firebase/firestore";
import { app } from "../../../FirebaseConfig";
import { UserContext } from "../../contexts/UserContext";
import StarRating from "./StarRating";
import { Avatar } from "react-native-paper";
import { format } from "date-fns";
const db = getFirestore(app);

export default function ProviderCardSP({ route }) {
  const navigation = useNavigation();
  const {user} = useContext(UserContext)
  const { userId } = route.params;
  const [item, setItem] = useState({});
  const [editable, setEditable] = useState(false);
  const [fullName, setFullName] = useState("");
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [reviews,setReviews]=useState([])
  const [avgRating,setAvgRating]=useState(0)
  const [showReviews, setShowReviews] = useState(false)

  useEffect(() => {
    getServiceByUserId();
  }, []);

  const getServiceByUserId = async () => {
    try {
      const serviceRef = collection(db, "services");
      const q = query(serviceRef, where('user_id', '==', userId));
      const serviceSnapShot = await getDocs(q);
      if(!serviceSnapShot.empty){
        const serviceData = serviceSnapShot.docs[0].data();
        setItem(serviceData);
        setFullName(serviceData.full_name);
        setServiceTitle(serviceData.service_title);
        setServiceDescription(serviceData.service_description);
        getReviews(serviceData.service_id);
      }
    } catch (error) {
      console.error("Error fetching service: ", error);
    }
  }

  const getReviews = async (serviceId) => {
    try {
      const reviewsSnapshot = await getDocs(query(collection(db, "reviews"), where("service_id", "==", serviceId)))
      const reviewsData = reviewsSnapshot.docs.map(async (doc) => {
        const review = doc.data()
        
        const userSnapshot = await getDocs(query(collection(db, "users"), where("user_id", "==", review.user_id)))
        if(!userSnapshot.empty){
          const userData = userSnapshot.empty ? {} : userSnapshot.docs[0].data()
          return { ...review, fullName: userData.full_name || "Anonymous" , avatar: userData.user_img_url }
        }
        
      })
      const ratingsArray = reviewsSnapshot.docs.map(doc=>Number(doc.data().review_rating))
      const resolvedPromise = await Promise.all(reviewsData)
      setReviews(resolvedPromise)
      setAvgRating(ratingsArray.reduce((acc, val) => acc + val, 0))
    } catch (error) {
      console.error("Error fetching reviews: ", error)
    }
  }

  const handleSave = async () => {
    const updatedItem = {
      ...item,
      full_name: fullName,
      service_title: serviceTitle,
      service_description: serviceDescription,
    };

    try {
      await setDoc(doc(db, "services", item.service_id), updatedItem);
      setItem(updatedItem);
      setEditable(false);
      Alert.alert("Success", "Service updated successfully!");
    } catch (error) {
      console.error("Error updating service: ", error);
    }
  };
  return (
    <View>
      <View style={styles.mainContainer}>
        <ScrollView>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              style={styles.backBnt}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-undo-sharp" size={24} color="#474747" />
            </TouchableOpacity>
            <Image
              source={{ uri: item.service_img_url }}
              style={{ width: "100%", height: 300 }}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.headerCard}>
              <View style={styles.textHeader}>
                {editable ? (
                  <>
                    <View>
                      <Text>Full Name:</Text>
                      <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                      />
                    </View>
                    <View>
                      <Text>Service Title:</Text>
                      <TextInput
                        style={styles.input}
                        value={serviceTitle}
                        onChangeText={setServiceTitle}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                      {fullName}
                    </Text>
                    <Text style={{ fontSize: 18 }}>{serviceTitle}</Text>
                  </>
                )}
              </View>
              <TouchableOpacity onPress={() => setEditable(!editable)}>
                <AntDesign name="edit" size={24} color="black" />
              </TouchableOpacity>
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
              {editable ? (
                <TextInput
                  style={[styles.input, { height: 100 }]}
                  value={serviceDescription}
                  onChangeText={setServiceDescription}
                  multiline
                />
              ) : (
                <Text style={{ fontSize: 13 }}>{serviceDescription}</Text>
              )}
              {editable && (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              )}
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
                    uri: item.service_img_url_before,
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
                    uri: item.service_img_url_after,
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
                Reviews:
              </Text>
              <TouchableOpacity onPress={() => setShowReviews(!showReviews)}>
                <View style={styles.averageRatingContainer}>
                  <Text style={styles.averageRatingText}>{avgRating/reviews.length}</Text>
                  <StarRating item={{ review_rating: avgRating }} />
                  <Text style={styles.reviewCountText}>  {reviews.length} Reviews</Text>
                </View>
              </TouchableOpacity>
              {showReviews && reviews.map(review=>(
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
                        {format(review.created_at.toDate(), 'MMM dd, yyyy')}
                      </Text>
                    </View>
                  </View>
                  <StarRating item={review} />
                  <Text style={styles.reviewText}>{review.review_description}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
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
  input: {
    borderWidth: 1,
    borderColor: "grey",
    padding: 5,
    borderRadius: 5,
    marginVertical: 5,
  },
  saveButton: {
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
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
    marginLeft: 10,
    fontSize: 12,
    color: "grey",
  },
});