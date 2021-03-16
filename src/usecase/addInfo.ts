import { Dayjs } from 'dayjs'
import { getConnection } from 'typeorm'
import { information } from '../database/model/info'


export function addInfo(
  title: string,
  content: string,
  published_at: Dayjs,
) {
  return getConnection()
  .createQueryBuilder()
  .insert()
  .into(information)
  .values([
      { title: title, content: content, published_at: published_at.format('YYYY-MM-DD hh:mm:ss') }
   ])
  .execute();
}