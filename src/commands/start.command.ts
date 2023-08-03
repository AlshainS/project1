import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../config/context.inteface";

export class StartCommand extends Command {
  
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }
  
  handle(): void {
    this.bot.start((ctx) => {
      console.log(ctx.session);
      ctx.reply("Hello, select action:", Markup.inlineKeyboard([
        Markup.button.callback("Action 1", "action_1_fire"),
        Markup.button.callback("Action 2", "action_2_fire"),
      ]))
    })

    this.bot.action("action_1_fire", (ctx) => {
      ctx.session.variable1 = true;
      ctx.editMessageText("Nice!");
    })

    this.bot.action("action_2_fire", (ctx) => {
      ctx.session.variable2 = true;
      ctx.editMessageText("Not nice.");
    })

  }
}