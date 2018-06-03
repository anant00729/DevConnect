import axios from 'axios'
import {
    GET_PROFILE,
    PROFILE_LOADING,
    CLEAR_CURRENT_PROFILE
} from './types'

//Get current profile
export const getCurrentProfile = () => async (dispatch) =>{
    dispatch(setProfileLoading())
    console.log('THIS IS WORKING')
    try{
        const response = await axios.get('/api/profile')
        console.log('response :', response);

        dispatch({
            type: GET_PROFILE,
            payload : response.data
        })
    }catch(error){
        console.log('error.response :', error.response);
        dispatch({
            type: GET_PROFILE,
            payload : {}
        })
    }
    
}

// profile loading
export const setProfileLoading = () => {
    return {
        type : PROFILE_LOADING
    }
}

// clear profile
export const clearCurrentProfile = () =>{
    return {
        type : CLEAR_CURRENT_PROFILE
    }
}