import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { addDoc, collection, doc, getDocs, getFirestore, query, serverTimestamp, setDoc, Timestamp, where } from "firebase/firestore";
import { app } from "../../../FirebaseConfig";
import { format } from "date-fns";
import Colors from "../../Util/Colors";
const db = getFirestore(app)
export default function JobCardSPJobs({ route }) {
  const {user}=useContext(UserContext)
  const { jobDetails } = route.params;
  const [bids,setBids] = useState([])
  const [bidAmount,setBidAmount] = useState('')
  const [hasBid,setHasBid] = useState(false)
  const [hasClickedMakeBid,setHasClickedMakeBid] = useState(false)
  const [wrongInput, setWrongInput] = useState(false)
  const [inputMsg,setInputMsg] = useState('')

  const navigation = useNavigation();
  useEffect(()=>{
    getUserBidOnJob()
  },[])
  const getUserBidOnJob = async () => {
    try{
      const bidSnapshot = await getDocs(query(collection(db,'bids'),where('job_id','==',jobDetails.jobId),where('user_id','==',user.user_id)))
      if(!bidSnapshot.empty){
        setHasBid(true)
        setBids([bidSnapshot.docs[0].data()])
      }
    }
    catch(err){
      console.log('error getting bid document!')
    }
  }
  if (!jobDetails) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>No job details available</Text>
      </SafeAreaView>
    );
  }
  const handleMakeBid = () => {
    if (hasBid){
      Alert.alert('1 bid allowed per job.\nYou already have a Bid!','Click OK to visit & edit/delete your bid',[
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'OK', 
          onPress: ()=>navigation.navigate('MyStuffScreen'),
        },
      ])
    }
    else{
      setHasClickedMakeBid(true)
    }
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

  const getNextBidId = async () => {
      const bidSnapshot = await getDocs(collection(db, 'bids'))
    let maxBidId = 0
    bidSnapshot.docs.forEach(doc => {
      const bidId = Number(doc.id)
      if (bidId > maxBidId) {
        maxBidId = bidId
      }
    })
    return (maxBidId + 1).toString()
  }
  const handlePlaceBid = async () => {
    if(!wrongInput){
      try {
        const newBidId = await getNextBidId()
        const newBidDocRef = doc(db, "bids", newBidId)
        const newBid = {
          job_id: jobDetails.jobId,
          user_id: user.user_id,
          bid_amount: Number(bidAmount),
          bid_status: 'Pending',
          created_at: Timestamp.now(),
          bid_id: newBidId
        }
        await setDoc(newBidDocRef, newBid)
        setBids([newBid])
        setHasBid(true)
        setHasClickedMakeBid(false)
        Alert.alert('Bid placed successfully', `Bid Amount: £${bidAmount}`)
      }
      catch (err) {
        console.error("Error updating bid:", err)
      }
    }
  }
  return (
    <ScrollView style={{ height: "100%" }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Job Details</Text>
      </View>
      <View style={{ position: "relative" }}>
        <TouchableOpacity style={styles.backBnt} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-undo-sharp" size={24} color="#474747" />
        </TouchableOpacity>
        <Image source={{ uri: jobDetails.jobImgURL }} style={{ width: "100%", height: 300 }} />
      </View>
      <View style={styles.container}>
        <View style={styles.headerCard}>
          <View style={styles.textHeader}>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>{jobDetails.jobTitle}</Text>
            <Text style={{ fontSize: 18 }}>{jobDetails.serviceCategoryName}</Text>
            <Text style={{ fontSize: 18 }}>Max Budget: £{jobDetails.jobBudget}</Text>
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
          <Text style={{ fontSize: 13 }}>{jobDetails.jobDescription}</Text>
        </View>
      </View>
      <View
        style={{
          borderWidth: 0.6,
          borderColor: "grey",
          marginBottom: 15,
          width: 390,
          marginLeft: 20,
        }}
      ></View>
      {
        bids.length>0 
        ? 
        <View style={styles.bidBox}>
          <Text style={styles.bidTitle}>Your Bid</Text>
          <Text style={styles.bidText}>Bid Status:     {bids[0].bid_status}</Text>
          <Text style={styles.bidText}>Bid Amount:  £{bids[0].bid_amount}</Text>
          <Text style={styles.bidText}>Bid Date:       {bids[0].created_at.toDate().toLocaleDateString()}</Text>
        </View>
        :
        !hasClickedMakeBid && !hasBid ? <Text style={styles.noBidText}>You have not made any bid yet.</Text> : null
      }
      {
        hasClickedMakeBid && !hasBid 
        ?
        <>
        <Text style={styles.inputBidText}>Your Bid</Text>
          <TextInput
            style={styles.bidInput}
            placeholder="Enter Bid Amount"
            keyboardType="numeric"
            value={bidAmount}
            onChangeText={handleChange}
          />
          <View>
            {wrongInput?<Text style={styles.inputInfo}>{wrongInput?`${inputMsg}`:null}</Text>:null}
          </View>
        </>
        :
        null
      }
      {
        !hasClickedMakeBid
        ?
        <TouchableOpacity style={styles.makeBidButton} onPress={handleMakeBid}>
          <Text style={styles.makeBidButtonText}>Make a Bid</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity style={styles.makeBidButton} onPress={handlePlaceBid}>
          <Text style={styles.makeBidButtonText}>Place Bid</Text>
        </TouchableOpacity>
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  container: {
    padding: 20,
  },
  bidAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'flex-start',
    marginHorizontal:20,
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
  jobDetails: {
    flex: 1,
    justifyContent: "center",
  },
  jobContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "pink",
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 5,
  },
  jobStatus: {
    fontSize: 14,
    color: "#777",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  bidBox: {
    backgroundColor: "#f2f2f2",
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
  makeBidButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  makeBidButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  noBidText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    marginVertical: 5,
  },
  bidInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 6,
    marginHorizontal: 20,
    fontSize: 16,
  },
  inputBidText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
    marginHorizontal:20,
  },
  inputInfo:{
    marginHorizontal:20,
    marginVertical:5,
    color:'red',
  },

});
