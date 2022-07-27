import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import videoReducer from "./videoSlice"
import commentsReducer from "./commentsSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        video: videoReducer,
        comments: commentsReducer
    }
})