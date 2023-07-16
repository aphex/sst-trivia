import { Table, type StackContext } from 'sst/constructs'

export function DataStack({ stack }: StackContext) {
  const triviaTable = new Table(stack, 'triviaTable', {
    fields: {
      PK: 'string',
      SK: 'string',
      GSI1PK: 'string',
      GSI1SK: 'string',
    },
    primaryIndex: { partitionKey: 'PK', sortKey: 'SK' },
    globalIndexes: {
      GSI1: { partitionKey: 'GSI1PK', sortKey: 'GSI1SK' },
    },
    timeToLiveAttribute: 'expiresAt',
  })

  const pubSubTable = new Table(stack, 'pubSubTable', {
    fields: {
      PK: 'string',
      SK: 'string',
    },
    primaryIndex: { partitionKey: 'PK', sortKey: 'SK' },
    timeToLiveAttribute: 'expiresAt',
  })

  return { triviaTable, pubSubTable }
}
