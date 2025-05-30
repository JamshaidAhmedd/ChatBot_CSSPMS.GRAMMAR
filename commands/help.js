// Simple help command that shows the main menu again or some help text

const { getMainMenu } = require("./menu");

async function sendHelp(sock, chatId) {
  const helpText = `Hello! I'm here to assist you with your queries.

You can type:
- "Menu" to see the main options.
- Numbers (1-5) to navigate the menu.
- Course names or FAQ topics for detailed info.
- Or type "Speak" to chat with a human.

${getMainMenu()}`;

  await sock.sendMessage(chatId, { text: helpText });
}

module.exports = {
  sendHelp,
};
