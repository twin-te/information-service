import dayjs from 'dayjs'
import { getRepository, getConnection } from 'typeorm'
import { alreadyReads } from '../database/model/reads'

/**
 *  お知らせとユーザーを紐付けた既読情報を格納
 */
export function setReadFlag(informationId: string, user: string) {
  return getConnection()
    .createQueryBuilder()
    .insert()
    .into(alreadyReads)
    .values([
      {
        information_id: informationId,
        read_user: user,
        read_at: dayjs().format('YYYY-MM-DD hh:mm:ss'),
      },
    ])
    .execute()
}

/**
 *  ユーザーとお知らせの既読情報を消去
 */
export async function removeReadFlag(informationId: string, user: string) {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(alreadyReads)
    .where('information_id = :information_id', {
      information_id: informationId,
    })
    .andWhere('user = :user', { user: user })
    .execute()
}

/**
 *  指定したユーザーの指定したお知らせは既読か
 */
export async function isAlreadyRead(informationId: string, readUser: string) {
  const records = await getRepository(alreadyReads)
    .createQueryBuilder()
    .where('information_id = :information_id', {
      information_id: informationId,
    })
    .andWhere('read_user = :user', { user: readUser })
    .getMany()
  return records.length > 0
}
