import { Context } from 'telegraf';

export interface SessionData {
  userId: number | undefined;
  selectedConf: number | undefined;
}

export interface IBotContext extends Context {
  session: SessionData;
}