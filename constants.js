const botNames = ["Bot1", "Bot2"];
const profilePics = ["pic1.jpg", "pic2.jpg"];
const messageTemplates = ["Hello!", "How are you?"];
const reactions = ["😂", "❤️", "🔥"];
const botMessages = ["Welcome to the stream!", "Enjoy!"];

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
  const botName = botNames[Math.floor(Math.random() * botNames.length)];
  const profilePic = profilePics[Math.floor(Math.random() * profilePics.length)];
  const message = botMessages[Math.floor(Math.random() * botMessages.length)];

  return {
    id: Date.now().toString(),
    user: botName,
    text: message,
    profilePic,
    timestamp: new Date().toISOString(),
    isBot: true
  };
};

export default {
  botNames,
  profilePics,
  messageTemplates,
  reactions,
  botMessages,
  generateFakeComment,
  generateBotMessage
};
