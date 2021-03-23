import { Dayjs } from 'dayjs'
import { getConnection } from 'typeorm'
import { Information } from '../database/model/info'

export function addInfoUseCase(
  title: string,
  content: string,
  publishedAt: Dayjs
) {
  return getConnection()
    .createQueryBuilder()
    .insert()
    .into(Information)
    .values([
      {
        title: title,
        content: content,
        published_at: publishedAt.format('YYYY-MM-DD hh:mm:ss'),
      },
    ])
    .execute()
}
