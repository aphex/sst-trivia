import { Table } from 'sst/node/table'
import { Entity } from 'electrodb'
import { client } from '../../dynamo'

export const CorrectAnswer = new Entity(
  {
    model: {
      entity: 'CorrectAnswer',
      version: '1',
      service: 'trivia',
    },
    attributes: {
      questionId: {
        type: 'string',
        readOnly: true,
        required: true,
      },
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
      byQuestionId: {
        pk: {
          field: 'PK',
          composite: ['questionId'],
        },
        sk: {
          field: 'SK',
          composite: ['connectionId'],
        },
      },
    },
  },
  {
    table: Table.triviaTable.tableName,
    client,
  },
)
