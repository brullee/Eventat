import { 
    SEND_FRIEND_REQUEST, 
    ACCEPT_FRIEND_REQUEST, 
    REJECT_FRIEND_REQUEST, 
    SHOW_PENDING_REQUESTS, 
    FETCH_FRIENDS_LIST,
    SHOW_PROFILE 
} from '../actionTypes';
import * as api from './API';

export const showProfile = () => async (dispatch) => {
    try {
        const { data } = await api.showProfile();
        dispatch({ type: SHOW_PROFILE, payload: data });
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

// Action to send a friend request
export const sendFriendRequest = (receiverId) => async (dispatch) => {
    try {
        const { data } = await api.sendFriendRequest(receiverId);
        dispatch({ type: SEND_FRIEND_REQUEST, payload: data }); // Use the specific action type
    } catch (error) {
        console.error('Error sending friend request:', error);
    }
};

// Action to accept a friend request
export const acceptFriendRequest = (requestId) => async (dispatch) => {
    try {
        const { data } = await api.acceptFriendRequest(requestId);
        dispatch({ type: ACCEPT_FRIEND_REQUEST, payload: data }); // Use the specific action type
    } catch (error) {
        console.error('Error accepting friend request:', error);
    }
};

// Action to reject a friend request
export const rejectFriendRequest = (requestId) => async (dispatch) => {
    try {
        const { data } = await api.rejectFriendRequest(requestId);
        dispatch({ type: REJECT_FRIEND_REQUEST, payload: data }); // Use the specific action type
    } catch (error) {
        console.error('Error rejecting friend request:', error);
    }
};

// Action to show pending friend requests
export const showPendingRequests = () => async (dispatch) => {
    try {
        const { data } = await api.showPendingRequest();
        dispatch({ type: SHOW_PENDING_REQUESTS, payload: data }); // Use the specific action type
    } catch (error) {
        console.error('Error fetching pending requests:', error);
    }
};

// Action to show friends list
export const fetchFriendsList = () => async (dispatch) => {
    try {
        const { data } = await api.showFriendsList();
        dispatch({ type: FETCH_FRIENDS_LIST, payload: data }); // Use the specific action type
    } catch (error) {
        console.error('Error fetching friends list:', error);
    }
};



module.export = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    showPendingRequests,
    fetchFriendsList,
    showProfile
};
