import { useEffect, useState, useContext } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import BookingModal from "../BookingModal";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, query, where, collection, getDocs } from "firebase/firestore";
import { app } from "../../../FirebaseConfig";
import styless from "../../screens/auth/styles/RegistrationScreenStyles";
import { UserContext } from "../../contexts/UserContext";

const db = getFirestore(app);

export default function JobCardHH({ route }) {
  const { job } = route.params;
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const handleHideModal = () => setShowModal(false);
  const [allBids, setAllBids] = useState([]);
  const { user } = useContext(UserContext);

  const [editable, setEditable] = useState(false);
  const [maxBudget, setMaxBudget] = useState(job.job_max_budget);
  const [categoryName, setCategoryName] = useState(job.service_category_name);
  const [description, setDescription] = useState(job.job_description);
  const [title, setTitle] = useState(job.job_title);
  const [serviceNames, setServiceNames] = useState([]);
  const [serviceTitle, setServiceTitle] = useState([]);

  const fetchAllBids = async () => {
    try {
      const q = query(collection(db, "bids"), where("job_id", "==", job.job_id));
      const querySnapshot = await getDocs(q);

      const bidList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const bidListPromise = bidList.map(async (bid) => {
        let bidStatus = bid.bid_status;
        let bidAmount = bid.bid_amount;
        let serviceImgUrl;
        let serviceTitle;
        let bidId = bid.bid_id;
        const userRef = collection(db, "users");
        const q = query(userRef, where("user_id", "==", bid.user_id));
        const userSnapShot = await getDocs(q);

        serviceTitle = userSnapShot.docs[0].data().service_title;
        const userId = userSnapShot.docs[0].data().user_id;
        const serviceRef = collection(db, "services");
        const q2 = query(serviceRef, where("user_id", "==", userId));
        const serviceSnapShot = await getDocs(q2);
        serviceImgUrl = serviceSnapShot.docs[0].data().service_img_url;

        return { serviceTitle, bidStatus, bidAmount, serviceImgUrl, bidId };
      });

      const resolvedPromise = await Promise.all(bidListPromise);
      setServiceTitle(resolvedPromise);
    } catch (error) {
      console.error("Error fetching bids: ", error);
    }
  };

  useEffect(() => {
    fetchAllBids();
  }, []);

  const handleSave = async () => {
    const updatedCard = {
      ...job,
      job_max_budget: maxBudget,
      service_category_name: categoryName,
      job_description: description,
      job_title: title,
    };

    await setDoc(doc(db, "jobs", job.id), updatedCard);

    setMaxBudget(updatedCard.job_max_budget);
    setCategoryName(updatedCard.service_category_name);
    setDescription(updatedCard.job_description);
    setTitle(updatedCard.job_title);

    setEditable(false);
  };

  const handleAcceptBid = async (bidId) => {
    try {
      const bidRef = doc(db, "bids", bidId);
      await setDoc(bidRef, { bid_status: "Accepted" }, { merge: true });
      fetchAllBids();
      Alert.alert(`Bid Accepted`);
    } catch (error) {
      console.error("Error accepting bid: ", error);
    }
  };

  const handleDeclineBid = async (bidId) => {
    try {
      const bidRef = doc(db, "bids", bidId);
      await setDoc(bidRef, { bid_status: "Declined" }, { merge: true });
      fetchAllBids();
      Alert.alert(`Bid Declined`);
    } catch (error) {
      console.error("Error declining bid: ", error);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <View style={{ height: "100%" }}>
          <View style={styles.imageContainer}>
            <TouchableOpacity style={styles.backBnt} onPress={() => navigation.navigate("MyStuff")}>
              <Ionicons name="arrow-undo-sharp" size={24} color="#474747" />
            </TouchableOpacity>
            <Image source={{ uri: job.job_img_url }} style={{ width: "100%", height: 300 }} />
          </View>
          <View style={styles.container}>
            <View style={styles.headerCard}>
              <View style={styles.textHeader}>
                {editable ? (
                  <>
                    <View>
                      <Text>Title:</Text>
                      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
                    </View>
                    <View>
                      <Text>Service Type: </Text>
                      <TextInput
                        style={styles.input}
                        value={categoryName}
                        onChangeText={setCategoryName}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text>Max Budget:</Text>
                      <TextInput
                        style={styles.input}
                        value={maxBudget}
                        onChangeText={setMaxBudget}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={{ fontSize: 22, fontWeight: "bold" }}>{title}</Text>
                    <Text style={{ fontSize: 18 }}>{categoryName}</Text>
                    <Text style={{ fontSize: 18 }}>Max Budget: £{maxBudget}</Text>
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
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>Description</Text>
              {editable ? (
                <TextInput
                  style={[styles.input, { height: 100 }]}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
              ) : (
                <Text style={{ fontSize: 13 }}>{description}</Text>
              )}
              {editable && (
                <TouchableOpacity style={styless.buttonChoice} onPress={handleSave}>
                  <Text style={styless.buttonTitle}>Save</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.6,
              borderColor: "grey",
              marginBottom: 15,
            }}
          ></View>
          <Text style={styles.bid}>Bids</Text>
          <FlatList
            data={serviceTitle}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => {
                  navigation.navigate("JobCardHH", { job: item });
                }}
              >
                <View style={styles.bidBox}>
                  <Image source={{ uri: item.serviceImgUrl }} style={styles.jobImage} />
                  <Text style={styles.jobTitle}>{item.serviceTitle}</Text>
                  <Text style={styles.bidText}>Bid Amount: £{item.bidAmount}</Text>
                  <Text style={styles.bidText}>Bid Status: {item.bidStatus}</Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.acceptButton]}
                      onPress={() => handleAcceptBid(item.bidId)}
                    >
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.declineButton]}
                      onPress={() => handleDeclineBid(item.bidId)}
                    >
                      <Text style={styles.buttonText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.bidBox}>
                <Text>No Bids found.</Text>
              </View>
            }
          />
        </View>
        <View style={{ display: "flex", flexDirection: "row", margin: 8, gap: 8 }}></View>
        <Modal animationType="slide" visible={showModal}>
          <BookingModal handleHideModal={handleHideModal} />
        </Modal>
      </View>
    </SafeAreaView>
  );
} //

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  jobDetails: {
    flex: 1,
    justifyContent: "center",
  },
  jobContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
  },
  jobStatus: {
    fontSize: 14,
    color: "#777",
  },
  jobImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: "#ddd",
  },
  bidBox: {
    backgroundColor: "#F2F2F2",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 3,
  },
  bidTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bidText: {
    fontSize: 14,
  },
  bid: {
    marginLeft: 20,
    padding: 1,
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  declineButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
