// routes/api.constants.js
import express from 'express';
import constants from '../constants.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ 
    botNames: constants.botNames,
    profilePics: constants.profilePics,
    messageTemplates: constants.messageTemplates,
    reactions: constants.reactions,
    botMessages: constants.BOT_MESSAGES
  });
});

router.post('/', (req, res) => {
  const { type, data } = req.body;
  const validTypes = ["botNames", "profilePics", "messageTemplates", "reactions", "botMessages"];
  
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  constants[type] = [...data];
  res.json({ success: true, message: `${type} updated` });
});

export default router;
