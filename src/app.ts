import { TelegramBot } from "./types";
import { IConfigService } from "./config/ConfigService.interface";
import { ConfigService } from "./config/ConfigService";
import { Command } from "./commands/Command";
import { StartCommand } from "./commands/StartCommand";
import LocalSession from "telegraf-session-local";
import { connectToDatabase } from "./mongodb/db";
import { Scheduler } from "./models/Scheduler";

class Bot {
  bot: TelegramBot;
  commands: Command[] = [];
  scheduler: Scheduler;

  constructor(private readonly configService: IConfigService) {
    this.bot = new TelegramBot(this.configService.get('BOT_TOKEN'));
    this.bot.use((
      new LocalSession({ database: 'sessions.json' })).middleware()
    );
    this.scheduler = new Scheduler("0 0 19 * * *");
  }

  async init() {
    // Connection to db
    this.bot.db = await connectToDatabase();

    // Adding listeners for commands
    this.commands = [new StartCommand(this.bot)];
    for(const command of this.commands) {
      command.handle();
    }

    // Launching bot itself
    this.bot.launch();
    
    // Initializing scheduler (everyday at 19:00 for now)
    this.scheduler.init(this.bot.db);
  }
}

const bot = new Bot(new ConfigService());
bot.init();