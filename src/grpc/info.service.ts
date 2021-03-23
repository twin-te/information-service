import {
  InformationService,
  ListInformationResponse,
  Information,
  GetInformationResponse,
  AdminListInformationResponse,
} from '../../generated'
import { Status } from '@grpc/grpc-js/build/src/constants'
import { GrpcServer } from './type'
import { toGrpcError } from './converter'
import dayjs, { Dayjs } from 'dayjs'
import { addInfoUseCase } from '../usecase/addInfo'
import {
  listInfoUseCase,
  getInfoUseCase,
  adminListInfoUseCase,
} from '../usecase/getInfo'
import { removeInfoUseCase } from '../usecase/removeInfo'
import { Information as DBInformation } from '../database/model/info'
import dotenv from 'dotenv'
dotenv.config()

export const infomationService: GrpcServer<InformationService> = {
  async addInformation({ request }, callback) {
    try {
      if (request.user !== process.env.ADMIN_USER) {
        return callback({
          code: Status.INVALID_ARGUMENT,
          message: 'Unauthorized',
        })
      }
      let publishedAt: Dayjs
      if (request.publishedAt === '') {
        publishedAt = dayjs()
      } else {
        publishedAt = dayjs(request.publishedAt)
      }
      await addInfoUseCase(request.title, request.content, publishedAt)
      callback(null)
    } catch (e) {
      callback(toGrpcError(e))
    }
  },
  async listInformation({ request }, callback) {
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
      const res = new GetInformationResponse()
      const informationList = await getInfoUseCase(request.limit)
      res.Informations = informationList.map(convertToGrpcStructure)
      callback(null, res)
    } catch (e) {
      callback(toGrpcError(e))
    }
  },
  async adminListInformation({ request }, callback) {
    try {
      if (request.user !== process.env.ADMIN_USER) {
        return callback({
          code: Status.INVALID_ARGUMENT,
          message: 'Unauthorized',
        })
      }
      const res = new AdminListInformationResponse()
      const informationList = await adminListInfoUseCase()
      res.Informations = informationList.map(convertToGrpcStructure)
      callback(null, res)
    } catch (e) {
      callback(toGrpcError(e))
    }
  },
  async removeInformation({ request }, callback) {
    try {
      if (request.user !== process.env.ADMIN_USER) {
        return callback({
          code: Status.INVALID_ARGUMENT,
          message: 'Unauthorized',
        })
      }
      await removeInfoUseCase(request.id)
      callback(null)
    } catch (e) {
      callback(toGrpcError(e))
    }
  },
}

function convertToGrpcStructure(element: DBInformation): Information {
  const gRPCInfo = new Information()
  gRPCInfo.id = element.id
  gRPCInfo.title = element.title
  gRPCInfo.content = element.content
  gRPCInfo.publishedAt = element.published_at
  return gRPCInfo
}
