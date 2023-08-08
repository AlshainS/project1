import { Participant, TelegramBot } from "./types";
import { IConfigService } from "./config/ConfigService.interface";
import { ConfigService } from "./config/ConfigService";
import { Command } from "./commands/Command";
import { StartCommand } from "./commands/StartCommand";
import LocalSession from "telegraf-session-local";
import { connectToDatabase } from "./mongodb/db";
import cron from 'node-cron';

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
    
    // Scheduler (everyday at 19:00)
    cron.schedule("0 0 19 * * *", async () => {
      // Check participants
      if(this.bot.db) {
        const participansId = new Set();
        const collection = this.bot.db.collection<Participant>("participants");
        const cursor = collection.find();
  
        for await (const doc of cursor) {
          participansId.add(doc.tg_id);
        }
  
        console.log(participansId);
      }
      // Send reminders to them
      //this.bot.telegram.sendMessage(214955237, "Отправлено по расписанию");
    });
  }
}

const bot = new Bot(new ConfigService());
bot.init();