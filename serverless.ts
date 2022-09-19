import { serve } from "https://deno.land/std@0.154.0/http/server.ts";
import { webhookCallback } from "https://deno.land/x/grammy@v1.10.1/mod.ts";
import { bot } from "./bot.ts";

serve(webhookCallback(bot, "std/http"));
