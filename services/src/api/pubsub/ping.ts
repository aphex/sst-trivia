import type { APIGatewayProxyHandler } from 'aws-lambda'
import { postToConnection } from '../../utils/pubsub'

export const handler: APIGatewayProxyHandler = async (event) => {
  const { connectionId } = event.requestContext
  if (!connectionId) return { statusCode: 400, body: 'Missing connectionId' }

  await postToConnection(connectionId, 'pong')

  return {
    statusCode: 200,
    body: '',
  }
}
