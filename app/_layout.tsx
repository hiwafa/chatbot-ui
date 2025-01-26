import React from 'react';
import { DictionaryProvider } from "@/src/context/DictionaryContext";

import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { ConfirmationDialogProvider } from '@/src/components/ConfirmationDialog';

export default function RootLayout() {

  const router = useRouter();

  return (
    <DictionaryProvider>
      <ConfirmationDialogProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" options={{
          title: "ChatBot",
          headerStyle: {backgroundColor: '#07426f'},
          headerTintColor: '#fff',
          headerRight: () => <TouchableOpacity onPress={() => { router.push('/dictionary') }} >
            <Text style={{
              alignItems: 'center',
              fontWeight: 'bold',
              color: 'green',
              padding: 10,
            }}>Setting</Text>
          </TouchableOpacity>
        }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      </ConfirmationDialogProvider>
    </DictionaryProvider>

  );
}
