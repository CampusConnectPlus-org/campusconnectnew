// // utils/moderationAI.js

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const checkModeration = async (text) => {
//   try {
//     // ✅ Gemini model initialize
//  const model = genAI.getGenerativeModel({
//       model: "gemini-2.0-flash"
//     });

//     const prompt = `
// You are a strict content moderator for a college campus social app in India.

// Analyze the given content and reply ONLY in valid JSON.

// Content: "${text}"

// Flag as offensive (isOffensive: true) if content contains ANY of these:
// - Violence or threats
// - Hate speech against religion, caste, gender, race
// - Sexual or explicit content
// - Bullying or personal attacks
// - Abusive words in English, Hindi, Hinglish
// - Self harm suggestions
// - Stretched abusive words like "KILLLLL", "stuuupid"

// Reply ONLY like this:

// {
//   "isOffensive": true or false,
//   "reason": "short reason if offensive, else null",
//   "severity": "low" or "medium" or "high" or null
// }
// `;

//     // ✅ Generate content
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const rawText = response.text();

//     console.log("🔥 RAW Gemini response:", rawText);

//     // ✅ Clean markdown if Gemini adds ```json
//     const cleanText = rawText
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     // ✅ Safe JSON parse
//     try {
//       return JSON.parse(cleanText);
//     } catch (parseError) {
//       console.error("JSON Parse Error:", parseError);

//       return {
//         isOffensive: false,
//         reason: "Invalid AI response format",
//         severity: null
//       };
//     }

//   } catch (err) {
//     console.error("Moderation error:", err);

//     return {
//       isOffensive: false,
//       reason: null,
//       severity: null
//     };
//   }
// };

// module.exports = { checkModeration };
// utils/moderationAI.js

// utils/moderationAI.js
// utils/moderationAI.js
// utils/moderationAI.js
// utils/moderationAI.js
// const axios = require("axios");

// const checkModeration = async (text) => {
//   try {
//     const response = await axios({
//       method: "post",
//       url: "https://api-inference.huggingface.co/models/unitary/toxic-bert",
//       data: { inputs: text },
//       headers: {
//         "Authorization": `Bearer ${process.env.HF_API_KEY}`,
//         "Content-Type": "application/json"
//       },
//       // DNS override bypass karne ke liye
//       proxy: false,
//       timeout: 15000
//     });

//     console.log("RAW HF RESPONSE:", response.data);

//     const results = response.data[0] || [];
//     let toxicScore = 0;

//     for (const item of results) {
//       if (item.label?.toLowerCase().includes("toxic")) {
//         toxicScore = Math.max(toxicScore, item.score);
//       }
//     }

//     const isOffensive = toxicScore > 0.7;
//     return {
//       isOffensive,
//       reason: isOffensive ? `Toxic content (${Math.round(toxicScore * 100)}%)` : null,
//       severity: toxicScore > 0.9 ? "high" : toxicScore > 0.7 ? "medium" : null
//     };

//   } catch (err) {
//     console.error("Moderation error:", err.response?.data || err.message);
//     return { isOffensive: false, reason: null, severity: null };
//   }
// };

// module.exports = { checkModeration };
// utils/moderationAI.js
//--------------------------------------------------------------------------------------//
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Local offensive words list
// const offensiveWords = [
//   // English
//   "fuck",
//   "shit",
//   "bitch",
//   "bastard",
//   "asshole",
//   "kill yourself",
//   "rape",
//   "idiot",
//   "stupid",
//   "loser",
//   "die",
//   // Hindi/Hinglish
//   "chutiya",
//   "madarchod",
//   "behenchod",
//   "gandu",
//   "harami",
//   "randi",
//   "bhosdi",
//   "mc",
//   "bc",
//   "lodu",
//   "bhosdike",
//   "lund",
//   "lavda",
//   "gaandu",
// ];

// const localCheck = (text) => {
//   const lower = text.toLowerCase();
//   const found = offensiveWords.filter((word) => lower.includes(word));
//   if (found.length > 0) {
//     return {
//       isOffensive: true,
//       reason: `Inappropriate content detected`,
//       severity: found.length > 2 ? "high" : "medium",
//     };
//   }
//   return null; // clean hai
// };

// const checkModeration = async (text) => {
//   // Step 1 — Pehle local check karo (instant)
//   const localResult = localCheck(text);
//   if (localResult) {
//     console.log("🔍 Local moderation caught:", localResult);
//     return localResult;
//   }

//   // Step 2 — Phir Gemini se check karo
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//     const prompt = `You are a content moderator for a college campus app in India.
// Analyze this text and reply ONLY in valid JSON, no extra text:
// {"isOffensive": true/false, "reason": "short reason or null", "severity": "high/medium/low/null"}

// Text: "${text}"

// Flag if: abuse, hate speech, violence, sexual content, bullying, threats.`;

//     const result = await model.generateContent(prompt);
//     const rawText = result.response.text();
//     console.log("🔥 Gemini response:", rawText);

//     const clean = rawText.replace(/```json|```/g, "").trim();
//     return JSON.parse(clean);
//   } catch (err) {
//     console.error("Gemini error, using local fallback:", err.message);
//     // Step 3 — Gemini fail ho toh local result return karo
//     return { isOffensive: false, reason: null, severity: null };
//   }
// };

// module.exports = { checkModeration };
const axios = require("axios");

const offensiveWords = [
  "fuck",
  "shit",
  "bitch",
  "bastard",
  "asshole",
  "rape",
  "chutiya",
  "madarchod",
  "behenchod",
  "gandu",
  "harami",
  "randi",
  "bhosdi",
  "mc",
  "bc",
  "lodu",
  "lund",
  "lavda",
];

const localCheck = (text) => {
  const lower = text.toLowerCase();
  const found = offensiveWords.filter((w) => lower.includes(w));
  if (found.length > 0) {
    return {
      isOffensive: true,
      reason: "Inappropriate content",
      severity: found.length > 2 ? "high" : "medium",
    };
  }
  return null;
};

const checkModeration = async (text) => {
  const local = localCheck(text);
  if (local) {
    console.log("🔍 Local caught:", local);
    return local;
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/auto",
        messages: [
          {
            role: "user",
            content: `You are a content moderator for a college campus app in India.
Reply ONLY in valid JSON, no extra text:
{"isOffensive": true/false, "reason": "short reason or null", "severity": "high/medium/low/null"}

Text: "${text}"
Flag if: abuse, hate speech, violence, sexual content, bullying, threats, abusive Hindi/Hinglish.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const rawText = response.data.choices[0].message.content;
    console.log("🤖 AI response:", rawText);
    const clean = rawText.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("AI error:", err.response?.data || err.message);
    return { isOffensive: false, reason: null, severity: null };
  }
};

module.exports = { checkModeration };
