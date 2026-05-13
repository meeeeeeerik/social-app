export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  followers: string[];
  following: string[];
  joinedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User | null;
  content: string;
  likes: string[];
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: User | null;
  content: string;
  image: string;
  likes: string[];
  likesCount: number;
  comments: Comment[];
  commentsCount: number;
  tags: string[];
  createdAt: string;
}

export interface Story {
  id: string;
  userId: string;
  user: User | null;
  image: string;
  expiresAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface PostsState {
  posts: Post[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}
