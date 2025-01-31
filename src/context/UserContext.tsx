import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const User = createContext<any>(null);

const initial_state = {
    user_id: null,
    user_role: null,
    user_first_name: null,
    user_last_name: null,
    user_about: null,
    user_image: null,
    user_date_of_birth: null
  };

export const UserProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState(initial_state);

    useEffect(()=> {

        getUserInfo();

    }, []);

    const storeUserInfo = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('userInfo', jsonValue);
            setUser(value);
        } catch (e) {

        }
    };

    const getUserInfo = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('userInfo');
            if(jsonValue != null){
                setUser(JSON.parse(jsonValue));
            }
        } catch (e) {

        }
    };

    return (
        <User.Provider value={{ user, storeUserInfo }}>
            {children}
        </User.Provider>
    );
};

export const useUser = () => useContext(User);