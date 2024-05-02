import winston from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import { config } from '../config/winston.config.js';
import TelegramTransport from './TelegramTransport.js';

const logtail = new Logtail(process.env.BETTERSTACK_TOKEN);

const { combine, timestamp, errors, json, simple, printf } = winston.format;

winston.addColors(config.colors);

/**
 * Inversion of control container for winston logger instances.
 */
class WinstonLogger {
  #params = {};

  /**
   * @constructs
   * @param {!Object} options - Options.
   * @param {!string} options.tag - Tag name of the service.
   * @param {!string} options.service - Fullname of the service.
   * @param {!string} options.filename - Filename of the log file. (Fullname of the service)
   * @param {!string} options.thread_id - Telegram topic id.
   */
  constructor(options) {
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
    this.lowLevel = Object.entries(config.levels).sort((a, b) => b[1] - a[1])[0][0];
  }

  /**
   * Method to create Logger instance.
   * @param {Object} [params] - Instance params.
   * @param {string} [params.fn] - Service name.
   * @param {Object} [params.console] - Custom props to console transport.
   * @param {string} [params.console.level=info] - Custom level to console transport. Defaults 'info'.
   * @param {boolean} [params.console.disable=false] - True if you want to disable console transport. Defaults false.
   * @param {boolean} [params.console.stack=true] - Show stack when logging errors. Defaults true.
   * @param {boolean} [params.console.data=true] - True if you want to log data. Defaults true.
   * @param {Object} [params.file] - Custom props to file transport.
   * @param {string} [params.file.level=info] - Custom level to file transport.
   * @param {boolean} [params.file.disable=false] - True if you want to disable file transport. Defaults false.
   * @return {Logger} Logger instance.
   * @example
   *    const logger = Logger.createInstance({
   *      console: { level: 'warn' },
   *       file: { disable: true },
   *    });
   */
  createInstance = (params) => {
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
      disableNotification: params?.telegram?.disableNotification,
    };

    const transports = [new LogtailTransport(logtail, { level: 'custom' })];

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
      levels: config.levels,
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
      defaultMeta: { tag: this.tag, service: this.service, fn: params?.fn, env: process.env.NODE_ENV },
      transports,
    });
  };

  /**
   * Method to colorize message.
   * @param {number} colorCode - Color code.
   * @param {string} message - Message for formatting.
   * @return {string} The formatted line returns.
   * @example Logger.colorize(config.colorsCode.magenta, 'Test message');
   */
  colorize = (colorCode, message) => {
    const codeExist = Object.values(config.colorsCode).includes(colorCode);
    if (!codeExist) throw new Error('The color is not supported.');
    if (!message) throw new Error('The message is required.');
    return `\x1b[${colorCode}m${message}\x1b[0m`;
  };

  #formatMessage = (info) => {
    const { timestamp, service, level, message, stack, fn } = info;

    const isStack = typeof this.#params?.console?.stack === 'boolean';
    const isData = typeof this.#params?.console?.data === 'boolean';

    const colorName = config.colors[level];
    const colorCode = config.colorsCode[colorName];
    const fastInfo = this.colorize(colorCode, `${timestamp} [${service}] ${level}:`);

    const colorFnName = fn ? this.colorize(config.colorsCode.grey, fn) : '';

    const stackStatus = isStack ? this.#params.console.stack : true;
    const dataStatus = isData ? this.#params.console.data : true;

    let result = `${fastInfo} ${colorFnName}`;
    if (message) result += ` ${message}`;
    if (level === 'debug' && dataStatus) {
      result += '\n' + JSON.stringify(info, 0, 2);
    }
    if (stack && stackStatus) {
      result += `\n${this.colorize(config.colorsCode.grey, stack)}`;
    }

    return result;
  };
}

export default WinstonLogger;
