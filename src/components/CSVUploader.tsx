import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import validateCSVString from '@/src/utils/csv_validator';
import Papa from 'papaparse';
import axios from "axios";
import { useConfirmationDialog } from './ConfirmationDialog';

const apiUrl = "http://127.0.0.1:8000";

export default function CSVUploader() {

  const confirmDialog = useConfirmationDialog();
  
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Function to parse CSV string using PapaParse
  const parseCSV = (csvString) => {

    Papa.parse(csvString, {
      complete: (result) => {

        // Check if the result is as expected
        if (result.errors.length > 0) {
          console.error("Parsing errors:", result.errors);
        }

        // Check the data structure
        const { data } = result;

        if (data && data.length > 0) {

          setQuestions(data);

          const headerRow = data[0]; // The first row is the header
          setHeaders(headerRow);

          // The remaining rows are the body data
          const bodyData = data.slice(1); // Get the data rows (after the header)

          setCsvData(bodyData);
        } else {
          console.error("No data rows found");
        }
      },
      header: false, // We want to handle headers manually
      skipEmptyLines: true, // Skip any empty lines
      dynamicTyping: true, // Automatically detect the data type (string, number, etc.)
      delimiter: ',', // Make sure the delimiter is correctly set
      quoteChar: '"', // Handle quoted fields with commas inside them
    });
    
  };

  // Function to handle file upload
  const uploadCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
        copyToCacheDirectory: true,
      });

      if (Platform.OS === 'web') {
        const response = await fetch(result.assets[0].uri);
        const fileContent = await response.text();
        parseCSV(fileContent);
      } else {
        const response = await fetch(result.uri);
        const fileContent = await response.text();
        
        parseCSV(fileContent);
      }

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const saveMultipleQuestions = async () => {
    try {

      const result = await confirmDialog({
        message: 'Before saving theme, please see if their formats look well!',
        confirmText: "'It's Ok",
        cancelText: 'Not Sure',
      });

      if(!(questions.length > 0) || result === false) return;

      const formatedQuestions = convertDataFormat(questions);

      const response = await axios.post(`${apiUrl}/add_multiple_questions`, formatedQuestions, {
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
      });
  
      console.log("Successfully posted questions:", response.data);
      return response.data; // Return the server's response

    } catch (error) {
      console.error("Error posting questions to FastAPI:", error.response?.data || error.message);
      throw error; // Re-throw the error for further handling
    }
  }

  function convertDataFormat(inputData) {
    return inputData.map(row => ({
      question_text: row[0], // The first element is the question text
      question_answers: row.slice(1) // The remaining elements are the answers
    }));
  }

  return (
    <View style={styles.container}>

      <View style={{ flexDirection: 'row', gap: 10, justifyContent: "flex-end" }}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#28a745', maxWidth: 150, paddingHorizontal: 10, margin: 0, marginBottom: 20, alignSelf: 'flex-end' }]} onPress={uploadCSV}>
          <Text style={styles.buttonText}>+ Upload CSV</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#28a745', maxWidth: 150, paddingHorizontal: 10, margin: 0, marginBottom: 20, alignSelf: 'flex-end' }]}
        onPress={saveMultipleQuestions}>
          <Text style={styles.buttonText}>+ Save CSV</Text>
        </TouchableOpacity>
      </View>

      {csvData.length > 0 ? (
        <ScrollView horizontal>
          <View>
            {/* Table Header */}
            <View style={styles.row}>
              {headers.map((header, index) => (
                <Text key={index} style={[styles.cell, styles.headerCell]}>
                  {header}
                </Text>
              ))}
            </View>

            {/* Table Rows */}
            <FlatList
              data={csvData}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  {item.map((cell, index) => (
                    <Text key={index} style={styles.cell}>
                      {cell || ''}  {/* Prevent errors from missing fields */}
                    </Text>
                  ))}
                </View>
              )}
            />
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.placeholderText}>No CSV uploaded yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    textAlign: 'left',
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
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
