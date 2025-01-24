import React from 'react';
import { DictionaryProvider } from "@/src/context/DictionaryContext";

import { Stack } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

export default function RootLayout() {
  return (
    <DictionaryProvider>
      <Stack>
        <Stack.Screen name="index" options={{
          title: "ChatBot",
          headerRight: () => <TouchableOpacity onPress={() => { }} >
            <Text style={{
              alignItems: 'center',
              fontWeight: 'bold',
              color: 'green',
              padding: 10,
            }}>Setting</Text>
          </TouchableOpacity>
        }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </DictionaryProvider>

  );
}
