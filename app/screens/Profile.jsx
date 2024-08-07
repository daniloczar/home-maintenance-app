import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Button,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Avatar, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../contexts/UserContext";
import { getAuth, signOut } from "firebase/auth";
import { collection, query, getDocs, where, doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { app } from "../../FirebaseConfig";
import { getFirestore } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "../Util/Colors";
import { useNavigation } from "@react-navigation/native";

const db = getFirestore(app);
const auth = getAuth(app);

export default function Profile({ handleHideModal }) {
  const [isEditable, setIsEditable] = useState(false);
  const [profile, setProfile] = useState({});
  const { user, setUser } = useContext(UserContext);
  const [docId, setDocId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    getUser();
  }, [user]);
  const getUser = async () => {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setDocId(doc.id);
        setProfile(doc.data());
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.log("Error getting document");
      return null;
    }
  };
  const handleEditToggle = async () => {
    if (isEditable) {
      await setDoc(doc(db, "users", docId), profile);
      Alert.alert("Profile Updated Successfully!");
    }
    setIsEditable(!isEditable);
  };

  const handleChange = (key, value) => {
    setProfile({ ...profile, [key]: value });
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
    });

    if (!pickerResult.canceled) {
      setProfile({ ...profile, user_img_url: pickerResult.assets[0].uri });
    }
  };

  const hanldeLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("user");
      setUser(null);
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error signing out", error.message);
    }
  };

  return (
    <>
      {user ? (
        <ScrollView>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
            <SafeAreaProvider>
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  gap:'100%',
                }}
              >
                <View style={styles.container}>
                  <View style={styles.header}>
                    <Ionicons
                      name="arrow-back"
                      size={25}
                      color="white"
                      onPress={handleHideModal}
                    />
                    <Text style={styles.title}>Profile</Text>
                    <Ionicons
                      name={isEditable ? "checkmark" : "pencil"}
                      size={25}
                      color="white"
                      borderBottomColor="black"
                      onPress={handleEditToggle}
                    />
                  </View>
                  <View style={styles.avatarContainer}>
                    <Avatar.Image
                      size={200}
                      source={{ uri: profile.user_img_url }}
                    />
                    {isEditable && (
                      <TouchableOpacity onPress={pickImage}>
                        <Text style={styles.changePhotoText}>Change Photo</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                      style={[styles.input, isEditable && styles.editableInput]}
                      editable={isEditable}
                      value={profile.full_name}
                      onChangeText={(text) => handleChange("full_name", text)}
                    />
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Phone:</Text>
                    <TextInput
                      style={[styles.input, isEditable && styles.editableInput]}
                      editable={isEditable}
                      value={profile.telephone}
                      onChangeText={(text) => handleChange("telephone", text)}
                    />
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>House No:</Text>
                    <TextInput
                      style={[styles.input, isEditable && styles.editableInput]}
                      editable={isEditable}
                      value={profile.house_number}
                      onChangeText={(text) =>
                        handleChange("house_number", text)
                      }
                    />
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Street Name:</Text>
                    <TextInput
                      style={[styles.input, isEditable && styles.editableInput]}
                      editable={isEditable}
                      value={profile.street_name}
                      onChangeText={(text) => handleChange("street_name", text)}
                    />
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.label}>Post Code:</Text>
                    <TextInput
                      style={[styles.input, isEditable && styles.editableInput]}
                      editable={isEditable}
                      value={profile.postcode}
                      onChangeText={(text) => handleChange("postcode", text)}
                    />
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={hanldeLogout}
                  >
                    <Text style={styles.buttonTitle}>Sign Out</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaProvider>
          </KeyboardAwareScrollView>
        </ScrollView>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({

  header: {
    paddingTop: 75,
    paddingRight: 30,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 35,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 50,
  },
  changePhotoText: {
    color: "blue",
    marginTop: 10,
  },
  field: {
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    width: 100,
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  editableInput: {
    borderBottomColor: "blue",
  },
  buttonContainer: {
    backgroundColor: Colors.primary,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 15,
  },
  buttonTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
