import { loginStart, loginFailure, loginSuccess, resetError, logout } from './userSlice';
import axios from "axios";
import { fetchVideoFailure, fetchVideoStart, fetchVideoSuccess } from './videoSlice';
import { fetchCommentsStart, fetchCommentsSuccess, fetchCommentsFailure } from './commentsSlice';

export const login = async (dispatch, user) => {
    dispatch(loginStart())
    try {
        const res = await axios.post("/api/auth/signin", user)
        dispatch(loginSuccess(res.data))
        localStorage.setItem("user", JSON.stringify(res.data))
    } catch (error) {
        dispatch(loginFailure(error.response.data.message))
        setTimeout(() => {
            dispatch(resetError())
        }, 2000);
    }
}

export const register = async (dispatch, user) => {
    dispatch(loginStart())
    try {
        const res = await axios.post("/api/auth/signup", user)
        dispatch(loginSuccess(res.data))
        localStorage.setItem("user", JSON.stringify(res.data))
    } catch (error) {
        dispatch(loginFailure(error.response.data.message))
        setTimeout(() => {
            dispatch(resetError())
        }, 2000);
    }
}

export const leave = async (dispatch) => {
    await axios.get("/api/auth/logout");
    dispatch(logout())
    localStorage.removeItem("user")
}

export const fetchVideo = async (dispatch, videoId) => {
    dispatch(fetchVideoStart())
    try {
      const res = await axios.get(`/api/videos/find/${videoId}`)
        dispatch(fetchVideoSuccess(res.data))
    } catch (error) {
        dispatch(fetchVideoFailure(error.response.data.message))
    }
}

export const fetchComments = async (dispatch, videoId) => {
    dispatch(fetchCommentsStart())
    try {
      const res = await axios.get(`/api/comments/${videoId}`)
        dispatch(fetchCommentsSuccess(res.data))
    } catch (error) {
        dispatch(fetchCommentsFailure(error.response.data.message))
    }
}