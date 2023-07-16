import type { APIGatewayProxyHandler } from 'aws-lambda'
import { removeConnection } from '../../data/pubsub'

export const handler: APIGatewayProxyHandler = async (event) => {
  const { connectionId } = event.requestContext
  if (!connectionId) return { statusCode: 400, body: 'Missing connectionId' }

  await removeConnection(connectionId)

  return {
    statusCode: 200,
    body: '',
  }
}
