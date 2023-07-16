import { Api, WebSocketApi, use, type StackContext } from 'sst/constructs'
import { SecretsStack } from './SecretsStack'
import { DataStack } from './DataStack'

export function ApiStack({ stack }: StackContext) {
  const { ADMIN_PASSWORD } = use(SecretsStack)
  const { pubSubTable, triviaTable } = use(DataStack)

  const pubSubApi = new WebSocketApi(stack, 'pubSubApi', {
    accessLog: false,
    defaults: {
      function: {
        bind: [pubSubTable, triviaTable],
      },
    },
    routes: {
      $disconnect: `services/src/api/pubsub/disconnect.handler`,
      login: `services/src/api/pubsub/login.handler`,
      ping: `services/src/api/pubsub/ping.handler`,
    },
  })

  // Bind the API to itself so it has access to its own URL. This is required so the pubsub services
  // can send messages to the API.
  pubSubApi.bind([pubSubApi])

  const playerApi = new Api(stack, 'playerApi', {
    defaults: {
      function: {
        bind: [pubSubApi, pubSubTable, triviaTable],
      },
    },
    routes: {
      'GET /question': 'services/src/api/player/question.get',
      'PUT /answer': 'services/src/api/player/answer.put',
    },
  })

  const adminApi = new Api(stack, 'adminApi', {
    defaults: {
      function: {
        bind: [ADMIN_PASSWORD, pubSubApi, pubSubTable, triviaTable],
      },
    },
    routes: {
      'GET /question': 'services/src/api/admin/question.get',
      'PUT /question': 'services/src/api/admin/question.put',
      'DELETE /question': 'services/src/api/admin/question.del',
    },
  })

  stack.addOutputs({
    AdminApiUrl: adminApi.url,
    PlayerApiUrl: playerApi.url,
    PubSubApiUrl: pubSubApi.url,
  })

  return { playerApi, adminApi, pubSubApi }
}
