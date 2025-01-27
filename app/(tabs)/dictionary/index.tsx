import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert, Modal, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

const apiUrl = "http://127.0.0.1:8000"; // Replace with your local IP address

const App = () => {

  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch all questions
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/questions`);
      setQuestions(response.data);
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
      colors={['#07426f', '#141e3a', '#07426f']}>


      <TouchableOpacity style={[styles.button, { backgroundColor: '#28a745', maxWidth: 150, paddingHorizontal: 10, margin: 0, marginBottom: 20, alignSelf: 'flex-end' }]} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.buttonText}>+ Add Question</Text>
      </TouchableOpacity>

      {/* Modal for Adding a Question */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Add a New Question</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter question text"
              value={newQuestionText}
              onChangeText={setNewQuestionText}
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={{ padding: 10, flex: 1 }}
                placeholder="Enter answer"
                value={newAnswer}
                onChangeText={setNewAnswer}
              />
              <TouchableOpacity style={{
                backgroundColor: '#007bff',
                marginHorizontal: 5,
                borderRadius: 5,
                elevation: 3,
                padding: 5,
                alignSelf: 'center'
              }} onPress={handleAddAnswer}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={answers}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text>{item}</Text>}
              ItemSeparatorComponent={() => <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }} />}
            />

            <TouchableOpacity style={styles.button} onPress={handleAddQuestion}>
              <Text style={styles.buttonText}>Save Question</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <Modal visible={editingQuestion !== null} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter new question text"
              value={newQuestionText}
              onChangeText={setNewQuestionText}
            />
            <TouchableOpacity style={styles.button} onPress={handleEdit}>
              <Text style={styles.buttonText}>Save Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setEditingQuestion(null)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={questions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.questionContainer} onPress={() => {
            router.navigate(`/dictionary/${item._id}`);
          }}>
            <Text style={styles.questionText}>{item.question_text}</Text>
            <View style={styles.actions}>
              <Button title="Edit" onPress={() => { setEditingQuestion(item._id); setNewQuestionText(item.question_text); }} />
              <Button color="orange" title="Delete" onPress={() => handleDelete(item._id)} />
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
  },
  editContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 10
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    flexDirection: 'row'
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    elevation: 3, // For Android shadow effect
    margin: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default App;
