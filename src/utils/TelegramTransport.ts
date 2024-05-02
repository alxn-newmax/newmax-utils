import Transport from 'winston-transport';
import { request as _request } from 'https';
import { config } from '../config/winston.config.js';
import fetch from 'node-fetch';

export default class TelegramTransport extends Transport {
  #level = 'error';

  constructor(options) {
    super(options);
    options = options || {};

    this.env = process.env.NODE_ENV || 'development';
    this.token = process.env.TELEGRAM_BOT;
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

  /**
   * Core logging method exposed to Winston.
   *
   * @param {object} info - An object representing the log message.
   * @param {Function} callback - Continuation to respond to when complete.
   * @returns {undefined}
   */
  log(info, callback) {
    if ((this.#level !== info.level && !info.tg) || this.env !== 'production') return callback(null, true);

    let message = `${config.emoji[info.level]} <code>${info.level}</code> <code>${info.service}</code>`;

    message += `\n\n${info.message}`;
    if (info.stack) message += `\n\n<pre>${info.stack}</pre>`;
    message += `\n\nRequest body\n<pre><code class="language-javascript">${JSON.stringify(info, 0, 2)}</code></pre>`;

    this.sendMessage(message);

    callback(null, true);
  }

  /**
   * Actual method that sends the given message to Telegram.
   *
   * @function sendMessage
   * @param {string} message - Formatted text to log.
   * @private
   */
  sendMessage(message) {
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
