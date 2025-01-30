import { Text, View, StyleSheet, Button, StatusBar } from 'react-native';

import { useDictionary } from '@/src/context/DictionaryContext';
import ChatUI from '@/src/components/ChatUI';
import CSVUploader from '@/src/components/CSVUploader';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {

    const { dictionary, setDictionary } = useDictionary();
    
    return (
        <LinearGradient
            style={{ flex: 1 }}
            colors={['#07426f', '#07426f', '#141e3a']}>
            <StatusBar
                animated={true}
                backgroundColor="#141e3a"
                barStyle='light-content'
            />
            <ChatUI />
        </LinearGradient>

    );

    return (
        <View style={[styles.container, { backgroundColor: 'white' }]}>

            <Text>{dictionary.questions['Hi, how is it going']}</Text>

            <Button title='Click Me' onPress={() => {
                setDictionary({
                    questions: {
                        "Hi, how is it going": "Hi danke es geht mir gut"
                    }
                })
            }} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ECF0F1',
    },
    buttonsContainer: {
        padding: 10,
    },
    textStyle: {
        textAlign: 'center',
        marginBottom: 8,
    },
});
