import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import validateCSVString from '@/src/utils/csv_validator';
import Papa from 'papaparse';


export default function CSVUploader() {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  // Function to parse CSV string using PapaParse
  const parseCSV = (csvString) => {

    const validationResult = validateCSVString(csvString);
    if (validationResult === true) {
      console.log("CSV is valid.");
    } else {
      console.log("CSV validation errors:");
      console.log(validationResult);
    }
    Papa.parse(csvString, {
      complete: (result) => {

        // Check if the result is as expected
        if (result.errors.length > 0) {
          console.error("Parsing errors:", result.errors);
        }

        // Check the data structure
        const { data } = result;

        if (data && data.length > 0) {
          const headerRow = data[0]; // The first row is the header
          setHeaders(headerRow);

          // The remaining rows are the body data
          const bodyData = data.slice(1); // Get the data rows (after the header)
          console.log("Body Data:", bodyData); // Log body data for debugging
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadButton} onPress={uploadCSV}>
        <Text style={styles.uploadButtonText}>Upload CSV</Text>
      </TouchableOpacity>

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
});
