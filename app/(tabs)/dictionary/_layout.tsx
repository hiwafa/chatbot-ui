import React, { useEffect } from 'react';
import { DictionaryProvider } from "@/src/context/DictionaryContext";

import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

export default function RootLayout() {

    const router = useRouter();

    return (
        <Stack screenOptions={{
            
        headerStyle: {
          backgroundColor: '#141e3a',
        },
        headerShadowVisible: false,
        headerTintColor: '#48ffa4',
        
        }}>
            <Stack.Screen name="index" options={{title: 'Dictionary'}} />
            <Stack.Screen name="[questionId]"  options={{title: 'Answers'}} />
        </Stack>
    );
}
