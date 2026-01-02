import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";
import express from "express";

// ====== ربات تلگرام ======
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (!text) return;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "تو یک دستیار هوش مصنوعی فارسی هستی، دوستانه، صبور و دقیقاً مثل ChatGPT پاسخ می‌دهی."
        },
        { role: "user", content: text }
      ]
    });

    await bot.sendMessage(chatId, res.choices[0].message.content);
  } catch (e) {
    await bot.sendMessage(chatId, "❌ خطا رخ داد، دوباره تلاش کن.");
    console.error(e);
  }
});

// ====== سرور HTTP برای Render ======
const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("Telegram AI Bot is running!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
