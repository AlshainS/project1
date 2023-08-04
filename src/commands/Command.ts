import { TelegramBot } from "../types";

export abstract class Command {
  constructor(public bot: TelegramBot) {}

  abstract handle(): void;
}