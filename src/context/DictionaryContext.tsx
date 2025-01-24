import React, { createContext, useState, useContext, ReactNode } from 'react';

// Create the context
const Dictionary = createContext<any>(null);

const initial_state = {
    questions: {
        "Hi, how is it going": "Hi, thank you everything is going well"
    }
};

// Provider component
export const DictionaryProvider = ({ children }: { children: ReactNode }) => {
    const [dictionary, setDictionary] = useState(initial_state); // Global state

    return (
        <Dictionary.Provider value={{ dictionary, setDictionary }}>
            {children}
        </Dictionary.Provider>
    );
};

// Hook for consuming the context
export const useDictionary = () => useContext(Dictionary);