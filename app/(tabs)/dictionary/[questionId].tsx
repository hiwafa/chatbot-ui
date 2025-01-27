import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';


const apiUrl = "http://127.0.0.1:8000";

const AnswerList = () => {

  const { questionId } = useLocalSearchParams();
  const [question, setQuestion] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [oldAnswerText, setOldAnswerText] = useState("");
  const [updatedAnserText, setUpdatedAnswerText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch all answers
  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get_question_by_id?question_id=${questionId}`);
      setQuestion(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load questions.");
    }
  }

  const handleEdit = async answer => {
    setOldAnswerText(answer);
    setIsModalVisible(true);
  }

  const handleSave = async () => {
    console.log("oldAnswerText: ", oldAnswerText)
    console.log("updatedAnserText: ", updatedAnserText)
    if (!oldAnswerText || !updatedAnserText) {
      Alert.alert("Error", "Please type a new answer");
      return;
    }
    try {
      await axios.put(`${apiUrl}/edit_answer?question_id=${questionId}&old_answer=${oldAnswerText}&new_answer=${updatedAnserText}`);
      Alert.alert("Success", "Answer edited");
      setIsModalVisible(false);
      fetchAnswers();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to edit answer.");
    }
  }

  const handleDelete = async answer => {
    if (!answer) {
      Alert.alert("Error", "No selected answer");
      return;
    }
    try {
      await axios.delete(`${apiUrl}/delete_answer?question_id=${questionId}&answer=${answer}`);
      Alert.alert("Success", "Answer deleted");
      fetchAnswers();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete answer.");
    }
  };

  const handleAddNewAnswer = async () => {
    if (!newAnswer) {
      Alert.alert("Error", "Please type a new answer");
      return;
    }
    try {
      await axios.put(`${apiUrl}/add_answer?question_id=${questionId}&new_answer=${newAnswer}`);
      Alert.alert("Success", "Answer added");
      fetchAnswers();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add answer.");
    }
  }

  const renderItem = ({ item }) => (
    <LinearGradient
      style={styles.answerItem}
      colors={['#141e3a', '#07426f', '#07426f']}>
      <Text style={styles.answerText}>{item}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  return (
    <LinearGradient
      style={styles.container}
      colors={['#07426f', '#141e3a', '#07426f']}>
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter new answer text"
              value={updatedAnserText}
              onChangeText={text => setUpdatedAnswerText(text)}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.inputContainer}>
        <TextInput
          style={{ padding: 10, flex: 1, color: '#48ffa4' }}
          placeholder="Type Answer"
          value={newAnswer}
          onChangeText={setNewAnswer}
        />
        <TouchableOpacity style={{
          backgroundColor: '#28a745',
          marginHorizontal: 5,
          borderRadius: 5,
          elevation: 3,
          padding: 5,
          alignSelf: 'center'
        }} onPress={handleAddNewAnswer}>
          <Text style={styles.buttonText}>+ Add new answer</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={question.question_answers}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: "#48ffa4",
    marginBottom: 10,
    flexDirection: 'row',
    borderRadius: 5
  },
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'flex-end',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  answerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 1, // Android shadow
  },
  answerText: {
    fontSize: 16,
    flex: 1,
    color: '#48ffa4'
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 5,
  },
  modalButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    elevation: 3, // For Android shadow effect
    margin: 5
  },
  editButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: 'orange',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center'
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 10
  }
});

export default AnswerList;
