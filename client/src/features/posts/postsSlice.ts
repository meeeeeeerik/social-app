import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Post, PostsState } from '../../types';
import { postsApi } from '../../utils/api';

const initialState: PostsState = {
  posts: [], isLoading: false, isCreating: false, error: null, page: 1, hasMore: true,
};

export const fetchFeed = createAsyncThunk('posts/feed', async (page: number = 1, { rejectWithValue }) => {
  try {
    const res = await postsApi.getFeed(page);
    return { ...res.data, replace: page === 1 };
  } catch { return rejectWithValue('Failed to load posts'); }
});

export const createPost = createAsyncThunk('posts/create', async ({ content, image, tags }: { content: string; image: string; tags: string[] }, { rejectWithValue }) => {
  try {
    const res = await postsApi.create(content, image, tags);
    return res.data as Post;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } } };
    return rejectWithValue(error.response?.data?.error || 'Failed to create post');
  }
});

export const likePost = createAsyncThunk('posts/like', async (postId: string, { rejectWithValue }) => {
  try {
    const res = await postsApi.like(postId);
    return { postId, ...res.data };
  } catch { return rejectWithValue('Failed to like post'); }
});

export const deletePost = createAsyncThunk('posts/delete', async (postId: string, { rejectWithValue }) => {
  try {
    await postsApi.delete(postId);
    return postId;
  } catch { return rejectWithValue('Failed to delete post'); }
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addCommentToPost: (state, action: PayloadAction<{ postId: string; comment: Post['comments'][0] }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) { post.comments.push(action.payload.comment); post.commentsCount++; }
    },
    removeCommentFromPost: (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) { post.comments = post.comments.filter(c => c.id !== action.payload.commentId); post.commentsCount--; }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.replace ? action.payload.posts : [...state.posts, ...action.payload.posts];
        state.page = action.payload.page;
        state.hasMore = state.posts.length < action.payload.total;
      })
      .addCase(fetchFeed.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(createPost.pending, (state) => { state.isCreating = true; })
      .addCase(createPost.fulfilled, (state, action) => { state.isCreating = false; state.posts.unshift(action.payload); })
      .addCase(createPost.rejected, (state) => { state.isCreating = false; })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) { post.likesCount = action.payload.likesCount; post.likes = action.payload.likes; }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p.id !== action.payload);
      });
  },
});

export const { addCommentToPost, removeCommentFromPost } = postsSlice.actions;
export default postsSlice.reducer;
