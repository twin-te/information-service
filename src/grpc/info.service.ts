import {
  InformationService,
  Information,
  GetInformationResponse,
} from '../../generated'
import { GrpcServer } from './type'
import { toGrpcError } from './converter'
import {
  isAlreadyReadUseCase,
  setReadFlagUseCase,
  removeReadFlagUseCase,
} from '../usecase/setReadFlag'
import { getInfoUseCase } from '../usecase/getInfo'
import dotenv from 'dotenv'

dotenv.config()

export const infomationService: GrpcServer<InformationService> = {
  async getInformation({ request }, callback) {
    try {
      const res = new GetInformationResponse()
      const informationList = await getInfoUseCase()
      res.Informations = await Promise.all(
        informationList.map(convertToGrpcStructure).map(async (e) => {
          e.read = await isAlreadyReadUseCase(e.id, request.user)
          return e
        })
      )
      callback(null, res)
    } catch (e) {
      callback(toGrpcError(e))
    }
  },
  async setReadFlag({ request }, callback) {
    try {
      if (request.read) {
        await setReadFlagUseCase(request.id, request.userId)
      } else {
        await removeReadFlagUseCase(request.id, request.userId)
      }
      callback(null)
    } catch (e) {
      callback(toGrpcError(e))
    }
  },
}

function convertToGrpcStructure(element: any): Information {
  const gRPCInfo = new Information()
  gRPCInfo.id = element.id
  gRPCInfo.title = element.title
  gRPCInfo.content = element.content
  gRPCInfo.publishedAt = element.publishedAt
  gRPCInfo.tag = element.tags
  return gRPCInfo
}
