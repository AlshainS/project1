import { Telegraf } from "telegraf";
import { IBotContext } from "../context/BotContext.interface";
import { Db } from "mongodb";

export type Event = {
  _id: number;
  name: string;
  location: string;
  description: string;
  link: string;
  datetime: string;
  address: string;
  current_price: string;
  currency: string;
}

export type Participant = {
  _id?: number;
  tg_id: number;
  event_name: string;
  tg_first_name: string;
  tg_last_name?: string;
  email: string;
}

export class TelegramBot extends Telegraf<IBotContext> {
  db: Db | undefined;
}