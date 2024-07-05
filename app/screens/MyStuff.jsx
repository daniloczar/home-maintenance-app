import React, { useState, useEffect, useContext } from "react";
import { Pressable, StyleSheet, Text, View, FlatList, Image } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { app } from "../../FirebaseConfig";
import { UserContext } from "../contexts/UserContext";
const db = getFirestore(app);

const MyStuff = () => {
  const [allJobs, setAllJobs] = useState([]);
  const { user } = useContext(UserContext);

  const fetchAllJobs = async () => {
    try {
      const q = query(collection(db, "jobs"), where("user_id", "==", user.user_id));
      const querySnapshot = await getDocs(q);

      const jobsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(user);
      console.log(user.uid);

      setAllJobs(jobsList);
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Jobs</Text>

      <Pressable style={styles.button} onPress={() => console.log("Post A Job pressed")}>
        <Text style={styles.buttonText}>Post A Job</Text>
      </Pressable>

      <FlatList
        data={allJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
         console.log(item.job_img_url),

          <View style={styles.jobContainer}>
            <Image source={{ uri: item.job_img_url }} style={styles.jobImage} />
            <View style={styles.jobDetails}>
              <Text style={styles.jobTitle}>{item.job_title}</Text>
              {/* <Text style={styles.jobDescription}>{item.job_description}</Text> */}
              {/* <Text style={styles.serviceCategory}>{item.service_category_name}</Text> */}
              <Text style={styles.jobStatus}>Job Status: {item.job_status}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No jobs found.</Text>}
      />
      
    </View>
    
  );
};
//please work now!!!
export default MyStuff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
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
  jobImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: "#ddd",
  },
  jobDetails: {
    flex: 1,
    justifyContent: "center",
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  jobDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  serviceCategory: {
    fontSize: 14,
    color: "#444",
    marginBottom: 3,
  },
  jobStatus: {
    fontSize: 14,
    color: "#777",
  },
});
