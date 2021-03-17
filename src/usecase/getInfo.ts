import { getRepository } from 'typeorm'
import { information } from '../database/model/info'
import dayjs, { Dayjs } from 'dayjs'

/**
 *  投稿日が新しい順に公開日を過ぎたすべてのお知らせを取得する
 */
export async function listInfoUseCase(): Promise<information[]> {
  return getRepository(information)
    .createQueryBuilder()
    .orderBy('published_at', 'DESC')
    .where("published_at < :time",{time: dayjs().format('YYYY-MM-DD hh:mm:ss')})
    .getMany()
}

/**
 *  投稿日が新しい順に公開日を過ぎた指定された個数分のお知らせを取得する
 *  @param limit 取得したいお知らせの個数
 */
export async function getInfoUseCase(limit: number): Promise<information[]> {
  return getRepository(information)
    .createQueryBuilder()
    .orderBy('published_at', 'DESC')
    .where("published_at < :time",{time: dayjs().format('YYYY-MM-DD hh:mm:ss')})
    .limit(limit)
    .getMany()
}
