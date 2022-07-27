import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comments: null,
  loading: false,
  error: null,
};

export const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    fetchCommentsStart: (state) => {
      state.loading = true;
    },
    fetchCommentsSuccess: (state, action) => {
      state.loading = false;
      state.comments = action.payload;
    },
    fetchCommentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addComment: (state, action) => {
        state.comments.push(action.payload)
    }
  },
});

export const { fetchCommentsStart, fetchCommentsFailure, fetchCommentsSuccess, addComment } =
  commentsSlice.actions;

export default commentsSlice.reducer;