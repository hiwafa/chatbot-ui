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
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "../context/UserContext";
import { addUser } from "../api/api-request";
import { apiUrl } from "../api/api-request";

const ChatUI = () => {

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, storeUserInfo } = useUser();

  const [messages, setMessages] = useState<any>([]);

  const [newMessage, setNewMessage] = useState("");
  const [userIdText, setUserIdText] = useState("");
  const [userFirstNameText, setUserFirstNameText] = useState("");
  const [userLastNameText, setUserLastNameText] = useState("");
  const [warningText, setWarningText] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  async function getRandomAnswer(questionText) {
    try {
      const response = await axios.get(`${apiUrl}/random_answer`, {
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
      setMessages((prevMessages) => [
        ...prevMessages,
        { userId: 2, message: "Sorry!!!!, Für diese Frage gibt es keine Antwort" },
      ]);
      console.error('Error fetching question:', error);
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

  const handleSignup = async () => {
    if (userIdText && userFirstNameText && userLastNameText) {
      const user_info = {
        user_id: userIdText,
        user_role: 'viewer',
        user_first_name: userFirstNameText,
        user_last_name: userLastNameText,
        user_about: "",
        user_image: "",
        user_date_of_birth: ""
      };
      const response = await addUser(user_info);

      if (response === 200) {
        storeUserInfo(user_info);
        setUserIdText("");
        setUserFirstNameText("");
        setUserLastNameText("");
        setLoginModalVisible(false);
      } else {
        setWarningText(response)
      }

    }
  }

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
            { maxWidth: screenWidth * 0.55 },
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
    <View style={[styles.container, Platform.OS === 'ios' ? { marginTop: insets.top, marginBottom: insets.bottom } : {}]}>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <LinearGradient colors={['#07426f', '#07426f', '#141e3a']} style={styles.modalContainer}>

            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={{ position: 'absolute', top: 10, right: 10 }}>
              <FontAwesome name="close" size={24} color="#48ffa4" />
            </TouchableOpacity>

            <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "#48ffa4" }}>
        Chatbot Overview
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 10, color: "#48ffa4" }}>
        Our chatbot is a responsive program designed to answer questions quickly and efficiently. 
        It can handle multiple queries simultaneously, ensuring a smooth user experience.
      </Text>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5, color: "#48ffa4" }}>
        Key Features:
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 5, color: "#48ffa4" }}>✅ <Text style={{ fontWeight: "bold" }}>Instant Responses</Text> – Provides quick and accurate answers to user questions.</Text>
      <Text style={{ fontSize: 16, marginBottom: 5, color: "#48ffa4" }}>✅ <Text style={{ fontWeight: "bold" }}>Multi-Question Handling</Text> – Capable of responding to multiple queries at the same time.</Text>
      <Text style={{ fontSize: 16, marginBottom: 5, color: "#48ffa4" }}>✅ <Text style={{ fontWeight: "bold" }}>Question & Answer Management</Text> – Organizes and manages user inquiries efficiently.</Text>
      <Text style={{ fontSize: 16, marginBottom: 5, color: "#48ffa4" }}>✅ <Text style={{ fontWeight: "bold" }}>User Management</Text> – Supports user authentication and personalized interactions.</Text>
      <Text style={{ fontSize: 16, marginBottom: 5, color: "#48ffa4" }}>✅ <Text style={{ fontWeight: "bold" }}>Simple Game Integration</Text> – Includes a built-in mini-game for user engagement.</Text>
      <Text style={{ fontSize: 16, marginBottom: 5, color: "#48ffa4" }}>✅ <Text style={{ fontWeight: "bold" }}>Bulk File Upload Support</Text> – Allows users to upload multiple files at once.</Text>

      <Text style={{ fontSize: 16, fontStyle: "italic", textAlign: "center", marginTop: 10, color: "#48ffa4" }}>
        Our chatbot is designed to enhance productivity and user interaction with a seamless and intelligent response system. 🚀
      </Text>
    </ScrollView>

          </LinearGradient>
        </View>
      </Modal>

      <Modal visible={isLoginModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <LinearGradient colors={['#07426f', '#07426f', '#141e3a']} style={styles.modalContainer}>

            <TouchableOpacity onPress={() => setLoginModalVisible(false)} style={{ position: 'absolute', top: 10, right: 10 }}>
              <FontAwesome name="close" size={24} color="#48ffa4" />
            </TouchableOpacity>

            <Text style={{ color: '#48ffa4', fontWeight: 'bold', marginVertical: 5 }}>Signup:</Text>

            <View>
              <TextInput
                style={styles.input}
                placeholder="Enter a unique user id"
                value={userIdText}
                onChangeText={setUserIdText}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your first name"
                value={userFirstNameText}
                onChangeText={setUserFirstNameText}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your last name"
                value={userLastNameText}
                onChangeText={setUserLastNameText}
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <TouchableOpacity onPress={handleSignup}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <Text style={{ fontWeight: 'bold', color: 'orange', marginLeft: 10 }}>{warningText}</Text>
            </View>

          </LinearGradient>
        </View>
      </Modal>

      <LinearGradient colors={['#141e3a', '#07426f', '#141e3a']}
        style={{
          width: 70, elevation: 3, alignItems: 'center',
          justifyContent: 'space-between', borderTopRightRadius: 40, borderBottomRightRadius: 40
        }}>

        <View style={{
          width: 50, height: 50,
          borderRadius: 25,
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

          <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => { setIsModalVisible(true) }}>
            <Image style={{ width: '100%', height: '100%' }}
              source={require('@/assets/images/chatbotlogo.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            if (user.user_role && user.user_role !== "") {
              router.navigate("/dictionary")
            } else {
              setLoginModalVisible(true)
            }
          }}>
            <MaterialCommunityIcons name="database-settings" size={35} color="#48ffa4" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.navigate("/game")}>
            <Entypo name="game-controller" size={30} color="#48ffa4" />
          </TouchableOpacity>

        </View>
        <View style={{ marginBottom: 20, gap: 10, alignItems: 'center' }}>

          <TouchableOpacity onPress={() => {
            if (user.user_role && user.user_role !== "") {
              router.navigate("/settings")
            } else {
              setLoginModalVisible(true)
            }
          }}>
            <Image style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#48ffa4' }}
              source={require('@/assets/images/boy.png')} />
          </TouchableOpacity>

          <View style={{ height: 30 }} />

        </View>

      </LinearGradient>
      <LinearGradient colors={['#07426f', '#141e3a', '#07426f']} style={{ flex: 1 }}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={()=> <View style={{marginLeft: 20}}> <Text style={styles.messageText}>Hallo, wie kann ich dir helfen?</Text></View>}
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
    // width: 500
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
    color: '#48ffa4',
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    padding: 20,
    minHeight: 200,
    width: "80%",
    maxWidth: 700,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#48ffa4",
    marginBottom: 10,
    padding: 10,
    color: '#48ffa4',
    outlineStyle: 'none',
  },
  buttonText: {
    color: '#48ffa4',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default ChatUI;
