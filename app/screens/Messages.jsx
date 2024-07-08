import React, { useState, useCallback, useLayoutEffect } from 'react';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { Text, View, StyleSheet } from 'react-native';
import { getFirestore, onSnapshot, getDocs, query, collection, where, orderBy } from "firebase/firestore";
import { app } from '../../FirebaseConfig';
const db  = getFirestore(app)

const Messages = ({ navigation }) => {
  const [messages, setMessages] = useState([]);

  useLayoutEffect(()=>{
    const messagesRef = query(collection(db, 'messages'), orderBy('created_at', 'desc'));
    console.log()
    console.log()
    console.log("MESSAGES QUERYYY")
    // console.log(messages)
    console.log()
    console.log()
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => setMessages(
      snapshot.docs.map(doc => ({
        chat_id: doc.data().chat_id,
        created_at: new Date(doc.data().created_at),
        message_text: doc.data().message_text,
        message_id: doc.data().message_id,
        sent_by_user_id: doc.data().sent_by_user_id,
        sent_to_user_id: doc.data().sent_to_user_id,
      }))
    ));
  },[])

  const onSend = useCallback((newMessages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  }, []);

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon="send-circle" size={32} color="#6646ee" />
        </View>
      </Send>
    );
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        style={styles.chat}
        showAvatarForEveryMessage={true}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
};

export default Messages

const styles = StyleSheet.create({
  container: {
    borderColor:'black',
    borderWidth:2,
    flex: 1,
    backgroundColor:'pink',
    color:'black',
    // height:2,
  },
  chat:{
    // height:20,
    color:'blue',
  }
});
