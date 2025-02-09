// Bot names and profile pictures
const botNames = [
  'alex',
  'john',
  'harry',
  'henry',
  'kishan',
  'StreamMod',
  'ChatGuide',
  'StreamAssist',
  'ViewerGuide',
  'ChatHelper'
];

const profilePics = [
  '😺', '🐶', '🐯', '🦁', '🐯', '🐭', '🐞', '🪲', '🪰', '🦟', '🪳'
];

// Different types of messages for variety
const messageTemplates = [
  'Hello everyone! Welcome to the stream! 👋',
  'Amazing stream! Keep it up! 🔥',
  'This is so entertaining! 🎉',
  'Thanks for streaming! 🙏',
  'Great content as always! ⭐',
  'Love the energy here! ✨',
  'This is exactly what I needed today! 💫',
  'You\'re doing great! 👍',
  'Can\'t wait to see what\'s next! 🎯',
  'This stream is fire! 🔥',
  'Such a great community here! 💖',
  'This is awesome! 🌟',
  'Keep up the good work! 💪',
  'Loving the stream! ❤️',
  'This is so much fun! 🎮'
];

const reactions = [
  '👍', '❤️', '🎉', '👏', '🔥', '⭐', '💫', '✨', '💖', '🙏'
];

const BOT_MESSAGES = {
  welcome: 'Welcome to the stream! 👋',
  greeting: 'Hello, how are you? 👋',
  question: 'What\'s up? 🤔',
  casual: 'How\'s it going? 😊',
  introduction: 'Hi, I\'m a bot! 🤖',
  engagement: 'What\'s on your mind? 💭',
  reminder: 'Don\'t forget to follow! 🌟',
  encouragement: 'Having a great time? Let us know! 💬',
  gratitude: 'Thanks for being here! 🙏',
  interaction: 'Feel free to ask questions! 🤔',
  health: 'Remember to stay hydrated! 💧',
  share: 'Enjoying the stream? Share it! 🎉',
  support: 'Your support means a lot! ❤️',
  activity: 'What\'s everyone up to? 🎮',
  vibe: 'Great vibes in the chat! 🎵'
};

// Helper function to generate fake comments
const generateFakeComment = () => {
  const botName = botNames[Math.floor(Math.random() * botNames.length)];
  const message = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
  const profilePic = profilePics[Math.floor(Math.random() * profilePics.length)];
  const reaction = reactions[Math.floor(Math.random() * reactions.length)];
  
  return {
    id: Date.now().toString(),
    user: botName,
    text: message,
    profilePic,
    reaction,
    timestamp: new Date().toISOString(),
    likes: Math.floor(Math.random() * 100),
    isBot: true
  };
};

// Helper function to generate a bot message
const generateBotMessage = () => {
  const messageTypes = Object.keys(BOT_MESSAGES);
  const randomType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
  const botName = botNames[Math.floor(Math.random() * botNames.length)];
  const profilePic = profilePics[Math.floor(Math.random() * profilePics.length)];
  
  return {
    id: Date.now().toString(),
    user: botName,
    text: BOT_MESSAGES[randomType],
    profilePic,
    timestamp: new Date().toISOString(),
    type: randomType,
    isBot: true
  };
};

export default {
  botNames,
  profilePics,
  messageTemplates,
  reactions,
  BOT_MESSAGES,
  generateFakeComment,
  generateBotMessage
};
