const botNames = ["Crypto God", "Hodi", "Chads in", "Dianmonds hands", "Moon or dust", "CJ", "Liam", "Chris", "Sand", "Jeff", "Jason", "Remy"];
const profilePics = ['😺','🐶','🐯','🦁','🐭','🐞','🪲','🪰','🦟','🪳'];
const messageTemplates = ["yo", "wait this is real", "i need a gf so bad", "ur hot", "marry me", "buying more rn", "send this to vahalla", "ma'am marry me", "I'll give you $10k if you marry me", "What's your Onlyfans?", "Why you so hot?", "wow", "Loading up", "Let's go", "yall are down bad"];
const reactions = ["😂", "❤️", "🔥"];
const botMessages = ["", "Enjoy!"];

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
