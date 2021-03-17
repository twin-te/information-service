import { getConnection } from 'typeorm'
import { information } from '../database/model/info'

/**
 *  指定されたIDのレコードを消去する
 */
export async function removeInfoUseCase(id: string) {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(information)
    .where('id = :id', { id: id })
    .execute()
}
