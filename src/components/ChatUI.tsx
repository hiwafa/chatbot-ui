import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const ChatUI = () => {
  const [messages, setMessages] = useState([
    { userId: 1, message: "How are you?" },
    { userId: 2, message: "I'm good, thank you!" },
    { userId: 1, message: "What about you?" },
    { userId: 2, message: "I'm doing great!" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const screenWidth = Dimensions.get("window").width;

  const handleSend = () => {
    if (newMessage.trim() === "") return; // Avoid adding empty messages
    setMessages((prevMessages) => [
      ...prevMessages,
      { userId: 1, message: newMessage },
    ]);
    setNewMessage("");
  };

  const renderMessage = ({ item }: { item: { userId: number; message: string } }) => {
    const isUser1 = item.userId === 2;
    return (
      <View
        style={[
          styles.messageContainer,
          isUser1 ? styles.leftMessage : styles.rightMessage,
          { maxWidth: screenWidth * 0.7 },
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        // Button Linear Gradient
        colors={['#141e3a', '#141e3a', '#07426f']}
        style={{ width: 90, elevation: 3, alignItems: 'center', justifyContent: 'space-between' }}>
        <Image
          style={{ width: 80, height: 80, marginTop: 20, borderRadius: 40 }}
          source={require('@/assets/images/chatbotlogo.png')}
        />
        <Ionicons name={'settings'} color='#48ffa4' size={35} style={{marginBottom: 15}}/>
      </LinearGradient>
      <LinearGradient colors={['#07426f', '#141e3a', '#141e3a']} style={{ flex: 1 }}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContent}
        />
        <LinearGradient colors={['#07426f', '#141e3a', '#141e3a']} style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  listContent: {
    flexGrow: 1,
    padding: 10,
    justifyContent: "flex-end",
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  leftMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e0f7fa",
  },
  rightMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#c8e6c9",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingLeft: 15,
    // borderWidth: 1,
    // borderColor: "#141e3a",
    // borderRadius: 40,
    borderTopRightRadius: 30,
    backgroundColor: "#f9f9f9",
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 0,
    outlineStyle: 'none',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#4caf50",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChatUI;
