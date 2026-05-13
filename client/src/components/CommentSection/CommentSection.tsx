import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Avatar, Typography, TextField, IconButton, CircularProgress, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addComment, deleteComment } from '../../features/comments/commentsSlice';
import { timeAgo } from '../../utils/format';
import type { Comment } from '../../types';

interface Props { postId: string; comments: Comment[]; }

const CommentSection = ({ postId, comments }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(s => s.auth.user);
  const isLoading = useAppSelector(s => s.comments.isLoading);
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    if (!text.trim() || !user) return;
    await dispatch(addComment({ postId, content: text.trim() }));
    setText('');
  };

  return (
    <Box>
      {/* Comments list */}
      {comments.map(c => (
        <Box key={c.id} sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
          <Avatar src={c.author?.avatar} sx={{ width: 32, height: 32, flexShrink: 0 }}>{c.author?.name[0]}</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ backgroundColor: 'action.hover', borderRadius: 2, px: 1.5, py: 1, display: 'inline-block', maxWidth: '100%' }}>
              <Typography variant="caption" fontWeight={700} display="block">{c.author?.name}</Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{c.content}</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{timeAgo(c.createdAt)}</Typography>
          </Box>
          {user?.id === c.authorId && (
            <IconButton size="small" onClick={() => dispatch(deleteComment({ commentId: c.id, postId }))} sx={{ color: 'text.disabled', alignSelf: 'flex-start', mt: 0.5 }}>
              <DeleteIcon sx={{ fontSize: 14 }} />
            </IconButton>
          )}
        </Box>
      ))}

      {/* Add comment */}
      {user ? (
        <Box sx={{ display: 'flex', gap: 1, mt: 1.5, alignItems: 'center' }}>
          <Avatar src={user.avatar} sx={{ width: 32, height: 32, flexShrink: 0 }}>{user.name[0]}</Avatar>
          <TextField
            fullWidth size="small" placeholder="Write a comment..."
            value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 50, backgroundColor: 'action.hover', '& fieldset': { border: 'none' } } }}
          />
          <IconButton onClick={handleSubmit} disabled={!text.trim() || isLoading} color="primary" size="small">
            {isLoading ? <CircularProgress size={18} /> : <SendIcon fontSize="small" />}
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1.5, py: 1.5, borderRadius: 2, backgroundColor: 'action.hover' }}>
          <LockOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Sign in to leave a comment —{' '}
            <Button variant="text" size="small" sx={{ p: 0, minWidth: 0, fontWeight: 700 }} onClick={() => navigate('/auth')}>
              Log in / Register
            </Button>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CommentSection;
