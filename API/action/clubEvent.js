import { FETCH_CLUB_EVENTS } from '../actionTypes'
import * as api from './API'

export const showClubEvents = (clubId)=>async(dispatch)=>{
    try {
        const {data} =await api.showClubEvents(clubId)
         dispatch({type:FETCH_CLUB_EVENTS,payload:data})
         return data;
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    showClubEvents
}