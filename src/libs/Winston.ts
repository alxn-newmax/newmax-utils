import winston, { LogEntry } from 'winston';
import * as Transport from 'winston-transport';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import { winstonConfig } from '../configs/winston.config';
import TelegramTransport from '../utils/TelegramTransport';

const logtail = new Logtail(process.env.BETTERSTACK_TOKEN as string);

const { combine, timestamp, errors, json, simple, printf } = winston.format;

winston.addColors(winstonConfig.colors);

interface IWinstonLoggerOpts {
  tag: string;
  service: string
  filename: string;
  thread_id: number
}

type InstanceParams = {
  fn: string;
  file?: {
    level?: string;
    disable?: boolean;
  }
  console?: {
    level?: string;
    disable?: boolean;
    stack?: boolean;
    data?: boolean
  }
  telegram?: {
    disable?: boolean;
    disableNotifications?: boolean;
  }
}

interface ILogEntry extends LogEntry {
  level: string;
  message: string;
  metadata?: any;
  chat_id?: string;
  message_thread_id?: number;
  timestamp?: string 
  service?: string   
  stack?: string
  fn?: string
}

/**
 * Inversion of control container for winston logger instances.
 */
class WinstonLogger {
  #params: InstanceParams = {
    fn: '',
  }

  tag: string;
  service: string;
  filename: string;
  thread_id: number;
  lowLevel: string;

  /**
   * @constructs
   * @param {!Object} options - Options.
   * @param {!string} options.tag - Tag name of the service.
   * @param {!string} options.service - Fullname of the service.
   * @param {!string} options.filename - Filename of the log file. (Fullname of the service)
   * @param {!string} options.thread_id - Telegram topic id.
   */
  constructor(options: IWinstonLoggerOpts) {
    if (!options.tag) {
      throw new Error('The tag of the service is required.');
    }
    if (!options.service) {
      throw new Error('The name of the service is required.');
    }
    if (!options.filename) {
      throw new Error('Path to the log file is required.');
    }
    if (!options.thread_id) {
      throw new Error('Telegram topic id is required.');
    }
    /**
     * Tag name of the service.
     * @type {string}
     */
    this.tag = options.tag;
    /**
     * Fullname of the service.
     * @type {string}
     */
    this.service = options.service;
    /**
     * Fullname of the service.
     * @type {string}
     */
    this.filename = options.filename;
    /**
     * Telegram topic id.
     * @type {string}
     */
    this.thread_id = options.thread_id;
    /**
     * The lowest level of logs.
     * @type {string}
     */
    this.lowLevel = Object.entries(winstonConfig.levels).sort((a, b) => b[1] - a[1])[0][0];
  }

  createInstance = (params: InstanceParams) => {
    this.#params = params;

    const consoleConfig = {
      level: params?.console?.level || 'info',
      format: combine(simple(), timestamp({ format: 'HH:mm:ss' }), printf(this.#formatMessage)),
    };
    const fileConfig = {
      filename: `./cache/logs/${this.filename}.log`,
      level: params?.file?.level || 'custom',
      format: combine(json(), errors({ stack: true })),
    };
    const telegramConfig = {
      // level: 'info',
      thread_id: this.thread_id,
      disableNotification: params?.telegram?.disableNotifications,
    };

    const transports: Transport[] = [new LogtailTransport(logtail, { level: 'custom' })];

    if (!params?.console?.disable) {
      transports.push(new winston.transports.Console(consoleConfig));
    }
    if (!params?.file?.disable) {
      transports.push(new winston.transports.File(fileConfig));
    }
    if (!params?.telegram?.disable) {
      transports.push(new TelegramTransport(telegramConfig));
    }

    return winston.createLogger({
      levels: winstonConfig.levels,
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
      defaultMeta: { tag: this.tag, service: this.service, fn: params?.fn, env: process.env.NODE_ENV as string },
      transports,
    });
  };

  colorize = (colorCode: number, message: string) => {
    const codeExist = Object.values(winstonConfig.colorsCode).includes(colorCode);
    if (!codeExist) throw new Error('The color is not supported.');
    if (!message) throw new Error('The message is required.');
    return `\x1b[${colorCode}m${message}\x1b[0m`;
  };

  #formatMessage = (info: ILogEntry) => {
    const { timestamp, service, level, message, stack, fn } = info;

    const isStack = typeof this.#params?.console?.stack === 'boolean';
    const isData = typeof this.#params?.console?.data === 'boolean';

    const colorName = winstonConfig.colors[level];
    const colorCode = winstonConfig.colorsCode[colorName];
    const fastInfo = this.colorize(colorCode, `${timestamp} [${service}] ${level}:`);

    const colorFnName = fn ? this.colorize(winstonConfig.colorsCode.grey, fn) : '';

    const stackStatus = isStack ? this.#params?.console?.stack : true;
    const dataStatus = isData ? this.#params?.console?.data : true;

    let result = `${fastInfo} ${colorFnName}`;
    if (message) result += ` ${message}`;
    if (level === 'debug' && dataStatus) {
      result += '\n' + JSON.stringify(info, null, 2);
    }
    if (stack && stackStatus) {
      result += `\n${this.colorize(winstonConfig.colorsCode.grey, stack)}`;
    }

    return result;
  };
}

export default WinstonLogger;
