import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../../../FirebaseConfig";

const db = getFirestore(app)

export default function JobCardSPMyStuff({ route }) {
  const { jobDetails } = route.params
  const navigation = useNavigation()
  const [editing, setEditing] = useState(false)
  const [bidAmount, setBidAmount] = useState(jobDetails.bidAmount)
  const [wrongInput, setWrongInput] = useState(false)
  const [inputMsg,setInputMsg] = useState('')

  if (!jobDetails) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>No job details available</Text>
      </SafeAreaView>
    )
  }
  const handleEdit = () => {
    setEditing(true)
  }

  const handleDeletion = async () => {
    try {
      const bidDocRef = doc(db, "bids", jobDetails.bidId)
      await deleteDoc(bidDocRef)
      navigation.goBack()
    } 
    catch (err) {
      console.error("Error deleting bid:", err)
    }
  }

  const confirmDeletion = () => {
    Alert.alert('Are you sure you want to Delete your Bid?', 'You will lose your current bid by clicking ok.', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'OK', 
        onPress: handleDeletion,
      },
    ]);
  }
  const handleSave = async () => {
    if(!wrongInput){
      try {
        const bidDocRef = doc(db, "bids", jobDetails.bidId)
        await updateDoc(bidDocRef, {
          bid_amount: Number(bidAmount),
        });
        jobDetails.bidAmount = bidAmount
        setEditing(false)
        Alert.alert('Bid amount updated successfully',`New Bid Amount: £${bidAmount}`)
      } 
      catch (err) {
        console.error("Error updating bid:", err)
      }
    }
  }

  const handleCancel = () => {
    setInputMsg('')
    setEditing(false)
    setBidAmount(jobDetails.bidAmount)
    setWrongInput(false)
  }

  const handleChange = (input) => {
    setBidAmount(input)
    if(Number(input)<=0){
      setInputMsg('Amount should be greater than 0!')
      setWrongInput(true)
    }
    else if(!/^\d+$/.test(input)){
      setInputMsg('Only Numbers Allowed!')
      setWrongInput(true)
    }
    else{
      setWrongInput(false)
      setInputMsg('')
    }
  }

  return (
    <ScrollView style={{ height: '100%' }} >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Job Details</Text>
      </View>
      <View style={{position:'relative'}}>
        <TouchableOpacity
          style={styles.backBnt}
          onPress={() => navigation.navigate('MyStuff')}
        >
          <Ionicons name="arrow-undo-sharp" size={24} color="#474747" />
        </TouchableOpacity>
        <Image
          source={{ uri: jobDetails.jobImgURL }}
          style={{ width: "100%", height: 300 }}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.headerCard}>
          <View style={styles.textHeader}>
                <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                  {jobDetails.jobTitle}
                </Text>
                <Text style={{ fontSize: 18 }}>{jobDetails.serviceCategoryName}</Text>
                <Text style={{ fontSize: 18 }}>
                  Max Budget: £{jobDetails.jobBudget}
                </Text>
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
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Description
          </Text>
            <Text style={{ fontSize: 13 }}>{jobDetails.jobDescription}</Text>
        </View>
      </View>
      <View style={{ borderWidth: 0.6, borderColor: "grey", marginBottom: 15, width:390, marginLeft:20 }}></View>
      <View style={styles.bidBox}>
        <View style={styles.bidHeader}>
          <Text style={styles.bidTitle}>My Bid Status</Text>
          { jobDetails.bidStatus === 'Pending' ? 
            <>
              {editing ? (
                <View style={styles.editButtons}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <MaterialIcons name="done" size={20} color="green" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <MaterialIcons name="clear" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.editButtons}>
                  <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <MaterialIcons name="edit" size={20} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={confirmDeletion}>
                    <MaterialIcons name="delete" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              )}
            </>
            : null
          }
        </View>
        <Text style={styles.bidText}>Bid Status: {jobDetails.bidStatus}</Text>
        <View style={styles.bidAmountContainer}>
          <Text style={styles.bidText}>Bid Amount: £</Text>
          {editing ? (
            <TextInput
              style={styles.bidInput}
              value={String(bidAmount)}
              onChangeText={handleChange}
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.bidText}>{bidAmount} </Text>
          )}
          <Text style={styles.inputInfo}>{wrongInput?`${inputMsg}`:null}</Text>
        </View>
        <Text style={styles.bidText}>Bid Date: {jobDetails.bidCreatedAt.toDate().toLocaleDateString()}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
  },
  inputInfo:{
    color:'red'
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
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  bidBox: {
    backgroundColor: '#f2f2f2',
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
  bidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bidTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bidText: {
    fontSize: 14,
  },
  bidAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidInput: {
    borderWidth:1,
    borderColor:'black',
    borderRadius:4,
    paddingHorizontal:5,
    width: 'auto',
    marginRight: 10,
  },
  editButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButton: {
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  cancelButton: {
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});


