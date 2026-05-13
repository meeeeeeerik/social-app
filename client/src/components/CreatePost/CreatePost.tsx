import { useState } from 'react';
import {
  Card, CardContent, Box, Avatar, TextField, Button,
  IconButton, Collapse, Chip, CircularProgress,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import TagIcon from '@mui/icons-material/Tag';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createPost } from '../../features/posts/postsSlice';

const CreatePost = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const isCreating = useAppSelector(s => s.posts.isCreating);
  const [focused, setFocused] = useState(false);
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showImage, setShowImage] = useState(false);
  const [showTags, setShowTags] = useState(false);

  if (!user) return null;

  const handlePost = async () => {
    if (!content.trim()) return;
    await dispatch(createPost({ content, image, tags }));
    setContent(''); setImage(''); setTags([]); setTagInput(''); setFocused(false); setShowImage(false); setShowTags(false);
  };

  const addTag = () => {
    const tag = tagInput.trim().replace('#', '').toLowerCase();
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setTagInput('');
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Avatar src={user.avatar} sx={{ width: 42, height: 42, flexShrink: 0 }}>{user.name[0]}</Avatar>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth multiline placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
              value={content} onChange={e => setContent(e.target.value)}
              onFocus={() => setFocused(true)} rows={focused ? 3 : 1}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, backgroundColor: 'action.hover', '& fieldset': { border: 'none' } } }}
            />

            <Collapse in={focused}>
              <Box sx={{ mt: 1 }}>
                {showImage && (
                  <TextField
                    fullWidth size="small" placeholder="Paste image URL..."
                    value={image} onChange={e => setImage(e.target.value)}
                    sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                )}
                {showTags && (
                  <Box sx={{ mb: 1 }}>
                    <TextField
                      size="small" placeholder="Add tag and press Enter"
                      value={tagInput} onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 }, mr: 1 }}
                    />
                    <Box sx={{ display: 'inline-flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                      {tags.map(t => <Chip key={t} label={`#${t}`} size="small" onDelete={() => setTags(tags.filter(x => x !== t))} color="primary" variant="outlined" sx={{ height: 22, fontSize: 11 }} />)}
                    </Box>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => setShowImage(!showImage)} color={showImage ? 'primary' : 'default'}><ImageIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => setShowTags(!showTags)} color={showTags ? 'primary' : 'default'}><TagIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => { setFocused(false); setContent(''); setImage(''); setTags([]); }}><CloseIcon fontSize="small" /></IconButton>
                  </Box>
                  <Button variant="contained" size="small" onClick={handlePost} disabled={!content.trim() || isCreating}
                    sx={{ borderRadius: 8, px: 3 }}>
                    {isCreating ? <CircularProgress size={16} color="inherit" /> : 'Post'}
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
