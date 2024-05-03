import { Op } from 'sequelize';
import Moment from './libs/Moment';

type DateType = string | number;
type ConditionType = {
  [key: string]: any 
}

export function conditionByDates(dateFrom: DateType, dateTo: DateType, key: string = 'fk_date_id') {
  const condition: ConditionType = {};

  if (dateFrom && !dateTo) {
    condition[key] = {
      [Op.gte]: Moment.startDate(dateFrom, undefined, 'x')
    };
  } else if (!dateFrom && dateTo) {
    condition[key] = {
      [Op.lte]: Moment.startDate(dateTo, undefined, 'x')
    };
  } else if (dateFrom && dateTo) {
    condition[key] = {
      [Op.between]: [Moment.startDate(dateFrom, undefined, 'x'), Moment.startDate(dateTo, undefined, 'x')],
    };
  }
  
  return condition;
}
