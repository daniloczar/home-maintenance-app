import { FlatList, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from "@expo/vector-icons";
import CalendarPicker from "react-native-calendar-picker";
import {addDoc, collection, getFirestore, serverTimestamp} from "firebase/firestore";
import { app } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";


export default function BookingModal({ handleHideModal, navigate}) {

    const [timeList, setTimeList] = useState()
    const [selectedTime, setSelectedTime] = useState()
    const [selectedDate, setSelectedDate] = useState()
    const [note, setNote] = useState('')
    const navigation = useNavigation();
  

    useEffect(()=>{
        getTime()
    },[])

    const getTime = () => {
        const timeList = []
        for (let i=8; i<=12; i++){
            timeList.push({
                time: i + ':00 AM'
            })
            timeList.push({
              time: i + ":30 AM",
            });
        }
        for (let i = 1; i <= 7; i++) {
          timeList.push({
            time: i + ":00 PM",
          });
          timeList.push({
            time: i + ":30 PM",
          });
        }
        setTimeList(timeList)
    }

    const handleConfirmBooking = async () => {
      const db = getFirestore(app);

      if (selectedDate && selectedTime) {
        const booking = {
          date: selectedDate.toString(),
          time: selectedTime,
          note: note,
          createdAt: serverTimestamp(),
        };

        try {
          const bookings = await collection(db,"bookings");
          await addDoc(bookings, booking);
          alert("Booking confirmed!");
          handleHideModal();
        } catch (error) {
          console.error("Error adding document: ", error);
          alert("Error confirming booking. Please try again.");
        } finally {
          navigation.navigate("JobPage");
        }
      } else {
        alert("Please select a date and time.");
      }
      
    };

  return (
    <SafeAreaView>
      <ScrollView style={styles.mainContainer}>
        <KeyboardAvoidingView>
          <View style={{ marginBottom: 60 }}>
            <TouchableOpacity style={styles.backBnt} onPress={handleHideModal}>
              <Ionicons name="arrow-undo-sharp" size={24} color="#474747" />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Select Date</Text>
          <View style={styles.container}>
            <CalendarPicker
              onDateChange={setSelectedDate}
              minDate={Date.now()}
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 15,
              marginTop: 15,
            }}
          >
            Select Time Slot
          </Text>
          <View>
            <FlatList
              data={timeList}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() => setSelectedTime(item.time)}
                >
                  <Text
                    style={[
                      selectedTime == item.time
                        ? styles.selectedTime
                        : styles.unSelectedTime,
                    ]}
                  >
                    {item.time}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 15,
              marginTop: 15,
            }}
          >
            Notes:
          </Text>
          <View>
            <TextInput
              placeholder="Notes"
              numberOfLines={4}
              maxLength={40}
              multiline={true}
              style={styles.notes}
              onChangeText={(text) => setNote(text)}
            />
          </View>
          <View style={{ marginTop: 15 }}>
            <TouchableOpacity onPress={handleConfirmBooking}>
              <Text style={styles.confirmBnt}>Confirm Booking</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBnt: {
    position: "absolute",
    top: 10,
    zIndex: 10,
    backgroundColor: "#f2f2f2",
    padding: 5,
    borderRadius:50,
  },
  container: {
    marginTop: 10,
  },
  mainContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
  unSelectedTime: {
    padding: 10,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  selectedTime: {
    backgroundColor: "lightgray",
    padding: 10,
    borderWidth: 1,
    borderColor: "lightGray",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  notes:{
    borderWidth:1,
    textAlignVertical:'top',
    padding:15,
    height:100
  },
  confirmBnt: {
    backgroundColor: "blue",
    textAlign:'center',
    color:'white',
    padding:10,
    fontSize:17,
    elevation:2,
    borderRadius:5,
  },
});