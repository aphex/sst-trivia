import { Connection } from './entities/Connection'

export const getConnection = async (connectionId: string) => {
  const { data: connection } = await Connection.get({
    connectionId,
  }).go()

  if (!connection) return undefined

  return connection
}

export const getConnections = async () => {
  const { data: connections } = await Connection.scan.go({
    pages: 'all',
  })

  return connections
}

export const addConnection = async (connectionId: string, username: string) => {
  await Connection.create({
    connectionId,
    username,
  }).go()
}

export const removeConnection = async (connectionId: string) => {
  await Connection.delete({
    connectionId,
  }).go()
}
