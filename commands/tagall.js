/**
 * Tag all members in a group with a custom message.
 * Usage: .tagall <optional message>
 */

async function tagAll(sock, message) {
  const chatId = message.key.remoteJid;

  // Only allow tagging in groups
  if (!chatId.endsWith("@g.us")) {
    await sock.sendMessage(chatId, {
      text: "This command can only be used in groups.",
    });
    return;
  }

  const groupMetadata = await sock.groupMetadata(chatId);
  const participants = groupMetadata.participants;

  // Extract custom message if any, after the command '.tagall'
  let userMsg = "";
  if (message.message?.conversation) {
    const fullText = message.message.conversation;
    const parts = fullText.split(" ");
    parts.shift(); // remove the command part
    userMsg = parts.join(" ").trim();
  }

  // Build mentions array and message text
  const mentions = participants.map((p) => p.id);
  let text = userMsg || "Hello everyone!";

  text += `\n\n*Tagging all members (${mentions.length}):*`;

  // Send the message with mentions
  await sock.sendMessage(chatId, {
    text,
    mentions,
  });
}

module.exports = {
  tagAll,
};
