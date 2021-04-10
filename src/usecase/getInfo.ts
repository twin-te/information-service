import dayjs from 'dayjs'
import Information from '../../informations.json'

/**
 *  投稿日が新しい順に公開日を過ぎた指定された個数分のお知らせを取得する
 *  @param limit 取得したいお知らせの個数
 */
export async function getInfoUseCase() {
  return Information.filter((e) => {
    return dayjs(e.publishedAt).isBefore(dayjs())
  })
}
