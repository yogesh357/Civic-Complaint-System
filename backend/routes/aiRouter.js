// // backend/routes/aiRouter.js
// import express from 'express';
// import axios from 'axios';
// const router = express.Router();

// router.post('/ai-estimator', async (req, res) => {
//   const { description } = req.body;

//   try {
//     const response = await axios.post(
//       'https://api.openai.com/v1/chat/completions',
//       {
//         model: "gpt-3.5-turbo", 
//         messages: [
//           {
//             role: "system",
//             content:
//               "You're a civil AI assistant. Estimate the time, labor, cost, and materials required to resolve the given complaint. Respond only in JSON with keys: days, labor, cost, materials.",
//           },
//           {
//             role: "user",
//             content: description,
//           },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const result = response.data.choices[0].message.content;
//     res.json(JSON.parse(result));
//   } catch (err) {
//     console.error('AI Estimation Failed:', err?.response?.data || err.message);
//     res.status(500).json({ error: 'Estimation failed', details: err?.response?.data });
//   }
// });

// export default router;


// backend/routes/aiRouter.js
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/ai-estimator', async (req, res) => {
  const { description } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Estimate the work based on the complaint:
${description}
Return in strict JSON format:
{
  "days": number,
  "labor": string,
  "cost": number,
  "materials": string[]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Remove code block markers if present (e.g., ```json ... ```)
    const cleanText = text.replace(/```json|```/g, '').trim();

    res.json(JSON.parse(cleanText));
  } catch (err) {
    console.error('Gemini Error:', err);
    res.status(500).json({ error: 'Gemini estimation failed', details: err.message });
  }
});

export default router;
