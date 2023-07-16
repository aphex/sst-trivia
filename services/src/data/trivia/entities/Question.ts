import { Table } from 'sst/node/table'
import { CustomAttributeType, Entity } from 'electrodb'
import type { Option } from '@sst-trivia/types/api'
import { client } from '../../dynamo'
import { ulid } from 'ulid'

export const ADMIN_OWNER = 'admin'
export const createQuestionID = () => ulid()

export const Question = new Entity(
  {
    model: {
      entity: 'Question',
      version: '1',
      service: 'gameshow',
    },
    attributes: {
      questionId: {
        type: 'string',
        readOnly: true,
        required: true,
        default: createQuestionID,
      },
      owner: {
        type: 'string',
        readOnly: true,
        required: true,
        default: () => ADMIN_OWNER,
        set: () => ADMIN_OWNER,
      },
      text: {
        type: 'string',
        required: true,
        readOnly: true,
      },
      options: {
        type: CustomAttributeType<Option[]>('any'),
        readOnly: true,
        required: true,
      },
      answer: {
        type: 'string',
        readOnly: true,
        required: true,
      },
      ended: {
        type: 'boolean',
      },
      expiresAt: {
        type: 'number',
        required: true,
        default: () => Date.now() + 1000 * 60 * 60 * 2,
      },
      createdAt: {
        type: 'string',
        readOnly: true,
        required: true,
        default: () => new Date().toISOString(),
        set: () => new Date().toISOString(),
      },
    },
    indexes: {
      primary: {
        pk: {
          field: 'PK',
          composite: ['questionId'],
        },
        sk: {
          field: 'SK',
          composite: [],
        },
      },
      byOwner: {
        index: 'GSI1',
        pk: {
          field: 'GSI1PK',
          composite: ['owner'],
        },
        sk: {
          field: 'GSI1SK',
          composite: ['createdAt'],
        },
      },
    },
  },
  {
    table: Table.triviaTable.tableName,
    client,
  },
)
