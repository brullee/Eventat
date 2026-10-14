import {AUTH} from '../actionTypes'
import * as api from './API'

export const signin = (formData)=>async(dispatch)=>{
    try {
        const {data} =await api.signin(formData)
         dispatch({type:AUTH,data})
         return data;
    } catch (error) {
        console.error(error)
    }
}
export const signup = (formData)=>async(dispatch)=>{
    try {
        const{data}=await api.signup (formData)
        dispatch({type:AUTH,data})
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    signin,
    signup
}