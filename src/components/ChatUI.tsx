import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";

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
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    // borderTopWidth: 1,
    // borderTopColor: "#ccc",
    padding: 10,
    // backgroundColor: "#fff",

    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 50,
    marginHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  textInput: {
    flex: 1,
    height: 40,
    // borderWidth: 1,
    // borderColor: "#ccc",
    // borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    // backgroundColor: "#f9f9f9",
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
