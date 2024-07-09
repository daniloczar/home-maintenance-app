import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { UserContext } from "../contexts/UserContext";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { app } from "../../FirebaseConfig";

const db = getFirestore(app)

const MyStuffServiceProvider = () => {
    const { user } = useContext(UserContext)
    const [bids,setBids] = useState([])

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
    }//FYR9OWNI7tYOtDDQeusj68SxPwQ2

    return (
        <ScrollView>
            {
                bids.length>0
                ?
                <View>
                    {bids.map((bid, index) => (
                        <View key={index}>
                            <Text>{bid.jobOwnerName}</Text>
                        </View>
                    ))}
                </View>
                :
                <Text>No bids available.</Text>
            }
        </ScrollView>
    );
};

export default MyStuffServiceProvider;

const styles = StyleSheet.create({
    
});
