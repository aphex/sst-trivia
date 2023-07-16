import type { APIGatewayProxyHandler } from 'aws-lambda'
import { randFullName } from '@ngneat/falso'
import { addConnection } from '../../data/pubsub'
import { postToConnection } from '../../utils/pubsub'

export const handler: APIGatewayProxyHandler = async (event) => {
  const { connectionId } = event.requestContext
  if (!connectionId) return { statusCode: 400, body: 'Missing connectionId' }

  // Generate random username
  const username = randFullName({
    withAccents: false,
  })

  // Add connection to DynamoDB
  await addConnection(connectionId, username)

  // Send logged-in event to client letting them know their username
  await postToConnection(connectionId, {
    type: 'logged-in',
    username,
    connectionId,
  })

  // Return all good
  return {
    statusCode: 200,
    body: '',
  }
}
