import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import SevicesList from "./ServicesList";
import { UserContext } from "../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import JobsList from "../screens/JobsList"
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../FirebaseConfig";

const Jobs = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [allServicesProviders, setAllServicesProviders] = useState([]);
  const [allJobsProviders, setAllJobsProviders] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [sortByCategory, setSortByCategory] = useState([]);

const servicesData = async () => {
  const db = getFirestore(app);
  const servicesRef = collection(db, "users");
  const service = query(
    servicesRef,
    where("user_type", "==", "service_provider")
  );
  const serviceData = await getDocs(service);
  const servicesProviderList = serviceData.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  setAllServicesProviders(servicesProviderList);
};

const CategoriesData = async () => {
  const db = getFirestore(app);
  const categoriesRef = collection(db, "service_categories");
  const categoriesData = await getDocs(categoriesRef);
  const categoriesList = categoriesData.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  setAllCategories(categoriesList);
};

const jobsData = async () => {
  const db = getFirestore(app);
  const jobsRef = collection(db, "jobs");
  const jobsData = await getDocs(jobsRef);
  const jobsProviderList = jobsData.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  setAllJobsProviders(jobsProviderList);
};

useEffect (()=>{
  servicesData()
  jobsData()
  CategoriesData()
  fetchByCategory();
},[category]) 

const ServiceProviderJobList = () =>{
  return(<>
      <View >
        <Text >Jobs Available</Text>
      </View>
      <View>
        <FlatList

          data={
            category?sortByCategory:allJobsProviders
          }
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View>
              <JobsList item={item} />
            </View>
          )}
        />
      </View> </>)
  
}

const HomeProviderJobList = () =>{
  return (
    <>
      <View style={styles.categoryText}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Services</Text>
      </View>
      <View style={styles.ImageContainerProviders}>
        <FlatList
          data={category ? sortByCategory : allServicesProviders}
          numColumns={2}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View>
              <SevicesList item={item} />
            </View>
          )}
        />
      </View>
    </>
  );
}

const fetchByCategory = async () => {
  const db = getFirestore(app);
  const categoryRef = collection(db, "jobs");
  const categoryQuery = query(
    categoryRef,
    where("service_category_name", "==", category)
  );
  const categoryData = await getDocs(categoryQuery);
  const categoryList = categoryData.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  setSortByCategory(categoryList)
};


  return (
    <View>
      <View>
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../assets/Images/toggleMap.png")}
            style={{ width: 30, height: 30 }}
          />

          <Text
            style={{ fontSize: 18, color: "blue" }}
            onPress={() => {
              navigation.navigate("Map");
            }}
          >
            Toggle Map
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.categoryText}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Categories</Text>
      </View>
      <View style={styles.ImageContainer}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={allCategories}
          scrollEnabled={true}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.container}
              onPress={() => {
                setCategory(item.service_category_name);
              }}
            >
              <Image source={{uri: item.service_category_img}} style={styles.Images} />
              <Text style={{ fontSize: 13, marginTop: 5 }}>
                {item.service_category_name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <Text>
        {user.user_type === "service_provider" ? (
          <ServiceProviderJobList />
        ) : (
          <HomeProviderJobList />
        )}
      </Text>
    </View>
  );
};

export default Jobs;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    margin: 5,
    width: 110,
  },
  categoryText: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  Images: {
    width: 60,
    height: 50,
    margin: 2,
    backgroundColor: "white",
    borderRadius: 5,
  },
  ImageContainer: {
    display: "flex",
    paddingLeft: 5,
    paddingRight: 5,
  },

});
