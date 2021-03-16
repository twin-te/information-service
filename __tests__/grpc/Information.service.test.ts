import { startGrpcServer, stopGrpcServer } from '../../src/grpc'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'
import * as grpc from '@grpc/grpc-js'
import { InformationService } from '../../generated'
import { ServiceClientConstructor } from '@grpc/grpc-js/build/src/make-client'
import { GrpcClient } from '../../src/grpc/type'
import { Status } from '@grpc/grpc-js/build/src/constants'
import { connectDatabase } from '../../src/database'

const def = protoLoader.loadSync(
  path.resolve(__dirname, `../../protos/InformationService.proto`)
)
const pkg = grpc.loadPackageDefinition(def)
const ClientConstructor = pkg.InformationService as ServiceClientConstructor
let client: GrpcClient<InformationService>

beforeAll(async () => {
  await connectDatabase()
  await startGrpcServer()
  client = (new ClientConstructor(
    'localhost:50051',
    grpc.ChannelCredentials.createInsecure()
  ) as unknown) as GrpcClient<InformationService>
})

test('greeting success', (done) => {
  const title = 'Twin:te'
  const content = "ひげろ～だ～！"
  const publishedAt = "2020-10-14 1:54:45"
  client.addInformation({ title,content,publishedAt }, (err, res) => {
    expect(err).toBeNull()
    expect(res?.text).toEqual(`ジャイアン`)
    done()
  })
})

afterAll(stopGrpcServer)
