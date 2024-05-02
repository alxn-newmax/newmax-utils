import WinstonLogger from './libs/Winston';
import { topics } from './enums/tgtopics';
import { schemaServices, serviceTags } from './enums/services';
import { ApiError } from './ApiError';

export async function bulkCreate(Model: any, dataList: Object[], duplicateList: String[]) {
  const shemaName = Model.getTableName().schema as string
  const tableName = Model.getTableName().tableName as string
  const fieldList = Object.keys(Model.getAttributes());
  const serviceName = schemaServices[shemaName]

  const Logger = new WinstonLogger({
    tag: serviceTags[serviceName],
    service: serviceName,
    filename: serviceName,
    thread_id: topics[serviceName],
  });
  const logger = Logger.createInstance({ fn: 'bulkCreate' });

  if (!(dataList instanceof Array)) {
    throw new ApiError(400, `[${tableName}]: Bulk didn't complite: IS NOT ARRAY`)
  }

  if (!dataList.length) {
    logger.log('warn', `[${tableName}]: Bulk didn't complite: EMPTY`);
    return;
  }

  await Model.bulkCreate(dataList, {
    fields: fieldList,
    updateOnDuplicate: duplicateList,
  });

  logger.log('info', `[${tableName}]: Bulk complited success`);
}
