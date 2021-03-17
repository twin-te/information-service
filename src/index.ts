import { connectDatabase } from './database'
import { startGrpcServer } from './grpc'
import { logger } from './logger'
import { getInfoUseCase } from './usecase/getInfo'



async function main() {
  logger.info('starting...')
  await connectDatabase()
  await startGrpcServer()
  console.log(await getInfoUseCase(2))
}

main()
