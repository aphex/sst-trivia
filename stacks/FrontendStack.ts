import { StaticSite, type StackContext, use } from 'sst/constructs'
import { ApiStack } from './ApiStack'

export function FrontendStack({ stack }: StackContext) {
  const { playerApi, adminApi, pubSubApi } = use(ApiStack)

  const playerSite = new StaticSite(stack, 'playerSite', {
    path: 'frontend/player-site',
    buildOutput: 'dist',
    buildCommand: 'pnpm run build',
    dev: {
      url: 'http://localhost:4444',
    },
    environment: {
      VITE_API_URL: playerApi.url,
      VITE_PUBSUB_URL: pubSubApi.url,
    },
  })

  const adminSite = new StaticSite(stack, 'adminSite', {
    path: 'frontend/admin-site',
    buildOutput: 'dist',
    buildCommand: 'pnpm run build',
    dev: {
      url: 'http://localhost:4445',
    },
    environment: {
      VITE_API_URL: adminApi.url,
      VITE_PUBSUB_URL: pubSubApi.url,
    },
  })

  stack.addOutputs({
    playerSiteUrl: playerSite.url,
    adminSiteUrl: adminSite.url,
  })

  return { playerSite, adminSite }
}
