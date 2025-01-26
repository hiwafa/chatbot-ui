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
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from "axios";


const ChatUI = () => {

  const router = useRouter();

  const [messages, setMessages] = useState([
    { userId: 2, message: "Hallo, wie kann ich dir helfen?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const screenWidth = Dimensions.get("window").width;

  async function getRandomAnswer(questionText) {
    try {
      const response = await axios.get('http://localhost:8000/random_answer', {
        params: {
          question_text: questionText,
        },
      });

      if (response && response.data)
        setMessages((prevMessages) => [
          ...prevMessages,
          { userId: 2, message: response.data },
        ]);

    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
  }

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { userId: 1, message: newMessage },
    ]);
    getRandomAnswer(newMessage);
    setNewMessage("");
  };

  const renderMessage = ({ item }: { item: { userId: number; message: string } }) => {
    const isUser1 = item.userId === 2;
    return (
      <View style={[
        { flexDirection: 'row' },
        isUser1 ? { justifyContent: 'flex-start' } : { justifyContent: 'flex-end' }
      ]}>
        {
          isUser1 && <Image
            style={{ width: 40, height: 40, borderRadius: 20 }}
            source={require('@/assets/images/chatbotlogo.png')}
          />
        }
        <View
          style={[
            styles.messageContainer,
            isUser1 ? styles.leftMessage : styles.rightMessage,
            { maxWidth: screenWidth * 0.7 },
          ]}
        >
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
        {
          !isUser1 && <Image
            style={{ width: 40, marginLeft: 10, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#48ffa4' }}
            source={require('@/assets/images/boy.png')}
          />
        }
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        // Button Linear Gradient
        colors={['#141e3a', '#141e3a', '#141e3a']}
        style={{ width: 90, elevation: 3, alignItems: 'center', justifyContent: 'space-between', borderTopRightRadius: 40, borderBottomRightRadius: 40 }}>
        <View style={{
          width: 70, height: 70,
          borderRadius: 35,
          marginTop: 10,
          alignItems: 'center',
          gap: 20,
          backgroundColor: '#07426f',
          ...Platform.select({
            android: {
              elevation: 4,
            },
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            },
            web: {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            },
          }),
        }}>
          <Image
            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
            source={require('@/assets/images/chatbotlogo.png')}
          />
          <TouchableOpacity onPress={() => router.navigate("/dictionary")}>
            <MaterialCommunityIcons name="database-settings" size={35} color="#48ffa4" />
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 20, gap: 10, alignItems: 'center' }}>
          <Image
            style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#48ffa4' }}
            source={require('@/assets/images/boy.png')} />
          <AntDesign name="login" size={30} color="#48ffa4" />
        </View>

      </LinearGradient>
      <LinearGradient colors={['#07426f', '#141e3a', '#07426f']} style={{ flex: 1 }}>
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
    backgroundColor: '#07426f'
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
    // alignSelf: "flex-start",
    backgroundColor: "#07426f",
  },
  rightMessage: {
    // alignSelf: "flex-end",
    backgroundColor: "#01081b",
  },
  messageText: {
    fontSize: 18,
    color: "#48ffa4",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingLeft: 15,
    borderRadius: 30,
    backgroundColor: "#f9f9f9",
    margin: 20,
    marginBottom: 50
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
    backgroundColor: "#07426f",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#48ffa4",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChatUI;
