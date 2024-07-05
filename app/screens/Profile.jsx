import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Avatar, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from "../contexts/UserContext";
import { getAuth, signOut } from "firebase/auth";
import { collection, query, getDocs, where, doc, setDoc } from "firebase/firestore";
import { app } from '../../FirebaseConfig'
import { getFirestore } from "firebase/firestore";
const db = getFirestore(app)

export default function Profile({navigate}) {
  const [isEditable, setIsEditable] = useState(false);
  const [profile, setProfile] = useState({});
  const { user } = useContext(UserContext);
  const [docId,setDocId] = useState(null)
  
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
  const handleEditToggle = async () => {
    console.log(isEditable)
    if(isEditable){
      await setDoc(doc(db, "users", docId), profile);
      Alert.alert('Profile Updated Successfully!')
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

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <IconButton
            icon={isEditable ? "check" : "pencil"}
            size={25}
            onPress={handleEditToggle}
          />
        </View>
        <View style={styles.avatarContainer}>
          <Avatar.Image size={200} source={{ uri: profile.user_img_url }} />
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
            onChangeText={(text) => handleChange('full_name', text)}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Phone:</Text>
          <TextInput
            style={[styles.input, isEditable && styles.editableInput]}
            editable={isEditable}
            value={profile.telephone}
            onChangeText={(text) => handleChange('telephone', text)}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>House No:</Text>
          <TextInput
            style={[styles.input, isEditable && styles.editableInput]}
            editable={isEditable}
            value={profile.house_number}
            onChangeText={(text) => handleChange('house_number', text)}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Street Name:</Text>
          <TextInput
            style={[styles.input, isEditable && styles.editableInput]}
            editable={isEditable}
            value={profile.street_name}
            onChangeText={(text) => handleChange('street_name', text)}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Post Code:</Text>
          <TextInput
            style={[styles.input, isEditable && styles.editableInput]}
            editable={isEditable}
            value={profile.postcode}
            onChangeText={(text) => handleChange('postcode', text)}
          />
        </View>
        {/* <View style={styles.field}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={[styles.input, isEditable && styles.editableInput]}
            editable={isEditable}
            value={profile.password}
            onChangeText={(text) => handleChange('password', text)}
            secureTextEntry={true}
          />
        </View> */}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  changePhotoText: {
    color: 'blue',
    marginTop: 10,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderBottomColor: '#ccc',
  },
  editableInput: {
    borderBottomColor: 'blue',
  },
});
