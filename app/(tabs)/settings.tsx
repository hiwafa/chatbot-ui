import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, TouchableOpacity, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import { useConfirmationDialog } from '@/src/components/ConfirmationDialog';

const apiUrl = "http://127.0.0.1:8000";

export default function App() {
  
  const confirmDialog = useConfirmationDialog();
  
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userAbout, setUserAbout] = useState('');
  const [userImage, setUserImage] = useState('');
  const [userDateOfBirth, setUserDateOfBirth] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add a user to the backend
  const addUser = async () => {
    try {
      const response = await axios.post(`${apiUrl}/add_user`, {
        user_id: userId,
        user_first_name: userFirstName,
        user_last_name: userLastName,
        user_about: userAbout,
        user_image: userImage,
        user_date_of_birth: userDateOfBirth,
      });
      setIsModalVisible(false);
      fetchUsers(); 
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    try {

      const result = await confirmDialog({
        message: 'Do you want to proceed?',
        confirmText: 'Yes',
        cancelText: 'No',
      });
  
      if (result) {
        console.log('User confirmed!');
      } else {
        console.log('User canceled!');
      }

      // await axios.delete(`${apiUrl}/delete_user?user_id=${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const emptyModalTextFields = ()=> {
    setUserId("");
    setUserFirstName("");
    setUserLastName("");
    setUserAbout("");
    setUserImage("");
    setUserDateOfBirth("");
  }
  const setModalTextFields = ({user_id, user_first_name, user_last_name, user_about, user_image, user_date_of_birth})=> {
    setUserId(user_id);
    setUserFirstName(user_first_name);
    setUserLastName(user_last_name);
    setUserAbout(user_about);
    setUserImage(user_image);
    setUserDateOfBirth(user_date_of_birth);
  }

  // Edit a user (this can be expanded to show a modal for editing)
  const editUser = (user) => {
    setIsModalVisible(true);
    setModalTextFields(user)
  }

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <Image source={{ uri: item.user_image }} style={styles.userImage} />
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{item.user_first_name} {item.user_last_name}</Text>
        <Text style={styles.userInfo}>{item.user_about}</Text>
        <Text style={styles.userInfo}>Born: {item.user_date_of_birth}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => editUser(item)} style={styles.actionButton}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteUser(item.user_id)} style={styles.actionButton}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Add User" onPress={() => {
        setIsModalVisible(true);
        emptyModalTextFields();
      }} style={styles.addButton} />
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.user_id}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New User</Text>
              <TextInput
                style={styles.input}
                placeholder="User ID"
                value={userId}
                onChangeText={setUserId}  // Ensure this is updating the state
              />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={userFirstName}
                onChangeText={setUserFirstName}  // Ensure this is updating the state
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={userLastName}
                onChangeText={setUserLastName}  // Ensure this is updating the state
              />
              <TextInput
                style={styles.input}
                placeholder="About"
                value={userAbout}
                onChangeText={setUserAbout}  // Ensure this is updating the state
              />
              <TextInput
                style={styles.input}
                placeholder="Image URL"
                value={userImage}
                onChangeText={setUserImage}  // Ensure this is updating the state
              />
              <TextInput
                style={styles.input}
                placeholder="Date of Birth"
                value={userDateOfBirth}
                onChangeText={setUserDateOfBirth}  // Ensure this is updating the state
              />
              <View style={styles.modalButtons}>
                <Button title="Add User" onPress={addUser} />
                <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
              </View>
            </View>
          </View>
        {/* </TouchableWithoutFeedback> */}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  addButton: {
    marginBottom: 20,
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userInfo: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
