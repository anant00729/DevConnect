import { GET_ERRORS, SET_CURRENT_USER } from './types'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import jwtDecode from 'jwt-decode'

// Register user
export const registerUser = (userData,history) => async (dispatch) => {
    try{
      await axios.post('/api/users/register', userData)
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

// Login - Get user token
export const loginUser = (userData) => async (dispatch) => {
    try{
        const loginRes = await axios.post('/api/users/login', userData)
        // save user data to local storage
        const { token } = loginRes.data
        // set token to localstorage
        localStorage.setItem('jwtToken', token)
        // set token to auth header
        setAuthToken(token)
        // decode the jwt token
        const decoded = jwtDecode(token)
        // set current user

        console.log('decoded :', decoded);
        dispatch(setCurrentUser(decoded))

        

    }catch(error){
        console.log('error :', error.response.data.messageError);
        if(error){
            dispatch({
                type : GET_ERRORS,
                payload : error.response.data.messageError
            })    
        }
    }
    
}

// set logged in user
export const setCurrentUser = decoded => {
    return {
        type : SET_CURRENT_USER,
        payload : decoded
    }
}

// Log out user
export const logoutUser = () => dispatch => {
    // Remove the token from the local storage 
    localStorage.removeItem('jwtToken')
    // Remove the auth header for future requests
    setAuthToken(false)
    // set current user to {} which will make {isAuthenticated : false}
    dispatch(setCurrentUser({}))

}