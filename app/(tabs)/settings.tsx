import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';
import { useConfirmationDialog } from '@/src/components/ConfirmationDialog';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { apiUrl } from '@/src/api/api-request';

export default function App() {

  const confirmDialog = useConfirmationDialog();

  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userAbout, setUserAbout] = useState('');
  const [userImage, setUserImage] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('Viewer');
  const [userDateOfBirth, setUserDateOfBirth] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUserDBId, setCurrentUserDBId] = useState(null);


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
        user_role: selectedRole,
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
  }

  const updateUser = async () => {
    try {

      const response = await axios.put(`${apiUrl}/edit_user`, {
        _id: currentUserDBId ? currentUserDBId : "",
        user_id: userId,
        user_role: selectedRole,
        user_first_name: userFirstName,
        user_last_name: userLastName,
        user_about: userAbout,
        user_image: userImage,
        user_date_of_birth: userDateOfBirth,
      });

      setIsModalVisible(false);
      setCurrentUserDBId(null);
      fetchUsers();

    } catch (error) {
      console.error('Error updating user:', error);
    }
  }


  // Delete a user
  const deleteUser = async (id) => {
    try {

      const result = await confirmDialog({
        message: 'Do you want to delete this record?',
        confirmText: 'Yes',
        cancelText: 'No',
      });

      if (result) {
        await axios.delete(`${apiUrl}/delete_user?user_id=${id}`);
        fetchUsers();
      } else {
        console.log('User canceled!');
      }

    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const emptyModalTextFields = () => {
    setUserId("");
    setUserFirstName("");
    setUserLastName("");
    setUserAbout("");
    setUserImage("");
    setUserDateOfBirth("");
  }
  const setModalTextFields = ({ user_id, user_role, user_first_name, user_last_name, user_about, user_image, user_date_of_birth }) => {
    setUserId(user_id);
    setSelectedRole(user_role);
    setUserFirstName(user_first_name);
    setUserLastName(user_last_name);
    setUserAbout(user_about);
    setUserImage(user_image);
    setUserDateOfBirth(user_date_of_birth);
  }

  // Edit a user 
  const editUser = (user) => {
    setIsModalVisible(true);
    setModalTextFields(user);
    setCurrentUserDBId(user._id)
  }

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <Image source={{ uri: item.user_image }} style={styles.userImage} />
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{item.user_first_name} {item.user_last_name}</Text>
        <Text style={styles.userInfo}>{item.user_about}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.userInfo}>Born: {item.user_date_of_birth}</Text>
          <Text style={[styles.userInfo, { marginLeft: 10 }]}>Role: {item.user_role}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => editUser(item)} style={styles.actionButton}>
          <FontAwesome5 name="user-edit" size={24} color="#48ffa4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteUser(item.user_id)} style={styles.actionButton}>
          <MaterialIcons name="delete" size={28} color="orange" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      style={styles.container}
      colors={['#141e3a', '#07426f', '#141e3a']}>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#07426f', maxWidth: 150, paddingHorizontal: 10, marginRight: 5, alignSelf: 'flex-end' }]}
        onPress={() => {
          setIsModalVisible(true);
          emptyModalTextFields();
        }}>
        <Text style={styles.buttonText}>+ Add User</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.user_id}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
          setCurrentUserDBId(null);
        }}
      >
        {/* <View style={styles.modalContainer}> */}
        <View style={styles.modalContainer}>
          <LinearGradient colors={['#07426f', '#141e3a', '#07426f']} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New User</Text>
            <RadioButton.Group onValueChange={newValue => setSelectedRole(newValue)} value={selectedRole}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold', color: '#48ffa4' }}>Role:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <RadioButton value="manager" />
                  <Text style={{ color: '#48ffa4' }}>Manager</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <RadioButton value="editor" />
                  <Text style={{ color: '#48ffa4' }}>Editor</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <RadioButton value="viewer" />
                  <Text style={{ color: '#48ffa4' }}>Viewer</Text>
                </View>
              </View>
            </RadioButton.Group>
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
              <TouchableOpacity onPress={currentUserDBId ? updateUser : addUser}>
                <Text style={{ color: '#48ffa4', fontWeight: 'bold' }}>{currentUserDBId ? "Update User" : "+ Add User"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setIsModalVisible(false);
                setCurrentUserDBId(null);
              }}>
                <Text style={{ color: '#48ffa4', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        {/* </TouchableWithoutFeedback> */}
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  userCard: {
    flexDirection: 'row',
    padding: 15,
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
    color: '#48ffa4',
  },
  userInfo: {
    fontSize: 14,
    color: '#48ffee',
  },
  actions: {
    flexDirection: 'row'
  },
  actionButton: {
    marginLeft: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
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
    color: '#48ffa4'
  },
  input: {
    height: 40,
    borderColor: '#48ffa4',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    color: '#48ffa4',
    outlineStyle: 'none'
  },
  modalButtons: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
    elevation: 3, // For Android shadow effect
    margin: 5
  },
  buttonText: {
    color: '#48ffa4',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  radioGroup: {
    marginBottom: 20,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#00cc99',
  },
  radioTextContainer: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  radioDescription: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 2,
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#2c2c2c',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});