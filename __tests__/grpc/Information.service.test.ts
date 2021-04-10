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
let id: string = ""
const title = Math.random().toString(32).substring(2)
const content = Math.random().toString(32).substring(2)
const user = 'te_twin'
const readUser = 'baa4738b-bf29-4333-9b59-1755a9533411'

test('お知らせがDBに登録できるか', (done) => {
  const publishedAt = "2019-10-14 1:54:45"
  client.addInformation({ user, title, content, publishedAt }, (err, res) => {
    expect(err).toBeNull()
    done()
  })
})

test('未来のお知らせがDBに登録できるか', (done) => {
  const publishedAt = "2125-10-14 1:54:45"
  client.addInformation({ user, title, content, publishedAt }, (err, res) => {
    expect(err).toBeNull()
    done()
  })
})

test('DBに登録したお知らせが未来公開分以外すべて読み込めるか', (done) => {
  client.listInformation({ user:readUser }, (err, res) => {
    expect(res?.Informations[0].title).toEqual(title)
    expect(res?.Informations[0].content).toEqual(content)
    expect(res?.Informations[0].read).toEqual(false)
    done()
  })
})



test('DBに登録したお知らせが指定した数読み込めるか', (done) => {
  const limit = 1;
  client.getInformation({ limit,user:readUser }, (err, res) => {
    expect(err).toBeNull()
    expect(res?.Informations.length).toEqual(limit)
    expect(res?.Informations[0].title).toEqual(title)
    expect(res?.Informations[0].content).toEqual(content)
    expect(res?.Informations[0].read).toEqual(false)
    expect(res?.Informations.length).toEqual(1)
    done()
  })
})

test('DBに登録したお知らせが未来のも含めて読み込めるか', (done) => {
  client.adminListInformation({ user }, (err, res) => {
    id = res?.Informations[0].id!;
    expect(err).toBeNull()
    expect(res?.Informations.length).toEqual(2)
    expect(res?.Informations[0].title).toEqual(title)
    expect(res?.Informations[0].content).toEqual(content)
    expect(res?.Informations[1].title).toEqual(title)
    expect(res?.Informations[1].content).toEqual(content)
    done()
  })
})

test('既読フラグを立てる', (done) => {
  client.setReadFlag({ userId:readUser, id,read:true}, (err, res) => {
    expect(err).toBeNull()
    done()
  })
})

test('DBに登録したお知らせが指定した数読み込めるか', (done) => {
  const limit = 1;
  client.getInformation({ limit,user:readUser }, (err, res) => {
    expect(err).toBeNull()
    expect(res?.Informations.length).toEqual(limit)
    expect(res?.Informations[0].title).toEqual(title)
    expect(res?.Informations[0].content).toEqual(content)
    expect(res?.Informations[0].read).toEqual(true)
    expect(res?.Informations.length).toEqual(1)
    done()
  })
})


test('指定したIDのお知らせを消去できるか', (done) => {
  client.removeInformation({ user, id }, (err, res) => {
    expect(err).toBeNull()
    done()
  })
})
test('正しく消去できているか', (done) => {
  client.adminListInformation({ user }, (err, res) => {
    expect(err).toBeNull()
    expect(res?.Informations.length).toEqual(1)
    done()
  })
})
afterAll(stopGrpcServer)
