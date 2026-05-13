import { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, Skeleton, Button, Divider, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchFeed } from '../../features/posts/postsSlice';
import PostCard from '../../components/PostCard/PostCard';
import CreatePost from '../../components/CreatePost/CreatePost';
import StoryBar from '../../components/StoryBar/StoryBar';
import UserCard from '../../components/UserCard/UserCard';
import { usersApi } from '../../utils/api';
import type { User } from '../../types';

const Feed = () => {
  const dispatch = useAppDispatch();
  const { posts, isLoading, hasMore, page } = useAppSelector(s => s.posts);
  const user = useAppSelector(s => s.auth.user);
  const [suggestions, setSuggestions] = useState<User[]>([]);

  useEffect(() => {
    dispatch(fetchFeed(1));
  }, []);

  useEffect(() => {
    if (user) {
      usersApi.suggestions(user.id).then(res => setSuggestions(res.data)).catch(() => {});
    } else {
      usersApi.getAll().then(res => setSuggestions(res.data.slice(0, 4))).catch(() => {});
    }
  }, [user]);

  const handleLoadMore = () => dispatch(fetchFeed(page + 1));

  return (
    <Box sx={{ py: { xs: 2, sm: 3 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Feed */}
          <Grid item xs={12} md={8}>
            {/* Stories */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <StoryBar />
              </CardContent>
            </Card>

            {/* Create post */}
            <CreatePost />

            {/* Posts */}
            {isLoading && posts.length === 0 ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                      <Skeleton variant="circular" width={42} height={42} />
                      <Box sx={{ flex: 1 }}><Skeleton width="40%" /><Skeleton width="20%" /></Box>
                    </Box>
                    <Skeleton variant="text" /><Skeleton variant="text" width="80%" />
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mt: 1 }} />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                {posts.map(post => <PostCard key={post.id} post={post} />)}
                {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress /></Box>}
                {!isLoading && hasMore && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button variant="outlined" onClick={handleLoadMore} sx={{ borderRadius: 8, px: 4 }}>Load More</Button>
                  </Box>
                )}
                {!hasMore && posts.length > 0 && (
                  <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>You're all caught up! 🎉</Typography>
                )}
              </>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 80 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Current user */}
              {user && (
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box component="img" src={user.avatar} sx={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid', borderColor: 'primary.main' }} />
                      <Box>
                        <Typography variant="body1" fontWeight={700}>{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{user.bio || user.email}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" fontWeight={800}>{user.followers.length}</Typography>
                        <Typography variant="caption" color="text.secondary">Followers</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" fontWeight={800}>{user.following.length}</Typography>
                        <Typography variant="caption" color="text.secondary">Following</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" fontWeight={800} mb={1}>
                      {user ? 'People You May Know' : 'Who to Follow'}
                    </Typography>
                    <Divider sx={{ mb: 1.5 }} />
                    {suggestions.map(s => <UserCard key={s.id} user={s} />)}
                  </CardContent>
                </Card>
              )}

              {/* Footer */}
              <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                © {new Date().getFullYear()} SocialHub · Built with React + Redux + Node.js
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Feed;
