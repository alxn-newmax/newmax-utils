import { Request, Response } from "express";
import { ApiError } from './ApiError';
import { topics } from './enums/tgtopics';
import WinstonLogger from './libs/Winston';

type CallbackType = (body?: any, query?: any, file?: any) => Promise<any>;

type ParamsType = {
  tag: string;
  name: string;
}

/**
 * Каждый сервис должен возвращать поле data
 * либо выбрасывать ошибку через throw new ApiError
 */
async function serviceInvoker(req: Request, res: Response, callback: CallbackType, params:ParamsType) {
  const loggerParams = {
    tag: params.tag,
    service: params.name,
  };

  const Logger = new WinstonLogger({ ...loggerParams, filename: params.name, thread_id: topics[params.name] });
  const logger = Logger.createInstance({ fn: callback.name });

  const profiler = logger.startTimer();

  logger.info('Service has been started');

  try {
    const data = await callback(req.body, req);
    profiler.done({
      ...loggerParams,
      level: 'done',
      fn: callback.name,
      message: 'Service complited success',
      env: process.env.NODE_ENV,
    });
    return res ? res.send(data) : { status: 200 };
  } catch (error: unknown) {
    if(error instanceof ApiError) {
      profiler.done({
        ...loggerParams,
        level: 'error',
        fn: callback.name,
        message: `Service complited with error: ${error.message}`,
        env: process.env.NODE_ENV,
        error,
      });
      return res ? res.status(error.statusCode).send(error) : { status: error.statusCode };
    }
    if(error instanceof Error) {
      console.log(error); // Показываем в консоль, если ошибка из-за чепятки
      return res ? res.status(400).send(error) : { status: 400 };
    }
    return String(error);
  }
}

export default serviceInvoker;
