import { Markup } from "telegraf";
import { TelegramBot } from "../types"
import { Event } from "../types";

export const subscribeToEvent = async (bot: TelegramBot) => {
  bot.action("action_subscribe", (ctx) => {
    console.log(ctx);
    ctx.editMessageText("WIP");
  })
}