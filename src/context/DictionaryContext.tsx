import React, { createContext, useState, useContext, ReactNode } from 'react';

const Dictionary = createContext<any>(null);

const initial_state = {
    questions: {
        "Hi, how is it going": "Hi, thank you everything is going well"
    }
};

export const DictionaryProvider = ({ children }: { children: ReactNode }) => {
    const [dictionary, setDictionary] = useState(initial_state); 

    return (
        <Dictionary.Provider value={{ dictionary, setDictionary }}>
            {children}
        </Dictionary.Provider>
    );
};

export const useDictionary = () => useContext(Dictionary);