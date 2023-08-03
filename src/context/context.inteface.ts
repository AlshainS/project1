import { Context } from 'telegraf';

export interface SessionData {
  variable1: boolean;
  variable2: boolean;
}

export interface IBotContext extends Context {
  session: SessionData;
}