import { Context } from 'telegraf';

export interface SessionData {
  boolean: boolean;
}

export interface IBotContext extends Context {
  session: SessionData;
}