import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Avatar, Typography, Button } from '@mui/material';
import { usersApi } from '../../utils/api';
import { useAppSelector } from '../../app/hooks';
import type { User } from '../../types';

const UserCard = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(s => s.auth.user);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    setLoading(true);
    try {
      await usersApi.follow(user.id);
      setFollowing(!following);
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
      <Avatar src={user.avatar} onClick={() => navigate(`/profile/${user.id}`)}
        sx={{ width: 40, height: 40, cursor: 'pointer' }}>{user.name[0]}</Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={700} noWrap sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
          onClick={() => navigate(`/profile/${user.id}`)}>
          {user.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap display="block">{user.bio || `${user.followers.length} followers`}</Typography>
      </Box>
      {currentUser && currentUser.id !== user.id && (
        <Button size="small" variant={following ? 'outlined' : 'contained'} onClick={handleFollow} disabled={loading}
          sx={{ borderRadius: 8, fontSize: 11, px: 1.5, py: 0.3, minWidth: 70 }}>
          {following ? 'Following' : 'Follow'}
        </Button>
      )}
    </Box>
  );
};

export default UserCard;
