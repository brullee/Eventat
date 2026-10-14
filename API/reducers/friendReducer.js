import { 
    SEND_FRIEND_REQUEST, 
    ACCEPT_FRIEND_REQUEST, 
    REJECT_FRIEND_REQUEST, 
    SHOW_PENDING_REQUESTS, 
    FETCH_FRIENDS_LIST, 
    SHOW_PROFILE
} from '../actionTypes';

const initialState = {
    pendingRequests: [],  // To store pending friend requests
    friendsList: [],      // To store the friends list
};

export default (friendState = initialState, action) => {
    switch (action.type) {
        case SHOW_PROFILE:
            // Update profile
            return {
               
                profile: action.payload
            };

        case SEND_FRIEND_REQUEST:
            // Assuming action.payload contains the new friend request
            return {
                ...friendState,
                pendingRequests: [...friendState.pendingRequests, action.payload]
            };
            
        case ACCEPT_FRIEND_REQUEST:
            // Assuming action.payload contains the accepted friend request
            return {
                ...friendState,
                friendsList: [...friendState.friendsList, action.payload],
                pendingRequests: friendState.pendingRequests.filter(request => request.id !== action.payload.id) // Remove from pending
            };

        case REJECT_FRIEND_REQUEST:
            // Assuming action.payload contains the rejected request id
            return {
                ...friendState,
                pendingRequests: friendState.pendingRequests.filter(request => request.id !== action.payload)
            };

        case SHOW_PENDING_REQUESTS:
            // Update pending requests list
            return {
                ...friendState,
                pendingRequests: action.payload
            };

        case FETCH_FRIENDS_LIST:
            // Update friends list
            return {
                ...friendState,
                friendsList: action.payload
            };

        default:
            return friendState;
    }
};
