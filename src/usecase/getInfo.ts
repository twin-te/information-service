import { getRepository } from 'typeorm'
import { information } from '../database/model/info'

/**
 *  投稿日が新しい順にすべてのお知らせを取得する
 */
export async function listInfoUseCase(): Promise<information[]> {
  return getRepository(information)
    .createQueryBuilder()
    .orderBy('published_at', 'DESC')
    .getMany()
}

/**
 *  投稿日が新しい順に指定された個数分のお知らせを取得する
 *  @param limit 取得したいお知らせの個数
 */
export async function getInfoUseCase(limit: number): Promise<information[]> {
  return getRepository(information)
    .createQueryBuilder()
    .orderBy('published_at', 'DESC')
    .limit(limit)
    .getMany()
}
