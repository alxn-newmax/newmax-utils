/**
 * Класс используемый для выброса ошибки со статус кодом.
 * @param {number} statusCode - Response status code. (required)
 * @param {string} meessage - Error message. (required)
 * @param {any} data - Error data. (optional)
 * @example
 * throw new ApiError(400, 'Not found', {
      name: 'Ivan',
      lastName: 'Ivanov',
   });
 */
export class ApiError extends Error {
  statusCode: number;
  data?: any;

  constructor(statusCode: number, message: string, data?: any) {
    super();

    if (!statusCode || !message) {
      throw new Error('Status code and message are required.');
    }

    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
