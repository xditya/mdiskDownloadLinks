import { bot } from "./bot.ts";

await bot.api.deleteWebhook();

bot.start();