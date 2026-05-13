import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Avatar, Button,
  Card, CardContent, CircularProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppSelector } from '../../app/hooks';
import { usersApi, postsApi } from '../../utils/api';
import PostCard from '../../components/PostCard/PostCard';
import type { User, Post } from '../../types';

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAppSelector(s => s.auth.user);
  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwn = currentUser?.id === id;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      usersApi.getById(id),
      postsApi.getByUser(id),
    ]).then(([userRes, postsRes]) => {
      setProfile(userRes.data);
      setPosts(postsRes.data.posts);
      setFollowing(currentUser ? userRes.data.followers.includes(currentUser.id) : false);
    }).finally(() => setLoading(false));
  }, [id, currentUser]);

  const handleFollow = async () => {
    if (!currentUser || !profile) return;
    setFollowLoading(true);
    try {
      await usersApi.follow(profile.id);
      setFollowing(!following);
      setProfile(p => p ? { ...p, followers: following ? p.followers.filter(f => f !== currentUser.id) : [...p.followers, currentUser.id] } : p);
    } finally { setFollowLoading(false); }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
  if (!profile) return <Container sx={{ py: 8, textAlign: 'center' }}><Typography color="text.secondary">User not found</Typography></Container>;

  return (
    <Box sx={{ py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="md">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2, color: 'text.secondary' }}>Back</Button>

        <Card sx={{ mb: 3 }}>
          {/* Cover */}
          <Box sx={{ height: 180, background: 'linear-gradient(135deg, #1976D2, #42A5F5)', position: 'relative' }}>
            <Avatar src={profile.avatar} sx={{
              width: 90, height: 90, border: '4px solid', borderColor: 'background.paper',
              position: 'absolute', bottom: -45, left: 24, fontSize: 32, fontWeight: 700,
            }}>{profile.name[0]}</Avatar>
          </Box>
          <CardContent sx={{ pt: 7, pb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h5" fontWeight={900}>{profile.name}</Typography>
                {profile.bio && <Typography variant="body2" color="text.secondary" mt={0.5} mb={1}>{profile.bio}</Typography>}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {profile.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                      <LocationOnIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                      <Typography variant="caption" color="text.secondary">{profile.location}</Typography>
                    </Box>
                  )}
                  {profile.website && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                      <LinkIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                      <Typography variant="caption" color="primary" component="a" href={profile.website} target="_blank" rel="noopener">{profile.website}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                    <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.secondary">Joined {profile.joinedAt}</Typography>
                  </Box>
                </Box>
              </Box>
              {!isOwn && currentUser && (
                <Button variant={following ? 'outlined' : 'contained'} onClick={handleFollow} disabled={followLoading} sx={{ borderRadius: 8 }}>
                  {following ? 'Following' : 'Follow'}
                </Button>
              )}
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              <Box><Typography variant="h6" fontWeight={900}>{posts.length}</Typography><Typography variant="caption" color="text.secondary">Posts</Typography></Box>
              <Box><Typography variant="h6" fontWeight={900}>{profile.followers.length}</Typography><Typography variant="caption" color="text.secondary">Followers</Typography></Box>
              <Box><Typography variant="h6" fontWeight={900}>{profile.following.length}</Typography><Typography variant="caption" color="text.secondary">Following</Typography></Box>
            </Box>
          </CardContent>
        </Card>

        {/* Posts */}
        <Typography variant="h6" fontWeight={800} mb={2}>Posts</Typography>
        {posts.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>No posts yet</Typography>
        ) : (
          posts.map(p => <PostCard key={p.id} post={p} />)
        )}
      </Container>
    </Box>
  );
};

export default Profile;
