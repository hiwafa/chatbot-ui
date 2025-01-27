import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert, Modal, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from '@expo/vector-icons/Entypo';

const apiUrl = "http://127.0.0.1:8000"; // Replace with your local IP address

type Question = {
  question_text: string;
  question_answers: string[];
};

const App = () => {

  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(questions);

  const filterData = (data: Question[], searchText: string): Question[] => {
    if (!searchText) return data;

    const normalizedSearchText = searchText.toLowerCase();

    return data.filter(({ question_text, question_answers }) => {
      if (question_text.toLowerCase().includes(normalizedSearchText)) {
        return true;
      }

      return question_answers.some(answer =>
        answer.toLowerCase().includes(normalizedSearchText)
      );
    });
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    setFilteredData(filterData(questions, text));
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/questions`);
      setQuestions(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load questions.");
    }
  };

  const handleDelete = async (questionId: string) => {
    try {
      await axios.delete(`${apiUrl}/delete_question?question_id=${questionId}`);
      Alert.alert("Success", "Question deleted.");
      fetchQuestions();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete question.");
    }
  };

  const handleEdit = async () => {
    if (!editingQuestion || !newQuestionText) {
      Alert.alert("Error", "Please enter new text for the question.");
      return;
    }
    try {
      await axios.put(`${apiUrl}/edit_question_text?question_id=${editingQuestion}&new_text=${newQuestionText}`);
      Alert.alert("Success", "Question edited.");
      setEditingQuestion(null);
      setNewQuestionText("");
      fetchQuestions();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to edit question.");
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestionText || answers.length === 0) {
      Alert.alert("Error", "Please enter a question and at least one answer.");
      return;
    }
    try {
      await axios.post(`${apiUrl}/add_question`, {
        question_text: newQuestionText,
        question_answers: answers,
      });
      Alert.alert("Success", "Question added.");
      setNewQuestionText("");
      setAnswers([]);
      setIsModalVisible(false);
      fetchQuestions();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add question.");
    }
  };

  const handleAddAnswer = () => {
    if (newAnswer) {
      setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
      setNewAnswer("");
    } else {
      Alert.alert("Error", "Please enter an answer.");
    }
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={['#141e3a', '#07426f', '#141e3a']}>

      <View style={styles.inputContainer}>
        <TextInput
          style={{ padding: 10, flex: 1, outlineStyle: 'none', color: '#48ffa4' }}
          placeholder="Search Questions"
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={[styles.button, {
          backgroundColor: '#07426f', maxWidth: 150,
          paddingHorizontal: 10, marginHorizontal: 5, alignSelf: 'center', padding: 5
        }]} onPress={() => setIsModalVisible(true)}>
          <Text style={{ color: '#48ffa4' }}>+ Add Question</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Adding a Question */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <LinearGradient colors={['#07426f', '#141e3a', '#07426f']} style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Add a New Question</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter question text"
              value={newQuestionText}
              onChangeText={setNewQuestionText}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={{ padding: 10, flex: 1, color: '#48ffa4', outlineStyle: 'none' }}
                placeholder="Enter answer"
                value={newAnswer}
                onChangeText={setNewAnswer}
              />
              <TouchableOpacity style={{
                backgroundColor: '#07426f',
                marginHorizontal: 5,
                borderRadius: 5,
                elevation: 3,
                padding: 5,
                alignSelf: 'center'
              }} onPress={handleAddAnswer}>
                <Entypo name="add-to-list" size={20} color="#48ffa4" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={answers}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={{ color: '#48ffa4' }}>{item}</Text>}
              ItemSeparatorComponent={() => <View style={{ borderBottomWidth: 1, borderBottomColor: '#48ffa4' }} />}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <TouchableOpacity style={styles.button} onPress={handleAddQuestion}>
                <Text style={styles.buttonText}>Save Question</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>


      <Modal visible={editingQuestion !== null} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <LinearGradient colors={['#07426f', '#141e3a', '#07426f']} style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter new question text"
              value={newQuestionText}
              onChangeText={setNewQuestionText}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

              <TouchableOpacity style={styles.button} onPress={handleEdit}>
                <Text style={styles.buttonText}>Save Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setEditingQuestion(null)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
            </View>
          </LinearGradient>
        </View>
      </Modal>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.questionContainer} onPress={() => {
            router.navigate(`/dictionary/${item._id}`);
          }}>
            <Text style={styles.questionText}>{item.question_text}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={{}} onPress={() => {
                setEditingQuestion(item._id);
                setNewQuestionText(item.question_text);
              }}>
                <MaterialIcons name="edit" size={24} color="#48ffa4" />
              </TouchableOpacity>
              <TouchableOpacity style={{}} onPress={() => handleDelete(item._id)}>
                <MaterialIcons name="delete" size={24} color="orange" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#48ffa4',
    paddingBottom: 10,
  },
  questionText: {
    fontSize: 18,
    flex: 1,
    color: '#48ffa4'
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 20,
    marginBottom: 10,
    color: '#48ffa4'
  },
  editContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#48ffa4",
    marginBottom: 10,
    padding: 10,
    color: '#48ffa4',
    outlineStyle: 'none',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#48ffa4",
    marginBottom: 10,
    flexDirection: 'row',
    borderRadius: 5
  },
  button: {
  },
  buttonText: {
    color: '#48ffa4',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default App;
