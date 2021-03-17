import {
  InformationService,
  AddInformationResponse,
  ListInformationResponse,
  information,
  GetInformationResponse
} from '../../generated'
import { Status } from '@grpc/grpc-js/build/src/constants'
import { GrpcServer } from './type'
import { toGrpcError } from './converter'
import dayjs from 'dayjs'
import { addInfoUseCase } from '../usecase/addInfo'
import { listInfoUseCase } from '../usecase/getInfo'
import { getInfoUseCase } from '../usecase/getInfo'
import { information as DBInformation } from '../database/model/info'

export const infomationService: GrpcServer<InformationService> = {
  async addInformation({ request }, callback) {
    try {
      await addInfoUseCase(
        request.title,
        request.content,
        dayjs(request.publishedAt)
      )
      callback(null, AddInformationResponse.create({ text: 'ジャイアン' }))
    } catch (e) {
      callback(toGrpcError(e))
    }
  },
  async listInformation({}, callback) {
    try {
      const res = new ListInformationResponse()
      const informationList = await listInfoUseCase()
      res.Informations = informationList.map(convertToGrpcStructure)
      callback(null, res)
    } catch (e) {
      callback(toGrpcError(e))
    }
  },
  async getInformation({ request }, callback) {
    try {
      const res = new GetInformationResponse;
      const informationList = await getInfoUseCase(request.limit);
      res.Informations = informationList.map(convertToGrpcStructure)
        callback(null, res)
      } catch (e) {
        callback(toGrpcError(e))
      }
  },
}

function convertToGrpcStructure(element: DBInformation): information {
  const gRPCInfo = new information()
  gRPCInfo.id = element.id
  gRPCInfo.title = element.title
  gRPCInfo.content = element.content
  gRPCInfo.publishedAt = element.published_at
  return gRPCInfo
}
