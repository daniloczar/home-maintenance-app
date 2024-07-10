import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { UserContext } from "../contexts/UserContext";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { app } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native"
import { Button } from "react-native-paper";
import Colors from "../Util/Colors";

const db = getFirestore(app)

const MyStuffServiceProvider = () => {
    const { user } = useContext(UserContext)
    const [bids,setBids] = useState([])
    const [clickedBid,setClickedBid] = useState(null)
    const navigation = useNavigation()
    
    useEffect(()=>{
        getJobsBiddedBySP()
    },[])
    
    const getJobsBiddedBySP = async () => {
        try {
            const bidsRef = collection(db, "bids")
            const bidsQuery = query(bidsRef, where("user_id", "==", user.user_id))
            const bidsSnapshot = await getDocs(bidsQuery)
    
            if (!bidsSnapshot.empty) {
                const bidsArray = bidsSnapshot.docs.map(doc => doc.data())
                const bidsPromise = (bidsArray.map(async (bid) => {
                    let bidStatus = bid.bid_status;         // from bids table
                    let bidCreatedAt = bid.created_at;      // from bids table
                    let bidAmount = bid.bid_amount;      // from bids table
                    let jobCreatedAt;                       // from jobs table
                    let jobDescription;                     // from jobs table
                    let serviceCategoryName;                // from jobs table
                    let jobImgURL;                          // from jobs table
                    let jobBudget;                          // from jobs table
                    let jobStatus;                          // from jobs table
                    let jobTitle;                           // from jobs table
                    let jobOwnerId;                         // from jobs table to get users info from users table
                    let jobOwnerName;                       // from users table
                    let jobOwnerImgURL;                     // from users table
                    let jobLocation                         // from users table

                    const jobsRef = collection(db, 'jobs')
                    const jobsQuery = query(jobsRef,where('job_id','==',bid.job_id))
                    const jobsSnapshot = await getDocs(jobsQuery)
                    if (!jobsSnapshot.empty) {
                        const jobsObj = jobsSnapshot.docs[0].data()
                        jobCreatedAt = jobsObj.created_at
                        jobDescription = jobsObj.job_description
                        serviceCategoryName = jobsObj.service_category_name
                        jobImgURL = jobsObj.job_img_url
                        jobBudget = jobsObj.job_max_budget
                        jobStatus = jobsObj.job_status
                        jobTitle = jobsObj.job_title
                        jobOwnerId = jobsObj.user_id
                    }
                    else{
                        console.log('No Job Found!')
                    }

                    const usersRef = collection(db, 'users')
                    const usersQuery = query(usersRef,where('user_id','==',jobOwnerId))
                    const usersSnapshot = await getDocs(usersQuery)
                    if (!usersSnapshot.empty) {
                        const usersObj = usersSnapshot.docs[0].data()
                        jobOwnerName = usersObj.full_name
                        jobOwnerImgURL = usersObj.user_img_url
                        jobLocation = usersObj.town
                    }
                    else{
                        console.log('No Job Found!')
                    }
                    return {
                        bidStatus,
                        bidCreatedAt,
                        bidAmount,
                        jobCreatedAt,
                        jobDescription,
                        serviceCategoryName,
                        jobImgURL,
                        jobBudget,
                        jobStatus,
                        jobTitle,
                        jobOwnerId,
                        jobOwnerName,
                        jobOwnerImgURL,
                        jobLocation
                    }
                }))
                const resolveBidsPromises = await Promise.all(bidsPromise)

                setBids(resolveBidsPromises)
            }
            else {
                console.log("You have not made any bids!")
            }
        }
        catch(err){
            console.log("Error getting Bids Document!")
        }
    }
    
    return (
        <ScrollView>
            {
                bids.length>0
                ?
                <View>
                    <View style={styles.jobs_edit_service}>
                        <Text style={styles.header}>My Jobs</Text>
                        <Pressable style={styles.btnContainer} onPress={()=>{navigation.navigate("ProviderCardSP", {userId: user.user_id})}}>
                            <Text style={styles.btn}>View My Service</Text>
                        </Pressable>
                    </View>
                    {bids.map((bid, index) => (
                        <View style={styles.container} >
                            <Pressable style={[  
                                    styles.job_list_details,
                                    {backgroundColor: clickedBid === index ? '#d3d3d3' : null }
                                ]} 
                                key={index}
                                onPressOut={() => {setClickedBid(null)}}
                                onPressIn={() => {
                                    setClickedBid(index)
                                    navigation.navigate("JobCardSPMyStuff",{
                                        jobDetails:bid
                                    })
                                }}
                            > 
                                <Image source={{uri: bid.jobImgURL}} style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 5,
                                    marginVertical: 5,
                                    marginRight: 8,
                                }} 
                                />
                                <View style={styles.title_status_location}>
                                    <Text style={styles.job_title}>{bid.jobTitle}</Text>
                                    <Text style={styles.bid_status}>Bid {bid.bidStatus}</Text>
                                    <Text style={styles.location}>At {bid.jobLocation}</Text>
                                </View>
                            </Pressable>
                        </View>
                    ))}
                </View>
                :
                <View style={[styles.loadingContainer, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#0d7002" />
                </View>
            }
        </ScrollView>
    );
};

export default MyStuffServiceProvider;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 50,
    },
    container:{
        maxHeight:'auto',
    },  
    location: {
        fontSize: 12,
        color: '#696969',
    },
    job_list_details:{
        flexDirection:'row',
        paddingVertical: 20,
        paddingHorizontal: 20,        
        borderBottomWidth:0.5,
        borderBottomColor: '#c7c7c7',
        borderRadius:2,
    },
    job_title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
    },
    title_status_location:{
        justifyContent:'space-evenly',
        padding: 5,
    },
    jobs_edit_service:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:30,
        paddingTop:30,
    },
    btn:{
        color:'white',
        borderRadius:10,
        paddingVertical:10,
        paddingHorizontal:15,
        fontWeight:'bold',
        backgroundColor:Colors.primary,
    },
    btnContainer: {
        borderRadius: 5,
        overflow: 'hidden',
        margin:5
    },
    header:{
        padding:10,
        fontWeight:'bold',
        fontSize:20,
    }
});
