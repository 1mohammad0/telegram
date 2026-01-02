import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

// ساخت ربات تلگرام با توکن از Environment Variable
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// اتصال به OpenAI با API Key از Environment Variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// دریافت پیام‌ها
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
          content:
            "تو یک دستیار هوش مصنوعی فارسی هستی، دوستانه، دقیق، صبور و دقیقاً مثل ChatGPT پاسخ می‌دهی.",
        },
        { role: "user", content: text },
      ],
    });

    await bot.sendMessage(chatId, res.choices[0].message.content);
  } catch (error) {
    await bot.sendMessage(chatId, "❌ خطا رخ داد، دوباره تلاش کن.");
    console.error(error);
  }
});
