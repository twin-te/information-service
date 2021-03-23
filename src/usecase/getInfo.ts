import { getRepository } from 'typeorm'
import { Information } from '../database/model/info'
import dayjs from 'dayjs'

/**
 *  投稿日が新しい順にすべてのお知らせを取得する
 */
export async function adminListInfoUseCase(): Promise<Information[]> {
  return getRepository(Information)
    .createQueryBuilder()
    .orderBy('published_at', 'DESC')
    .getMany()
}

/**
 *  投稿日が新しい順に公開日を過ぎたすべてのお知らせを取得する
 */
export async function listInfoUseCase(): Promise<Information[]> {
  return getRepository(Information)
    .createQueryBuilder()
    .orderBy('published_at', 'DESC')
    .where('published_at < :time', {
      time: dayjs().format('YYYY-MM-DD hh:mm:ss'),
    })
    .getMany()
}

/**
 *  投稿日が新しい順に公開日を過ぎた指定された個数分のお知らせを取得する
 *  @param limit 取得したいお知らせの個数
 */
export async function getInfoUseCase(limit: number): Promise<Information[]> {
  return getRepository(Information)
    .createQueryBuilder()
    .orderBy('published_at', 'DESC')
    .where('published_at < :time', {
      time: dayjs().format('YYYY-MM-DD hh:mm:ss'),
    })
    .limit(limit)
    .getMany()
}
