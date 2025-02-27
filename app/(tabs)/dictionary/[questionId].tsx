import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { apiUrl } from '@/src/api/api-request';

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
    <View
      style={styles.answerItem}>
      <Text style={styles.answerText}>{item}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button]} onPress={() => handleEdit(item)}>
          <MaterialIcons name="edit" size={24} color="#48ffa4" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button]} onPress={() => handleDelete(item)}>
          <MaterialIcons name="delete" size={24} color="orange" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      style={styles.container}
      colors={['#141e3a', '#07426f', '#141e3a']}>
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <LinearGradient colors={['#07426f', '#141e3a', '#07426f']} style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter new answer text"
              value={updatedAnserText}
              onChangeText={text => setUpdatedAnswerText(text)}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <TouchableOpacity onPress={handleSave}>
                <Text style={styles.buttonText}>Save Edited Answer</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>

      <View style={styles.inputContainer}>
        <TextInput
          style={{ padding: 10, flex: 1, outlineStyle: 'none', color: '#48ffa4' }}
          placeholder="Type Answer"
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
        }} onPress={handleAddNewAnswer}>
          <Text style={{ color: '#48ffa4' }}>+ Add new answer</Text>
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
    borderBottomWidth: 0.5,
    borderBottomColor: '#48ffa4',
    padding: 15,
    marginBottom: 10,
    elevation: 1,
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
    marginLeft: 5
  },
  modalButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    elevation: 3, // For Android shadow effect
    margin: 5
  },
  buttonText: {
    color: '#48ffa4',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold'
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
    borderColor: "#48ffa4",
    marginBottom: 10,
    padding: 10,
    color: '#48ffa4',
    outlineStyle: 'none'
  }
});

export default AnswerList;
