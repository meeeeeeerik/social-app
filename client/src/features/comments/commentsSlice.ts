import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commentsApi } from '../../utils/api';
import { addCommentToPost, removeCommentFromPost } from '../posts/postsSlice';

export const addComment = createAsyncThunk('comments/add', async ({ postId, content }: { postId: string; content: string }, { dispatch, rejectWithValue }) => {
  try {
    const res = await commentsApi.add(postId, content);
    dispatch(addCommentToPost({ postId, comment: res.data }));
    return res.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } } };
    return rejectWithValue(error.response?.data?.error || 'Failed to add comment');
  }
});

export const deleteComment = createAsyncThunk('comments/delete', async ({ commentId, postId }: { commentId: string; postId: string }, { dispatch, rejectWithValue }) => {
  try {
    await commentsApi.delete(commentId);
    dispatch(removeCommentFromPost({ postId, commentId }));
    return commentId;
  } catch { return rejectWithValue('Failed to delete comment'); }
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState: { isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addComment.pending, (state) => { state.isLoading = true; })
      .addCase(addComment.fulfilled, (state) => { state.isLoading = false; })
      .addCase(addComment.rejected, (state) => { state.isLoading = false; });
  },
});

export default commentsSlice.reducer;
