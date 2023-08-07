import { Markup } from "telegraf";
import { TelegramBot } from "../types"
import { Event } from "../types";

export const getEvents = async (bot: TelegramBot) => {

  bot.action("action_get_events", async (ctx) => {
    let arr: Event[] = [];
    
    if(bot.db) {
      const collection = bot.db.collection<Event>("events");
      const cursor = collection.find();

      for await (const doc of cursor) {
        arr.push({...doc});
      }
    }

    ctx.deleteMessage();
    let confs = arr.map(item => [Markup.button.callback(item.location, `action_get_info_${item.name}`)]);
    ctx.reply("Какая именно конференция интересует?", Markup.inlineKeyboard([
      ...confs
    ]));
  });

}