import { GET_ERRORS } from './types'
import axios from 'axios'

export const registerUser = (userData,history) => async (dispatch) => {
    try{
      const createdUser = await axios.post('/api/users/register', userData)
      history.push('/login')
    }catch(error){
       if(error){
        dispatch({
            type : GET_ERRORS,
            payload : error.response.data.messageError
        })  
       } 
    }
}