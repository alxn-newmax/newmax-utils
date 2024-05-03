import { LogEntry } from 'winston';
import Transport from 'winston-transport';
import { request as _request } from 'https';
import { winstonConfig } from '../configs/winston.config';

interface ILogEntry extends LogEntry {
  level: string;
  message: string;
  metadata?: any;
  chat_id?: string;
  message_thread_id?: number;
}

interface ITelegramTransportOpts {
  /** The Telegram bot authentication token. */
  // token: string;
  /** The Telegram chat_id you want just send. */
  thread_id: number;
  level?: string;
  /** The Telegram mode for parsing entities in the message text. */
  // parseMode?: ParserTypes;
  /** Levels of messages that this transport should log. (default none) */
  // levels?: LogLevels[];
  /** Whether to suppress output. (default false) */
  // silent?: boolean;
  /** Sends the message silently. (default false) */
  disableNotification?: boolean;
  /** Format output message. (default "[{level}] [message]") */
  // template?: string;
  /** Format output message by own method. */
  // formatMessage?: TTelegramFormatMessageFn;
  /** Handle uncaught exceptions. (default true) */
  // handleExceptions?: boolean;
  /** Time in ms within which to batch messages together. (default = 0) (0 = disabled) */
  // batchingDelay?: number;
  /** String with which to join batched messages with (default "\n\n") */
  // batchingSeparator?: string;
}

export default class TelegramTransport extends Transport {
  #level = 'error';

  env: string;
  token: string;
  chatId: number;
  thread_id: number;
  disableNotification: boolean;

  constructor(options: ITelegramTransportOpts) {
    super(options);
    
    this.env = process.env.NODE_ENV || 'development';
    this.token = process.env.TELEGRAM_BOT as string;
    this.chatId = -1002083635464;

    if (!this.token) {
      throw new Error('Telegram token is required');
    }

    if (!options.thread_id) {
      throw new Error('Telegram topic id is required: thread_id');
    }

    if (options.level) this.#level = options.level;

    this.thread_id = options.thread_id;
    this.disableNotification = options.disableNotification || false;
  }

  log(info: ILogEntry, callback: () => void): void {
    if ((this.#level !== info.level && !info.tg) || this.env !== 'production') return callback();

    let message = `${winstonConfig.emoji[info.level]} <code>${info.level}</code> <code>${info.service}</code>`;

    message += `\n\n${info.message}`;
    if (info.stack) message += `\n\n<pre>${info.stack}</pre>`;
    message += `\n\nRequest body\n<pre><code class="language-javascript">${JSON.stringify(info, null, 2)}</code></pre>`;

    this.sendMessage(message);

    callback();
  }

  /**
   * Actual method that sends the given message to Telegram.
   *
   * @function sendMessage
   * @param {string} message - Formatted text to log.
   * @private
   */
  sendMessage(message: string) {
    const url = `https://api.telegram.org/bot${this.token}/sendMessage`;

    const body = JSON.stringify({
      chat_id: this.chatId,
      message_thread_id: this.thread_id,
      text: message,
      // disable_notification: this.disableNotification,
      parse_mode: 'HTML',
    });

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
    };

    fetch(url, requestOptions);
  }
}
