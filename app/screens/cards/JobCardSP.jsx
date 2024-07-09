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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import BookingModal from "../BookingModal";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  setDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
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

  const fetchAllBids = async () => {
    try {
      const q = query(
        collection(db, "bids"),
        where("job_id", "==", job.job_id)
      );
      const querySnapshot = await getDocs(q);

      const bidList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(bidList, "<<<<<<<<<<<<<<<<<<");
      setAllBids(bidList);
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    }
  };

  useEffect(() => {
    fetchAllBids();
  }, []);
  console.log(allBids, "+++++++++++++");

  const handleSave = async () => {
    const updatedCard = {
      ...job,
      maximum_budget: maxBudget,
      service_category_name: categoryName,
      description: description,
      title: title,
    };

    await setDoc(doc(db, "jobs", job.id), updatedCard);

    setMaxBudget(updatedCard.maximum_budget);
    setCategoryName(updatedCard.service_category_name);
    setDescription(updatedCard.description);
    setTitle(updatedCard.title);

    setEditable(false);
  };

  return (
    <SafeAreaView>
      <View>
        <ScrollView style={{ height: "90%" }}>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              style={styles.backBnt}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-undo-sharp" size={24} color="#474747" />
            </TouchableOpacity>
            <Image
              source={{ uri: job.job_img_url }}
              style={{ width: "100%", height: 300 }}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.headerCard}>
              <View style={styles.textHeader}>
                {editable ? (
                  <>
                    <View>
                      <Text>Title:</Text>
                      <TextInput
                        style={styles.input}
                        value={null}
                        onChangeText={setTitle}
                      />
                    </View>
                    <View>
                      <Text>Service Type: </Text>
                      <TextInput
                        style={styles.input}
                        value={null}
                        onChangeText={setCategoryName}
                      />
                    </View>
                    <View tyle={styles.inputContainer}>
                      <Text>Max Budget:</Text>
                      <TextInput
                        style={styles.input}
                        value={null}
                        onChangeText={setMaxBudget}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                      {title}
                    </Text>
                    <Text style={{ fontSize: 18 }}>{categoryName}</Text>
                    <Text style={{ fontSize: 18 }}>
                      Max Budget: £{maxBudget}
                    </Text>
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
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
              ) : (
                <Text style={{ fontSize: 13 }}>{description}</Text>
              )}
              {editable && (
                <TouchableOpacity
                  style={styless.buttonChoice}
                  onPress={handleSave}
                >
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
          <Text>Bids</Text>
          <FlatList
            data={allBids}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => {
                  navigation.navigate("JobCardHH", { job: item });
                }}
              >
                <View style={styles.jobContainer}>
                  <Image
                    source={{ uri: item.job_img_url }}
                    style={styles.jobImage}
                  />
                  <View style={styles.jobDetails}>
                    <Text style={styles.jobTitle}>{item.bid_amount}</Text>
                    <Text style={styles.jobStatus}>
                      Bid Status: {item.bid_status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>No Bids found.</Text>}
          />
        </ScrollView>
        <View
          style={{ display: "flex", flexDirection: "row", margin: 8, gap: 8 }}
        ></View>
        <Modal animationType="slide" visible={showModal}>
          <BookingModal handleHideModal={handleHideModal} />
        </Modal>
      </View>
    </SafeAreaView>
  );
}

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
});
