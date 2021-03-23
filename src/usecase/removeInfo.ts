import { getConnection } from 'typeorm'
import { Information } from '../database/model/info'

/**
 *  指定されたIDのレコードを消去する
 */
export async function removeInfoUseCase(id: string) {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Information)
    .where('id = :id', { id: id })
    .execute()
}
