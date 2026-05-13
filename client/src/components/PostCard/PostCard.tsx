import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardMedia, Box, Typography,
  Avatar, IconButton, Chip, Divider, Tooltip, Button,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { likePost, deletePost } from '../../features/posts/postsSlice';
import CommentSection from '../CommentSection/CommentSection';
import { timeAgo } from '../../utils/format';
import type { Post } from '../../types';

const PostCard = ({ post }: { post: Post }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(s => s.auth.user);
  const [showComments, setShowComments] = useState(false);

  const isLiked = user ? post.likes.includes(user.id) : false;
  const isOwner = user?.id === post.authorId;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ pb: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar
            src={post.author?.avatar}
            onClick={() => post.author && navigate(`/profile/${post.author.id}`)}
            sx={{ width: 42, height: 42, cursor: 'pointer', border: '2px solid', borderColor: 'primary.main' }}
          >
            {post.author?.name[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body1" fontWeight={700} sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
              onClick={() => post.author && navigate(`/profile/${post.author.id}`)}>
              {post.author?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {timeAgo(post.createdAt)}
            </Typography>
          </Box>
          {isOwner && (
            <Tooltip title="Delete post">
              <IconButton size="small" onClick={() => dispatch(deletePost(post.id))} sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Content */}
        <Typography variant="body1" sx={{ mb: 1.5, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {post.content}
        </Typography>

        {/* Tags */}
        {post.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
            {post.tags.map(tag => (
              <Chip key={tag} label={`#${tag}`} size="small" variant="outlined"
                sx={{ fontSize: 11, height: 20, borderColor: 'primary.main', color: 'primary.main' }} />
            ))}
          </Box>
        )}
      </CardContent>

      {/* Image */}
      {post.image && (
        <CardMedia component="img" image={post.image} alt="post" sx={{ maxHeight: 400, objectFit: 'cover' }} />
      )}

      {/* Actions */}
      <CardContent sx={{ pt: 1, pb: 1, '&:last-child': { pb: 1 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {post.likesCount > 0 && `${post.likesCount} like${post.likesCount > 1 ? 's' : ''}`}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {post.commentsCount > 0 && `${post.commentsCount} comment${post.commentsCount > 1 ? 's' : ''}`}
          </Typography>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={isLiked ? <FavoriteIcon sx={{ color: 'error.main' }} /> : <FavoriteBorderIcon />}
            onClick={() => user ? dispatch(likePost(post.id)) : navigate('/auth')}
            sx={{ flex: 1, color: isLiked ? 'error.main' : 'text.secondary', fontWeight: isLiked ? 700 : 500 }}
            size="small"
          >
            Like
          </Button>
          <Button
            startIcon={<ChatBubbleOutlineIcon />}
            onClick={() => user ? setShowComments(!showComments) : navigate('/auth')}
            sx={{ flex: 1, color: 'text.secondary' }}
            size="small"
          >
            Comment
          </Button>
        </Box>

        {/* Comments */}
        {showComments && (
          <Box sx={{ mt: 1.5 }}>
            <Divider sx={{ mb: 1.5 }} />
            <CommentSection postId={post.id} comments={post.comments} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
