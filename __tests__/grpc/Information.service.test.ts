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

// ランダム文字列
let id:string = ""
const title = Math.random().toString(32).substring(2)
const content = Math.random().toString(32).substring(2)
const user = 'te_twin'

test('greeting success', (done) => {
  const publishedAt = ""
  client.addInformation({ user,title,content,publishedAt }, (err, res) => {
    expect(err).toBeNull()
    done()
  })
})

test('greeting success', (done) => {
  const limit = 1;
  client.getInformation({limit}, (err, res) => {
    expect(err).toBeNull()
    console.log(res);
    done()
  })
})
test('greeting success', (done) => {
  client.adminListInformation({user}, (err, res) => {
    id = res?.Informations[0].id!;
    expect(err).toBeNull()
    expect(res?.Informations[0].title).toEqual(title)
    expect(res?.Informations[0].content).toEqual(content)
    done()
  })
})

test('greeting success', (done) => {
  client.removeInformation({user,id}, (err, res) => {
    expect(err).toBeNull()
    done()
  })
})

afterAll(stopGrpcServer)
