import { useEffect, useState } from 'react';
import { Box, Avatar, Typography, Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { storiesApi } from '../../utils/api';
import type { Story } from '../../types';

const StoryBar = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storiesApi.getAll().then(res => { setStories(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
      {/* Add story */}
      <Box sx={{ flexShrink: 0, textAlign: 'center', cursor: 'pointer' }}>
        <Box sx={{ width: 64, height: 64, borderRadius: '50%', border: '2px dashed', borderColor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
          <AddIcon color="primary" />
        </Box>
        <Typography variant="caption" color="text.secondary">Your story</Typography>
      </Box>

      {loading ? Array.from({ length: 4 }).map((_, i) => (
        <Box key={i} sx={{ flexShrink: 0, textAlign: 'center' }}>
          <Skeleton variant="circular" width={64} height={64} sx={{ mb: 0.5 }} />
          <Skeleton width={50} height={12} />
        </Box>
      )) : stories.map(story => (
        <Box key={story.id} sx={{ flexShrink: 0, textAlign: 'center', cursor: 'pointer' }}>
          <Box sx={{
            width: 64, height: 64, borderRadius: '50%', p: '2px',
            background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
            mb: 0.5,
          }}>
            <Avatar src={story.user?.avatar} sx={{ width: '100%', height: '100%', border: '2px solid', borderColor: 'background.paper' }}>
              {story.user?.name[0]}
            </Avatar>
          </Box>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 64, display: 'block' }}>
            {story.user?.name.split(' ')[0]}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default StoryBar;
