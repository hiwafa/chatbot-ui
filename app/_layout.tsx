import React from 'react';
import { DictionaryProvider } from "@/src/context/DictionaryContext";
import { Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ConfirmationDialogProvider } from '@/src/components/ConfirmationDialog';
import { UserProvider } from '@/src/context/UserContext';

export default function RootLayout() {

  const router = useRouter();

  return (
    <DictionaryProvider>
      <UserProvider>
        <ConfirmationDialogProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{
              title: "Home",
              // headerStyle: {backgroundColor: '#07426f'},
              // headerTintColor: '#fff',
              // headerRight: () => (
              //   <TouchableOpacity onPress={() => { router.push('/dictionary') }} >
              //     <Text style={{
              //       alignItems: 'center',
              //       fontWeight: 'bold',
              //       color: 'green',
              //       padding: 10,
              //     }}>Setting</Text>
              //   </TouchableOpacity>
              // )
            }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="game" options={{
              headerTitle: "",
              headerShown: true,
              headerStyle: {
                backgroundColor: '#141e3a',
              },
              headerTintColor: '#48ffa4',
              headerShadowVisible: false,
            }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ConfirmationDialogProvider>
      </UserProvider>
    </DictionaryProvider>

  );
}
