import React, { useEffect } from 'react';
import { DictionaryProvider } from "@/src/context/DictionaryContext";

import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

export default function RootLayout() {

    const router = useRouter();

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="[questionId]"  />
        </Stack>
    );
}
