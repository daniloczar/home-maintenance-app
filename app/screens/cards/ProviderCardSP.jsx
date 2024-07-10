import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { collection, getDocs, getFirestore, where, query } from "@firebase/firestore";
import { app } from "../../../FirebaseConfig";
const db = getFirestore(app);

export default function ProviderCardSP({route}) {
  const navigation = useNavigation();
  const { userId } = route.params;
  const [item, setItem] = useState({});
  
  useEffect(() => {
    getServiceByUserId()
  }, []);

  const getServiceByUserId = async() => {
    try {
      const serviceRef = collection(db, "services")
      const q = query(serviceRef, where('user_id', '==', userId))
      const serviceSnapShot = await getDocs(q)
      setItem(serviceSnapShot.docs[0].data())
    } catch (error) {
    }
  }

  return (
    <View>
      <View style={styles.mainContainer}>
        <ScrollView>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              style={styles.backBnt}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-undo-sharp" size={24} color="#474747" />
            </TouchableOpacity>
            <Image
              source={{ uri: item.service_img_url }}
              style={{ width: "100%", height: 300 }}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.headerCard}>
              <View style={styles.textHeader}>
                <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                  {item.full_name}
                </Text>
                <Text style={{ fontSize: 18 }}>{item.service_title}</Text>
              </View>
              <TouchableOpacity>
                <AntDesign name="edit" size={24} color="black" />
              </TouchableOpacity>
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
              <Text style={{ fontSize: 13 }}>{item.service_description}</Text>
            </View>
            <View
              style={{
                borderWidth: 0.7,
                borderColor: "grey",
                marginBottom: 15,
              }}
            ></View>
            <View>
              <Text
                style={{ fontSize: 15, fontWeight: "bold", marginBottom: 5 }}
              >
                Gallery
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <Image
                  source={{
                    uri: item.service_img_url_before,
                  }}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 5,
                    marginBottom: 8,
                    marginRight: 8,
                  }}
                />
                <Image
                  source={{
                    uri: item.service_img_url_after,
                  }}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 5,
                    marginBottom: 8,
                  }}
                />
              </ScrollView>
            </View>
            <View
              style={{
                borderWidth: 0.7,
                borderColor: "grey",
                marginBottom: 15,
              }}
            ></View>
            <View style={styles.descriptionBox}>
              <Text
                style={{ fontSize: 15, fontWeight: "bold", marginBottom: 3 }}
              >
                Review
              </Text>
              <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
                <FontAwesome name="star" size={13} color="#edd902" />
                <FontAwesome name="star" size={13} color="#edd902" />
                <FontAwesome name="star" size={13} color="#edd902" />
                <FontAwesome name="star" size={13} color="#edd902" />
                <FontAwesome name="star-o" size={13} color="black" />
              </View>
              <Text style={{ marginTop: 6 }}>
                {/* {cardData[image].review_description} */}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
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
  mainContainer: {
    marginLeft: -3,
    marginRight: -3,
  },

});
