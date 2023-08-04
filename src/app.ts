import { TelegramBot } from "./types";
import { IConfigService } from "./config/ConfigService.interface";
import { ConfigService } from "./config/ConfigService";
import { Command } from "./commands/Command";
import { StartCommand } from "./commands/StartCommand";
import LocalSession from "telegraf-session-local";
import { connectToDatabase } from "./mongodb/db";

class Bot {
  bot: TelegramBot;
  commands: Command[] = [];

  constructor(private readonly configService: IConfigService) {
    this.bot = new TelegramBot(this.configService.get('BOT_TOKEN'));
    this.bot.use((
      new LocalSession({ database: 'sessions.json' })).middleware()
    );
  }

  async init() {
    this.bot.db = await connectToDatabase();

    this.commands = [new StartCommand(this.bot)];
    for(const command of this.commands) {
      command.handle();
    }
    this.bot.launch();
  }
}

const bot = new Bot(new ConfigService());
bot.init();

// // Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));