import { Telegraf } from "telegraf";
import { IBotContext } from "../context/BotContext.interface";
import { Db } from "mongodb";

export type Event = {
  _id: number;
  name: string;
  location: string;
}

export class TelegramBot extends Telegraf<IBotContext> {
  db: Db | undefined;
}