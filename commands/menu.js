const settings = require("../settings");

// Import course details from separate files
const grammar = require("../courses/grammar");
const vocabulary = require("../courses/vocabulary");
const evaluation = require("../courses/evaluation");
const dawn = require("../courses/dawn");
const faq = require("../courses/faq");

// Define the main menu options
function getMainMenu() {
  return `I can help you with these options:

1️⃣ *Academy Info* — Learn about CSSPMS Academy’s background, mission, and offerings.
2️⃣ *Contact Us* — Get our official phone number, email, or social links.
3️⃣ *Courses & Sessions* — Explore English Grammar, Vocabulary Sessions, Evaluation Sessions, and Dawn Grammatical Sentence Structure sessions.
4️⃣ *FAQs* — Frequently asked questions about enrollment, scheduling, fees, etc.
5️⃣ *Speak to a Person* — If you prefer one-on-one chat with a human, choose this.

Reply with a number (1–5) or type the name of an option.`;
}

// Handle user's menu selection based on input
async function handleMenuSelection(sock, chatId, userText) {
  const lower = userText.toLowerCase().trim();

  // Option 1: Academy Info
  if (lower === "1" || lower === "academy info") {
    await sock.sendMessage(chatId, {
      text: `🟩 *Academy Info* 🟩

CSSPMS Academy is dedicated to providing comprehensive language courses with a focus on:
• English Grammar  
• Writing Skills  
• Communication & Fluency

We’ve been training students worldwide since 2010. 
Our mission: Empower learners with high-quality, affordable education.

Type "Menu" to return to the main menu, or "2" to see our contact details next!`,
    });
    return true;
  }

  // Option 2: Contact Info
  if (lower === "2" || lower === "contact") {
    await sock.sendMessage(chatId, {
      text: `📞 *Contact Info*:

• Phone: +923265511188
• Email: csspms.grammar@gmail.com
• Website: https://csspmsgrammar.github.io/LinkTree/
• WhatsApp: +923265511188

Type "Menu" to return.`,
    });
    return true;
  }

  // Option 3: Courses & Sessions
  if (lower === "3" || lower === "courses") {
    await sock.sendMessage(chatId, {
      text: `Here are the main sessions we offer:

1️⃣ *English Grammar Session*  
2️⃣ *Vocabulary Session*  
3️⃣ *Evaluation Session*  
4️⃣ *Dawn Grammatical Sentence Structure Session*

Type the *number* of the course you’re interested in, or "Menu" to return.`,
    });
    return true;
  }

  // Handle Course Selection
  if (lower === "1" || lower === "english grammar") {
    await sock.sendMessage(chatId, { text: grammar });
    return true;
  }
  if (lower === "2" || lower === "vocabulary") {
    await sock.sendMessage(chatId, { text: vocabulary });
    return true;
  }
  if (lower === "3" || lower === "evaluation") {
    await sock.sendMessage(chatId, { text: evaluation });
    return true;
  }
  if (lower === "4" || lower === "dawn") {
    await sock.sendMessage(chatId, { text: dawn });
    return true;
  }

  // Option 4: FAQs
  if (lower === "4" || lower === "faq") {
    await sock.sendMessage(chatId, {
      text: `Here are our commonly asked questions:

1️⃣ *Enrollment & Fees*  
2️⃣ *Course Schedule*  
3️⃣ *Certification*  
4️⃣ *Technical Support*

Reply with a number (1–4) to see details, or type "Menu" to return.`,
    });
    return true;
  }

  // Handle FAQ selection - get from faq file (an object with details)
  if (["1", "enrollment & fees"].includes(lower)) {
    await sock.sendMessage(chatId, { text: faq.enrollment });
    return true;
  }
  if (["2", "course schedule"].includes(lower)) {
    await sock.sendMessage(chatId, { text: faq.schedule });
    return true;
  }
  if (["3", "certification"].includes(lower)) {
    await sock.sendMessage(chatId, { text: faq.certification });
    return true;
  }
  if (["4", "technical support"].includes(lower)) {
    await sock.sendMessage(chatId, { text: faq.techSupport });
    return true;
  }

  // Option 5: Speak to a Person
  if (lower === "5" || lower === "speak") {
    await sock.sendMessage(chatId, {
      text: `Okay! I'll forward your request to our support team. 
A real person will be with you soon.

Meanwhile, if there’s anything else, type “Menu”.`,
    });
    return true;
  }

  // Unrecognized input fallback
  return false;
}

module.exports = {
  getMainMenu,
  handleMenuSelection,
};
