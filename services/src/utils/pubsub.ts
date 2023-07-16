import { ApiGatewayManagementApi, GoneException } from '@aws-sdk/client-apigatewaymanagementapi'
import { WebSocketApi } from 'sst/node/websocket-api'
import type { PubSubEventData } from '@sst-trivia/types/events'
import { getConnections, removeConnection } from '../data/pubsub'

// Global API Gateway Management API instance for sending PubSub messages
const apiG = new ApiGatewayManagementApi({
  endpoint: WebSocketApi.pubSubApi.httpsUrl,
})

// Sends a PubSub event to a client
export const postToConnection = async (connectionId: string, data: 'pong' | PubSubEventData) => {
  try {
    await apiG.postToConnection({
      ConnectionId: connectionId,
      Data: data === 'pong' ? data : JSON.stringify(data),
    })
  } catch (error) {
    console.log(error)
    if (error instanceof GoneException) {
      console.log(`🧹 Cleaning up socket connection ${connectionId}`)
      await removeConnection(connectionId)
    }
  }
}

// Sends a 'pong' message to a client
export const dispatchPong = async (connectionID: string) => postToConnection(connectionID, 'pong')

// Sends a PubSub event to all connected clients
export const postToAllConnections = async (data: PubSubEventData) => {
  const connections = await getConnections()
  await Promise.allSettled(
    connections.map(({ connectionId }) => postToConnection(connectionId, data)),
  )
}
