import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity, Modal } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Colors from "../Util/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/UserContext";
import { collection, query, getDocs, where, doc, setDoc } from "firebase/firestore";
import { app } from '../../FirebaseConfig'
import { getFirestore } from "firebase/firestore";
import Profile from "./Profile"
const db = getFirestore(app)

export default function Header() {
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState({});
  const [docId,setDocId] = useState(null)

  const { user } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const handleHideModal = () => setModalVisible(false);
  


  useEffect(()=>{
    getUser()
  },[])
  const getUser = async () => {
  try {
      const userRef = collection(db, "users")
      const q = query(userRef, where("email", "==", user.email))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        setDocId(doc.id)
        setProfile(doc.data());
      } else {
        console.log("No such document!")
      }
    }
    catch(err){
      console.log("Error getting document")
      return null
    }
  }

  const onSubmit = () => {
    console.log(search);
  };

  return (
    <SafeAreaView edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.profileMainContainer}>
          <View style={styles.profileContainer}>
            <Image
              source={require("../../assets/Images/logo.png")}
              style={styles.logoImage}
            />
          </View>
          <View>
            <Text
              style={{ color: Colors.white, fontSize: 20, fontWeight: "700" }}
            >
              Home Maintenance
            </Text>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Avatar.Image size={40} source={{ uri: profile.user_img_ur }} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={(value) => {
              setSearch(value);
            }}
            placeholderTextColor="#909090"
            style={styles.searchBar}
          />
          <TouchableOpacity
            style={styles.searchButtonContainer}
            onPress={() => onSubmit()}
          >
            <FontAwesome name="search" size={21} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <Modal animationType="'slide" visible={modalVisible}>
        <Profile handleHideModal={handleHideModal} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileMainContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchBarContainer: {
    marginTop: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  searchBar: {
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    width: "85%",
  },
  searchButtonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 33,
    height: 33,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  logoImage: {
    width: 35,
    height: 35,
    borderRadius: 10,
  },
});
