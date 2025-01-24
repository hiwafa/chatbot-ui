import { Text, View, StyleSheet, Button } from 'react-native';

import { useDictionary } from '@/src/context/DictionaryContext';
import ChatUI from '@/src/components/ChatUi';

export default function Index() {

    const {dictionary, setDictionary} = useDictionary();


    return <ChatUI />;

    return (
        <View style={[styles.container, { backgroundColor: 'white' }]}>
            <Text>{dictionary.questions['Hi, how is it going']}</Text>
            <Button title='Click Me' onPress={()=> {
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
        alignItems: 'center',
        justifyContent: 'center',
    }
});
