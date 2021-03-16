import {
    InformationService,
    AddInformationResponse
  } from '../../generated'
import { Status } from '@grpc/grpc-js/build/src/constants'
import { GrpcServer } from './type'
import { toGrpcError } from './converter'
import dayjs from 'dayjs'
import {addInfo} from '../usecase/addInfo'

export const infomationService: GrpcServer<InformationService> = {
    async addInformation({ request }, callback) {
        try {
            await addInfo(
                request.title,
                request.content,
                dayjs(request.publishedAt)
              )
            callback(null, AddInformationResponse.create({text:"ジャイアン"}))
          } catch (e) {
            callback(toGrpcError(e))
          }
        // callback(null,addInfo("テスト用のタイトル","これが内容",dayjs("1999-10-14 1:54:45")) )
    }
}
