import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Avatar, IconButton } from 'react-native-paper';
// import * as ImagePicker from 'expo-image-picker';

export default function Profile({navigate}) {
  const [isEditable, setIsEditable] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Home Maint',
    phone: '077777777',
    address: 'Home Maint St, Home Kingdom',
    password: 'ucantsee',
    image: 'https://via.placeholder.com/200',
  });

  const handleEditToggle = () => {
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
      setProfile({ ...profile, image: pickerResult.uri });
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <IconButton
            icon={isEditable ? "check" : "pencil"}
            size={20}
            onPress={handleEditToggle}
          />
        </View>
        <View style={styles.avatarContainer}>
          <Avatar.Image size={200} source={{ uri: profile.image }} />
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
            value={profile.name}
            onChangeText={(text) => handleChange('name', text)}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Phone:</Text>
          <TextInput
            style={[styles.input, isEditable && styles.editableInput]}
            editable={isEditable}
            value={profile.phone}
            onChangeText={(text) => handleChange('phone', text)}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Address:</Text>
          <TextInput
            style={[styles.input, isEditable && styles.editableInput]}
            editable={isEditable}
            value={profile.address}
            onChangeText={(text) => handleChange('address', text)}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={[styles.input, isEditable && styles.editableInput]}
            editable={isEditable}
            value={profile.password}
            onChangeText={(text) => handleChange('password', text)}
            secureTextEntry={true}
          />
        </View>
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
