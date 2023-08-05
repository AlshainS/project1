import { Markup } from "telegraf";
import { Command } from "./Command";
import { TelegramBot, Event } from "../types";

export class StartCommand extends Command {
  
  constructor(bot: TelegramBot) {
    super(bot);
  }
  
  handle(): void {
    this.bot.start((ctx) => {
      ctx.reply("Чем я могу вам помочь?", Markup.inlineKeyboard([
        Markup.button.callback("Информация о событиях", "action_get_events"),
        Markup.button.callback("Подписаться на событие", "action_subscribe"),
      ]))
    })

    this.bot.action("action_get_events", async (ctx) => {
      let arr: Event[] = [];

      // Save user id to session
      ctx.session.userId = ctx.from?.id;
      
      if(this.bot.db) {
        const collection = this.bot.db.collection<Event>("events");
        const cursor = collection.find();

        for await (const doc of cursor) {
          arr.push({...doc});
        }
      }

      // TODO: change behavior of old message with already selected option 
      ctx.editMessageText('Behavior WIP');
      let confs = arr.map(item => Markup.button.callback(item.location, `action_get_info_${item._id}`));
      ctx.reply("Какая именно конференция интересует?", Markup.inlineKeyboard([
        ...confs
      ]));

      // TODO: generate handlers for each generated button
    })

    this.bot.action("action_subscribe", (ctx) => {
      ctx.editMessageText("WIP");
    })

  }
}