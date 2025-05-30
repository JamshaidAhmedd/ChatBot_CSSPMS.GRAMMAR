const {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const { getMainMenu, handleMenuSelection } = require("./commands/menu");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");
  const sock = makeWASocket({
    logger: pino({ level: "info" }),
    printQRInTerminal: true,
    auth: state,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (msgUpdate) => {
    const { messages, type } = msgUpdate;
    if (type !== "notify" || !messages?.length) return;

    const message = messages[0];
    const chatId = message.key.remoteJid;
    const senderId = message.key.participant || chatId;

    // Extract text
    let userText = "";
    if (message.message?.conversation) {
      userText = message.message.conversation;
    } else if (message.message?.extendedTextMessage?.text) {
      userText = message.message.extendedTextMessage.text;
    }
    userText = (userText || "").trim();
    const lower = userText.toLowerCase();

    console.log("[LOG]", chatId, senderId, "->", userText);

    // Initial Greeting with quick reply options
    if (["hi", "hello"].includes(lower)) {
      await sock.sendMessage(chatId, {
        text: `Hello and welcome to CSSPMS Grammar Bot! 👋
  
  How can I assist you today? Please choose one of the following:
  1️⃣ *Academy Info*  
  2️⃣ *Contact Us*  
  3️⃣ *Courses & Sessions*  
  4️⃣ *FAQs*  
  5️⃣ *Speak to a Person*  
  
  Just type a number (1–5) or type “Menu” to see the options again.`,
      });
      return;
    }

    // Handle Menu or Help
    if (["menu", "help"].includes(lower)) {
      await sock.sendMessage(chatId, {
        text: getMainMenu(),
      });
      return;
    }

    // Menu Selection Handling
    const handled = await handleMenuSelection(sock, chatId, lower);
    if (handled) return;

    // Fallback for unrecognized input
    await sock.sendMessage(chatId, {
      text: `I'm sorry, I didn't quite understand that. Please type "Menu" to see available options or type "Help" for guidance.`,
    });
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) {
        console.log("Reconnecting...");
        startBot();
      } else {
        console.log("❌ Logged out. Please delete auth folder and re-scan.");
      }
    } else if (connection === "open") {
      console.log(`✅ Bot connected as: CSSPMS Grammar Bot`);
    }
  });
}

startBot().catch((err) => {
  console.error("Bot start error:", err);
});
