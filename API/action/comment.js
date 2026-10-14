import { CREATE_COMMENT, FETCH_COMMENTS, DELETE_COMMENT, UPDATE_COMMENT } from '../actionTypes';
import * as api from './API';

export const createComment = (clubId, formData) => async (dispatch) => {
    try {
        const { data } = await api.createComment(clubId, formData);
        dispatch({ type: CREATE_COMMENT, payload: data });
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const showComments = (clubId) => async (dispatch) => {
    try {
        const { data } = await api.showComments(clubId);
        dispatch({ type: FETCH_COMMENTS, payload: data });
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const deleteComment = (commentId) => async (dispatch) => {
    try {
        const { data } = await api.deleteComment(commentId);
        dispatch({ type: DELETE_COMMENT, payload: commentId });
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const updateComment = (commentId, formData) => async (dispatch) => {
    try {
        const { data } = await api.updateComment(commentId, formData);
        dispatch({ type: UPDATE_COMMENT, payload: data });
        return data;
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    createComment,
    showComments,
    deleteComment,
    updateComment,
};
