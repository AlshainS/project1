import { Telegraf } from "telegraf";
import { IConfigService } from "./config/ConfigService.interface";
import { ConfigService } from "./config/ConfigService";
import { IBotContext } from "./context/BotContext.interface";
import { Command } from "./commands/Command";
import { StartCommand } from "./commands/StartCommand";
import LocalSession from "telegraf-session-local";

class Bot {
  bot: Telegraf<IBotContext>;
  commands: Command[] = [];

  constructor(private readonly configService: IConfigService) {
    this.bot = new Telegraf<IBotContext>(this.configService.get('BOT_TOKEN'));
    this.bot.use((
      new LocalSession({ database: 'sessions.json' })).middleware()
    );
  }

  init() {
    this.commands = [new StartCommand(this.bot)];
    for(const command of this.commands) {
      command.handle();
    }
    this.bot.launch();
  }
}

const bot = new Bot(new ConfigService());
bot.init();

// const bot = new Telegraf(process.env.BOT_TOKEN);
// bot.start((ctx) => ctx.reply('Welcome'));
// bot.help((ctx) => ctx.reply('Send me a sticker'));
// bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
// bot.hears('hi', (ctx) => ctx.reply('Hey there'));
// bot.launch();

// // Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));