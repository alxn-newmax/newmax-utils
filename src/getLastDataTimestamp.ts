import { Sequelize } from 'sequelize';

async function getLastDataTimestamp(
  Model: any, // i can try
  condition: object = {}
): Promise<number> {
  return await Model.findOne({
    attributes: [[Sequelize.fn('max', Sequelize.col('fk_date_id')), 'max']],
    where: condition,
  }).then((res: any) => +res.dataValues.max);
}

export default getLastDataTimestamp;