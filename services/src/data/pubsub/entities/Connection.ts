import { Table } from 'sst/node/table'
import { Entity } from 'electrodb'
import { client } from '../../dynamo'

export const Connection = new Entity(
  {
    model: {
      entity: 'connection',
      version: '1',
      service: 'pubsub',
    },
    attributes: {
      connectionId: {
        type: 'string',
        readOnly: true,
        required: true,
      },
      username: {
        type: 'string',
        required: true,
        readOnly: true,
      },
      expiresAt: {
        type: 'number',
        required: true,
        default: () => Date.now() + 1000 * 60 * 60 * 2,
      },
    },
    indexes: {
      primary: {
        pk: {
          field: 'PK',
          composite: ['connectionId'],
        },
        sk: {
          field: 'SK',
          composite: [],
        },
      },
    },
  },
  {
    table: Table.pubSubTable.tableName,
    client,
  },
)
