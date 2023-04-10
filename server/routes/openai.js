import express from "express";
import axios from "axios";
import dotevn from "dotenv";
import { openai } from '../index.js';

dotevn.config();
const router = express.Router();

router.post("/text", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: text },
      ],
    });
  console.log('response data', response.data)

  await axios.post(
    `https://api.chatengine.io/chats/${activeChatId}/messages/`,
    { text: response.data.choices[0].text},
    {
      headers: {
        "Project-ID": process.env.PROJECT_ID,
        "User-Name": process.env.BOT_USER_NAME,
        "User-Secret": process.env.BOT_USER_SECRET,
      },
    }
  );
    res.status(200).json({ text: response.data.choices[0].text})
  } catch(error) {
    console.error("error", error);
    res.status(500).json({ error: error.message})
  }
});
export default router;