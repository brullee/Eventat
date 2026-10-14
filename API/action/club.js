import { FETCH_ALL_CLUBS, FETCH_ONE_CLUB } from '../actionTypes'
import * as api from './API'

export const allClubs = ()=>async(dispatch)=>{
    try {
        const {data} =await api.allClubs()
         dispatch({type:FETCH_ALL_CLUBS,payload:data})
         return data;
    } catch (error) {
        console.error(error)
    }
}

export const findOneClub = (id)=>async(dispatch)=>{
    try {
        const {data} =await api.findOneClub(id)
         dispatch({type:FETCH_ONE_CLUB,payload:data})
         return data;
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    allClubs,
    findOneClub

}