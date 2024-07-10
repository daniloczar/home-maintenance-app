import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { app } from "../../FirebaseConfig";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/MaterialIcons";
import { UserContext } from "../contexts/UserContext";

const db = getFirestore(app);

const JobPost = ({ route }) => {
  const [jobId, setJobId] = useState(null);
  const [completedAt, setcompletedAt] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [jobImgUrl, setJobImgUrl] = useState("");
  const [jobDescription, setJobDescription] = useState(null);
  const [jobServiceCategoryName, setJobServiceCategoryName] = useState(null);
  const [jobMaxBudget, setJobMaxBudget] = useState(null);
  const [jobStatus, setJobStatus] = useState("Open");
  const [serviceCategories, setServiceCategories] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const navigation = useNavigation();

  const { setAllJobs, allJobs } = route.params;

  const fetchServiceCategories = async () => {
    try {
      const q = query(collection(db, "service_categories"));
      const querySnapshot = await getDocs(q);

      const categories = querySnapshot.docs.map((doc) => ({
        label: doc.data().service_category_name,
        value: doc.data().service_category_name,
      }));
      setServiceCategories(categories);
    } catch (error) {
      console.error("Error fetching service categories: ", error);
    }
  };
  useEffect(() => {
    fetchServiceCategories();
  }, []);

  const newJob = {
    completed_at: completedAt,
    created_at: serverTimestamp(),
    job_description: jobDescription,
    job_id: Date.now().toString(),
    job_img_url: jobImgUrl || "https://placehold.co/700x700?text=Awaiting\nImage",
    job_max_budget: parseFloat(jobMaxBudget),
    job_status: jobStatus,
    job_title: jobTitle,
    service_category_name: jobServiceCategoryName,
    user_id: user.user_id,
  };

  const pickImage = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      Alert.alert("Permission to access the camera roll is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const uri = pickerResult.assets[0].uri;
      setJobImgUrl(uri);
    }
  };

  const getFileName = (uri) => {
    return uri.split("/").pop();
  };

  const handlePostNewJob = async () => {
    const updatedJob = {
      ...newJob,
      job_img_url: jobImgUrl || "https://placehold.co/700x700?text=Awaiting\nImage",
    };

    const jobDocRef = await addDoc(collection(db, "jobs"), updatedJob);
    alert("Job posted successfully");
    navigation.navigate("MyStuff");
    setJobServiceCategoryName(null);
    setJobTitle("");
    setJobDescription("");
    setJobImgUrl("");
    setJobMaxBudget("");

    setAllJobs([...allJobs, updatedJob]);
  };

  const resetForm = () => {
    setJobServiceCategoryName(null);
    setJobTitle("");
    setJobDescription("");
    setJobImgUrl("");
    setJobMaxBudget("");
  };

  return (
    <ScrollView>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.container}>
          <View style={styles.headercancel}>
            <Text style={styles.header}>Post New Job</Text>
            <TouchableOpacity
              onPress={() => {
                resetForm();
                navigation.navigate("MyStuff");
              }}
            >
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <RNPickerSelect
            onValueChange={(value) => setJobServiceCategoryName(value)}
            items={serviceCategories}
            placeholder={{ label: "Select service type", value: null }}
            value={jobServiceCategoryName}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 14,
                right: -3,
                justifyContent: "center",
              },
            }}
            Icon={() => {
              return <Icon name="arrow-drop-down" size={33} color="gray" />;
            }}
          />

          <TextInput
            style={styles.input}
            placeholder="Job title"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setJobTitle(text)}
            value={jobTitle}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Job description"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setJobDescription(text)}
            value={jobDescription}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />

          <TouchableOpacity style={[styles.input, styles.imagePicker]} onPress={pickImage}>
            <Text style={jobImgUrl ? styles.jobImgUrlPlaceholder : styles.imagePickerPlaceholder}>
              {jobImgUrl ? getFileName(jobImgUrl) : "Upload Job Image"}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Maximum budget"
            placeholderTextColor="#aaaaaa"
            keyboardType="numeric"
            onChangeText={(text) => setJobMaxBudget(text)}
            value={jobMaxBudget}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={() => handlePostNewJob()}>
            <Text style={styles.buttonTitle}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

export default JobPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingTop: 30,
    height: "100%",
  },
  headercancel: {
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cancel: {
    textDecorationLine: "underline",
    paddingTop: 5,
  },
  input: {
    height: 48,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 7,
    marginBottom: 7,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  button: {
    backgroundColor: "#6759FF",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerPlaceholder: {
    fontSize: 13.5,
    color: "#aaaaaa",
    marginTop: 7,
    marginBottom: 7,
    marginLeft: -167,
    paddingLeft: 16,
  },
  jobImgUrlPlaceholder: {
    fontSize: 13.5,
    color: "#000",
    marginTop: 7,
    marginBottom: 7,
    marginLeft: -15,
    marginRight: 15,
    paddingLeft: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 48,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 7,
    marginBottom: 7,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
    paddingRight: 30,
  },
  inputAndroid: {
    height: 48,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 7,
    marginBottom: 7,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
    paddingRight: 30,
  },
});
