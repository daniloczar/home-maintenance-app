import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'
import { UserContext } from '../contexts/UserContext';
import { db, addDoc, collection } from 'firebase/firestore';

const JobPost = () => {
    const [jobId, setJobId] = useState(); // can be same as document id
    // job_id: jobs.length ? jobs[0].job_id + 1 : 1,
    const [completedAt, setcompletedAt] = useState(null); // default to 'null' serverTimestamp() Date.now()
    const [createdAt, setCreatedAt] = useState(null); // serverTimestamp() Date.now()
    const [jobTitle, setJobTitle] = useState();
    const [jobImgUrl, setJobImgUrl] = useState();
    const [jobDescription, setJobDescription] = useState();
    const [jobServiceCategoryName, setJobServiceCategoryName] = useState();
    const [jobMaxBudget, setJobMaxBudget] = useState();
    const [jobStatus, setJobStatus] = useState('Open'); // default to 'Open'
    const {user, setUser} = useContext(UserContext);

    const newJob = {
        completed_at: completedAt,
        created_at: createdAt,
        job_description: jobDescription,
        job_id: Date.now(),
        job_img_url: jobImgUrl,
        job_max_budget: jobMaxBudget,
        job_status: jobStatus,
        job_title: jobTitle,
        service_category_name: jobServiceCategoryName,
        user_id: user.user_id
    }

    const handlePostNewJob = async () => {
        const jobDocRef = await addDoc(collection(db, "jobs"), newJob)
    }

  return (
    <View>
        <TextInput
              style={styles.input}
              placeholder="Service category"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setJobServiceCategoryName(text)}
              value={jobServiceCategoryName}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
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
        <TextInput
              style={styles.input}
              placeholder="Job image"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setJobImgUrl(text)}
              value={jobImgUrl}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
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
      <Text>Post new Job</Text>
    </View>
  )
}

export default JobPost

const styles = StyleSheet.create({
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
      }
})