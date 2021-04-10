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
let id: string = "baa4738b-bf29-4333-9b59-1755a9533411" // お知らせ一つ目のUUIDを指定する
const readUser = 'baa4738b-bf29-4333-9b59-1755a9533411' // 適当なUUID



test('DBに登録したお知らせが読み込めるか', (done) => {
  client.getInformation({ user:readUser }, (err, res) => {
    console.log(res?.Informations)
    expect(err).toBeNull()
    expect(res?.Informations.length).toEqual(2)
    expect(res?.Informations[0].title).toEqual("いつも応援してくださる皆様へ。")
    expect(res?.Informations[0].read).toEqual(false)
    done()
  })
})


test('既読フラグを立てる', (done) => {
  client.setReadFlag({ userId:readUser, id,read:true}, (err, res) => {
    expect(err).toBeNull()
    done()
  })
})

test('既読フラグが機能しているか', (done) => {
  client.getInformation({ user:readUser }, (err, res) => {
    console.log(res?.Informations)
    expect(err).toBeNull()
    expect(res?.Informations.length).toEqual(2)
    expect(res?.Informations[0].title).toEqual("いつも応援してくださる皆様へ。")
    expect(res?.Informations[0].read).toEqual(true)
    done()
  })
})

test('既読フラグを消す', (done) => {
  client.setReadFlag({ userId:readUser, id,read:false}, (err, res) => {
    expect(err).toBeNull()
    done()
  })
})

test('既読フラグの消去をできているか', (done) => {
  client.getInformation({ user:readUser }, (err, res) => {
    console.log(res?.Informations)
    expect(err).toBeNull()
    expect(res?.Informations.length).toEqual(2)
    expect(res?.Informations[0].title).toEqual("いつも応援してくださる皆様へ。")
    expect(res?.Informations[0].read).toEqual(false)
    done()
  })
})
afterAll(stopGrpcServer)
