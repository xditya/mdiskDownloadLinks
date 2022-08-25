import {Bot, InlineKeyboard} from "https://deno.land/x/grammy@v1.10.1/mod.ts";
import * as dotenv from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const botToken = dotenv.config().BOT_TOKEN;
if (botToken == undefined){
    throw new Error("BOT_TOKEN not found. Add it in your .env file or environment variables.");
}

console.info("Starting bot...");
export const bot = new Bot(botToken);
bot.start();
const me = await bot.api.getMe();
console.info(`Started as @${me.username}`);

const startInlineKeyboard = new InlineKeyboard().url("Join My Channel", "https://t.me/BotzHub").url("Source", "https://github.com/xditya/mdiskDownloadLinks");
bot.command("start", async(ctx) => {
    await ctx.reply(`Hi ${ctx.from!.first_name}, I'm @${me.username}. I can give direct download links from any mdisk link you send me!`, {
        reply_markup: startInlineKeyboard,
    });
})

bot.on("message", async(ctx) => {
    const msg = ctx.update.message.text?.trim();
    if (msg == undefined || msg?.startsWith("/") || !(msg?.startsWith("https://mdisk.me"))) { return;}
    const url = msg.split(" ")[0]
    const param = url.split("/").slice(-1)[0];
    const reply = await ctx.reply(`Please wait.. Fetching the download link...`);
    const dl_url = await getLink(param);
    if (dl_url == null) {await ctx.api.editMessageText(reply.chat.id, reply.message_id, "Invalid URL!"); return;}
    const kbd = new InlineKeyboard().url("Download Now!", dl_url).url("Updates", "https://t.me/BotzHub");
    await ctx.api.editMessageText(reply.chat.id, reply.message_id, `Click the \"Download Now!\" button below to direct download from <code>${url}</code>`, {reply_markup: kbd, parse_mode: "HTML"});
    
});

async function getLink(param: string) {
    const req_url = "https://diskuploader.entertainvideo.com/v1/file/cdnurl?param=" + param;
    try {
        const resp = await (await fetch(req_url)).json();
        return resp["source"];
    }
    catch (_error) {
        return null;
    }
    
}