import axios from 'axios'
import {
    GET_PROFILE,
    PROFILE_LOADING,
    CLEAR_CURRENT_PROFILE,
    GET_ERRORS,
    SET_CURRENT_USER
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

// Create Profile
export const createProfile = (profileData, history) => async (dispatch) => {
    try{
        await axios.post('/api/profile', profileData)
        history.push('/dashboard')
    }catch(error){
        dispatch({
            type : GET_ERRORS,
            payload : error.response.data
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

export const deleteAccount = () => dispatch => {
    if(window.confirm('Are you sure, this cannot be undone?')){
        axios.delete('/api/profile')
        .then(res=>dispatch({
            type : SET_CURRENT_USER,
            payload : {}
        })).catch(err=>{
            dispatch({
                type : GET_ERRORS,
                payload : err.response.data
            })
        })
    }
}