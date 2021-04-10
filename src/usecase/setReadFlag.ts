import dayjs from 'dayjs'
import { getRepository, getConnection } from 'typeorm'
import { alreadyReads } from '../database/model/reads'

/**
 *  お知らせとユーザーを紐付けた既読情報を格納
 */
export function setReadFlagUseCase(informationId: string, readUser: string) {
  return getConnection()
    .createQueryBuilder()
    .insert()
    .into(alreadyReads)
    .values([
      {
        information_id: informationId,
        read_user: readUser,
        read_at: dayjs().format('YYYY-MM-DD hh:mm:ss'),
      },
    ])
    .execute()
}

/**
 *  ユーザーとお知らせの既読情報を消去
 */
export async function removeReadFlagUseCase(
  informationId: string,
  readUser: string
) {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(alreadyReads)
    .where('information_id = :information_id', {
      information_id: informationId,
    })
    .andWhere('read_user = :user', { user: readUser })
    .execute()
}

/**
 *  指定したユーザーの指定したお知らせは既読か
 */
export async function isAlreadyReadUseCase(
  informationId: string,
  readUser: string
) {
  const records = await getRepository(alreadyReads)
    .createQueryBuilder()
    .where('information_id = :information_id', {
      information_id: informationId,
    })
    .andWhere('read_user = :user', { user: readUser })
    .getMany()

  return records.length > 0
}
