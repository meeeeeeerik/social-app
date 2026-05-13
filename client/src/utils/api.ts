import axios from "axios";

// Base API client — all requests go through here
export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Automatically attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("social_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle token expiry globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("social_token");
      localStorage.removeItem("social_user");
    }
    return Promise.reject(err);
  },
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post("/auth/register", { name, email, password }),
  me: () => api.get("/auth/me"),
};

export const postsApi = {
  getFeed: (page = 1) => api.get(`/posts?page=${page}&limit=10`),
  getByUser: (userId: string) => api.get(`/posts/user/${userId}`),
  create: (content: string, image: string, tags: string[]) =>
    api.post("/posts", { content, image, tags }),
  delete: (id: string) => api.delete(`/posts/${id}`),
  like: (id: string) => api.post(`/posts/${id}/like`),
};

export const commentsApi = {
  add: (postId: string, content: string) =>
    api.post("/comments", { postId, content }),
  delete: (id: string) => api.delete(`/comments/${id}`),
};

export const usersApi = {
  getAll: () => api.get("/users"),
  getById: (id: string) => api.get(`/users/${id}`),
  updateMe: (data: object) => api.put("/users/me", data),
  follow: (id: string) => api.post(`/users/${id}/follow`),
  suggestions: (id: string) => api.get(`/users/${id}/suggestions`),
};

export const storiesApi = {
  getAll: () => api.get("/stories"),
};
