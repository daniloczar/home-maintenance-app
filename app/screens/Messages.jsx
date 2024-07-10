import React, { useState, useLayoutEffect, useCallback } from 'react';
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { addDoc, getFirestore, onSnapshot, query, collection, where, orderBy } from "firebase/firestore";
import { app } from '../../FirebaseConfig';
import { IconButton } from 'react-native-paper';
import { Ionicons } from "@expo/vector-icons";

const db = getFirestore(app);

const Messages = ({ route, navigation }) => {
  const { chatId, sentTo, sent_by_user_id, sent_to_user_id, sentByUserImgUrl, sentToUserImgUrl } = route.params;
  // console.log()
  // console.log(route.params.sentToUserImgUrl)
  // console.log(route.params.sentByUserImgUrl)

  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    const messagesRef = query(
      collection(db, 'messages'),
      where("chat_id", "==", chatId),
      orderBy('created_at', 'desc')
    );

    const unsubscribe = onSnapshot(
      messagesRef,
      (snapshot) => {
        setMessages(snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            _id: doc.id,
            chat_id: data.chat_id,
            created_at: data.created_at ? data.created_at.toDate() : new Date(),
            text: data.message_text,
            message_id: data.message_id,
            sent_by_user_id: data.sent_by_user_id,
            sent_to_user_id: data.sent_to_user_id,
            user: {
              _id: data.sent_by_user_id,
              avatar: data.sent_by_user_id===sent_by_user_id?sentByUserImgUrl:sentToUserImgUrl,
            },
          };
        }));
      },
      (error) => {
        console.error("Error fetching messages: ", error);
      }
    );

    return () => unsubscribe();
  }, [chatId]);

  const renderBubble = (props) => {
    const isSentByUser = props.currentMessage.user._id === sent_by_user_id;

    return (
      <View style={[styles.messageContainer, isSentByUser ? styles.sentMessageContainer : styles.receivedMessageContainer]}>
        <Bubble
          {...props}
          wrapperStyle={{
            left: styles.receivedBubble,
            right: styles.sentBubble,
          }}
          textStyle={{
            left: styles.receivedMessageText,
            right: styles.sentMessageText,
          }}
        />
      </View>
    );
  };

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
  
    const newMessage = messages[0]; 

    const messagesRef = collection(db, 'messages');
    addDoc(messagesRef, {
      chat_id: chatId,
      created_at: newMessage.createdAt,
      message_text: newMessage.text,
      sent_by_user_id: newMessage.user._id,
      sent_to_user_id: sent_to_user_id,
    }).catch(error => {
      console.error("Error adding message: ", error);
    });
  
  }, [chatId, sent_to_user_id]);
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.chatHeader}>
        <Text style={styles.chatHeaderText}>Chat with {sentTo}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backBnt}
        onPress={() => navigation.navigate('Chats')}
      >
        <Ionicons name="arrow-undo-circle" size={28} color="#6759FF" />
      </TouchableOpacity>

      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: sent_by_user_id,
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        showUserAvatar
        renderSend={(props) => (
          <Send {...props}>
            <View style={styles.sendingContainer}>
              <IconButton icon="send-circle" size={32} color="#6646ee" />
            </View>
          </Send>
        )}
      />
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 0.2,
    color: 'black',
  },
  chat: {
    color: 'blue',
  },
  userNameText: {
    fontSize: 12,
    color: 'grey',
  },
  messageContainer: {
    marginBottom: 8,
  },
  sentMessageContainer: {
    alignSelf: 'flex-end',
    marginRight: 8,
  },
  receivedMessageContainer: {
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  sentBubble: {
    backgroundColor: '#DCF8C6',
    padding: 8,
    borderRadius: 8,
  },
  receivedBubble: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
  },
  sentMessageText: {
    fontSize: 16,
    color: 'black',
  },
  receivedMessageText: {
    fontSize: 16,
    color: 'black',
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 5,
  },
  backButton: {
    marginLeft: 10,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 18,
  },
  header: {
    backgroundColor: '#f8f8f8',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
  },
  chatHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});