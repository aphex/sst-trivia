import type { App } from 'sst/constructs'
import { SecretsStack } from './SecretsStack'
import { DataStack } from './DataStack'
import { ApiStack } from './ApiStack'
import { FrontendStack } from './FrontendStack'

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: 'nodejs16.x',
    // timeout: 30,
    // environment: {
    //   NODE_OPTIONS: '--enable-source-maps',
    // },
    // nodejs: {
    //   esbuild: {
    //     sourcemap: true,
    //   },
    // },
  })

  app
    // Configs & Secrets
    .stack(SecretsStack)
    // Tables & Data
    .stack(DataStack)
    // APIs
    .stack(ApiStack)
    // Frontend
    .stack(FrontendStack)
}
