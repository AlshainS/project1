import { Markup } from "telegraf";
import { Command } from "./Command";
import { TelegramBot, Event, Participant } from "../types";
import { isValidUrl } from '../utils/isValidUrl';

export class StartCommand extends Command {
  
  constructor(bot: TelegramBot) {
    super(bot);
  }
  
  handle(): void {
    this.bot.start((ctx) => {
      ctx.reply("Чем я могу вам помочь?", Markup.inlineKeyboard([
        [Markup.button.callback("Информация о событиях", "action_get_events")],
        [Markup.button.callback("Подписаться на событие", "action_subscribe")],
      ]))
    })

    // ACTION HANDLERS

    // Action: Get events
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
      ctx.deleteMessage();
      // ctx.editMessageText('Behavior WIP');
      let confs = arr.map(item => [Markup.button.callback(item.location, `action_get_info_${item.name}`)]);
      ctx.reply("Какая именно конференция интересует?", Markup.inlineKeyboard([
        ...confs
      ]));
    })

    // Action: Subscribe ** WIP**
    this.bot.action("action_subscribe", (ctx) => {
      console.log(ctx);
      ctx.editMessageText("WIP");
    })

    // Handler for generated buttons
    this.bot.action(/action_get_info_/, async (ctx) => {
      let actionString = ctx.match.input;

      // Get action id from context
      const name = actionString.slice(actionString.lastIndexOf('_') + 1);

      if(this.bot.db) {
        const collection = this.bot.db.collection<Event>("events");
        const event = await collection.findOne<Event>({name: name});

        // TODO add handler if event doesn't exist
        if(event) {
          // Save event to current session context
          ctx.session.selectedConf = event;

          ctx.deleteMessage();

          // TODO fix any !!!
          const buttonsArray: any = [
            [Markup.button.callback("Записаться", "action_participate")],
            [Markup.button.callback("Назад", "action_get_events"), Markup.button.callback("В главное меню", "action_start")]
          ];

          // Add Landing url button if event'link is valid url (returns 200)
          if(await isValidUrl(event.link)) {
            buttonsArray.unshift([Markup.button.url("Landing", event.link)]);
          }
          
          ctx.reply(`
            Локация: ${event.location}\n\n${event.description}\n\nДата и время: ${event.datetime}\n\nЦена: ${event.currency} ${event.current_price}
          `, Markup.inlineKeyboard(buttonsArray));
        }
      }
    })

    // Action: Participate
    this.bot.action("action_participate", async (ctx) => {
      const event = ctx.session.selectedConf;

      if(ctx.from && event) {
        const user: Participant = {
          tg_id: ctx.from?.id,
          event_name: event.name,
          tg_first_name: ctx.from?.first_name,
          tg_last_name: ctx.from?.last_name,
          email: "",
        }
  
        // TODO: check if user is not already participated in this event
        if(this.bot.db) {
          const collection = this.bot.db.collection<Participant>("participants");

          // Check if user is not already participated in this event
          const isAlreadyPatricipated = await collection.findOne<Participant>({tg_id: ctx.from.id, event_name: event.name});

          if(!isAlreadyPatricipated) {
            const result = await collection.insertOne(user);
    
            if(result.acknowledged) {
              ctx.editMessageReplyMarkup(undefined);
              // TODO: add datetime converted to readable format
              ctx.reply(`Отлично, вы успешно записаны на "${event.name}", которое состоится ${event.datetime}. Бот обязательно напомнит вам за сутки до события!`);
            } else {
              ctx.reply(`Кажется что-то пошло не так.`);
            }
          } else {
            // ctx.editMessageReplyMarkup(undefined);
            ctx.reply("Вы уже записаны на эту конференцию! :)");
          }

        }
      }
    })
  }
}