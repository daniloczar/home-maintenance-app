import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { getFirestore, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { app } from "../../FirebaseConfig";
import { Avatar } from 'react-native-paper';
import { differenceInHours, differenceInSeconds, differenceInMinutes, differenceInDays, format, parseISO } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";

const db = getFirestore(app);

const Chats = ({ navigation, route }) => {
  const [chats, setChats] = useState([]);
  const [clickedChat, setClickedChat] = useState([]);
  const { user } = useContext(UserContext);
  useFocusEffect(
    React.useCallback(() => {
      getChats()
    }, [])
  )
  const getChats = async () => {
    try {
      const chatsRef = collection(db, "chats")
      let chatsQuery;
      if(user.user_type==='householder'){
        chatsQuery = query(chatsRef, where("sent_by_user_id", "==", user.user_id), orderBy("created_at", "desc"))
      }
      else if(user.user_type==='service_provider'){
        chatsQuery = query(chatsRef, where("sent_to_user_id", "==", user.user_id), orderBy("created_at", "desc"))
      }
      const chatsSnapshot = await getDocs(chatsQuery)

      if (!chatsSnapshot.empty) {
        const chatsArray = chatsSnapshot.docs.map(doc => doc.data())
        
        const updatedChats = await Promise.all(chatsArray.map(async (chat) => {
          const userRef = collection(db, "users")
          let userQuery;
          if(user.user_type==='householder'){
            userQuery = query(userRef, where('user_id', '==', chat.sent_to_user_id))
          }
          else if(user.user_type==='service_provider'){
            userQuery = query(userRef, where('user_id', '==', chat.sent_by_user_id))
          }
          const userSnapshot = await getDocs(userQuery)

          let sentToUserImgUrl = ''
          let sentToUserName = ''
          if (!userSnapshot.empty) {
            sentToUserImgUrl = userSnapshot.docs[0].data().user_img_url
            sentToUserName = userSnapshot.docs[0].data().full_name
          }

          const msgRef = collection(db, 'messages')
          const msgQuery = query(msgRef, where('chat_id', '==', chat.chat_id), orderBy('created_at', 'desc'), limit(1))
          const msgSnapshot = await getDocs(msgQuery)

          let lastMsg = ''
          let lastSent = null
          let lastMsgSentByUserId = ''
          if (!msgSnapshot.empty) {
            const lastMessage = msgSnapshot.docs[0].data()
            lastMsg = lastMessage.message_text
            lastMsgSentByUserId = lastMessage.sent_by_user_id
            lastSent = lastMessage.created_at.toDate().toISOString()
          }

          return {
            ...chat,
            last_msg: lastMsg,
            last_sent: lastSent,
            sent_to_user_img_url: sentToUserImgUrl,
            sent_to_user_name: sentToUserName,
            last_msg_sent_by_user_id: lastMsgSentByUserId
          }
        }))

        setChats(updatedChats)
      } else {
        console.log("No such chat document!")
      }
    } catch (err) {
      console.log("Error getting chats document", err)
    }
  }
  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      console.error('Date string is undefined or null')
      return 'ND'
    }
    
    const currentDateTime = new Date()
    const LastSentDateTime = parseISO(dateTime)
    const secondsDifference = differenceInSeconds( currentDateTime, LastSentDateTime )
    const minutesDifference = differenceInMinutes(currentDateTime, LastSentDateTime)
    const hoursDifference = differenceInHours( currentDateTime, LastSentDateTime )
    const daysDifference = differenceInDays(currentDateTime, LastSentDateTime)
    

    if (secondsDifference < 60) {
      return secondsDifference===1 ? '1 second ago' : `${secondsDifference} seconds ago`
    }

    if (minutesDifference < 60) {
      return minutesDifference===1 ? '1 minute ago' : `${minutesDifference} minutes ago`
    }

    if (hoursDifference < 24) {
      return hoursDifference===1 ? '1 hour ago' : `${hoursDifference} hours ago`
    }

    if (daysDifference === 1) {
      return 'Yesterday'
    } else if (daysDifference < 7) {
      return `${daysDifference} days ago`
    } else {
      return format(LastSentDateTime, 'dd MMM yyyy')
    }
  }
  return (
    <View>
      {
        chats.length === 0
          ? <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" color="#0d7002" />
            </View>
          : <View style={styles.container}>
              {chats.map((chat, index) => (
                <Pressable 
                  key={index} 
                  style={[
                    styles.chatContainer,
                    { backgroundColor: clickedChat === chat.chat_id ? '#d3d3d3' : '#fff' },
                  ]}
                  onPressIn={() => setClickedChat(chat.chat_id)}
                  onPressOut={() => setClickedChat(null)}
                  onLongPress={() => setClickedChat(null)}
                  onPress={() => {
                    setClickedChat(chat.chat_id);
                    navigation.navigate('Messages', {chatId : chat.chat_id, sentTo : chat.sent_to_user_name, sent_by_user_id : chat.sent_by_user_id, sent_to_user_id : chat.sent_to_user_id})
                  }}
                >
                  <Avatar.Image style={styles.avatar} size={50} source={{ uri: chat.sent_to_user_img_url }} />
                  <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                      <Text style={styles.userName}>{chat.sent_to_user_name}</Text>
                      <Text style={styles.dateTime}>{formatDateTime(chat.last_sent)}</Text>
                    </View>
                    <Text style={styles.lastMessage}>
                      {user.user_id===chat.last_msg_sent_by_user_id ? 'You: ' : null}
                      {chat.last_msg}
                    </Text>
                  </View>
                </Pressable>
              ))}
          </View>
      }
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 50,
  },
  chatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  chatContent: {
    flex: 1,
    marginLeft: 10,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateTime: {
    fontSize: 12,
    color: '#696969',
  },
  lastMessage: {
    fontSize: 14,
    color: '#454545',
    marginTop: 2,
  },
});