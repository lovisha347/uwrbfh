// routes/api.comments.js
import express from 'express';
const router = express.Router();

// In-memory store for comments (replace with database in production)
let comments = [];

// Get all comments
router.get('/', (req, res) => {
  res.json(comments);
});

// Create a new comment
router.post('/', (req, res) => {
  const { text, userId } = req.body;
  
  if (!text || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newComment = {
    id: Date.now().toString(),
    text,
    userId,
    timestamp: new Date().toISOString(),
    likes: 0
  };

  comments.push(newComment);
  res.status(201).json(newComment);
});

// Middleware to find comment by ID
router.param('commentId', (req, res, next, id) => {
  const comment = comments.find(c => c.id === id);
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  req.comment = comment;
  next();
});

// Update a comment
router.patch('/:commentId', (req, res) => {
  const { text } = req.body;
  if (text) {
    req.comment.text = text;
    req.comment.edited = true;
    req.comment.editedAt = new Date().toISOString();
  }
  res.json(req.comment);
});

// Delete a comment
router.delete('/:commentId', (req, res) => {
  comments = comments.filter(c => c.id !== req.comment.id);
  res.status(204).send();
});

// Like a comment
router.post('/:commentId/like', (req, res) => {
  req.comment.likes += 1;
  res.json(req.comment);
});

export default router;
