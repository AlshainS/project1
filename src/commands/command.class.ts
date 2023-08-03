import { Telegraf } from "telegraf";
import { IBotContext } from "../config/context.inteface";

export abstract class Command {
  constructor(public bot: Telegraf<IBotContext>) {}

  abstract handle(): void;
}