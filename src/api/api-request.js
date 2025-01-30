
import axios from 'axios';

export const apiUrl = "https://chatbot-server-1-sqz1.onrender.com";

export const addUser = async ({
    user_id,
    user_role,
    user_first_name,
    user_last_name,
    user_about,
    user_image,
    user_date_of_birth
}) => {
    try {
        const response = await axios.post(`${apiUrl}/add_user`, {
            user_id,
            user_role,
            user_first_name,
            user_last_name,
            user_about,
            user_image,
            user_date_of_birth
        });

        console.log("response: ", response);

        return response.status;

    } catch (error) {
        console.error('Error adding user:', error);
        if(error?.response && error.response?.data && error.response?.data?.detail){
            return error.response?.data?.detail
        }
    }
}