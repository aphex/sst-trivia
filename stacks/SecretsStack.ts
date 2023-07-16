import { Config, type StackContext } from 'sst/constructs'

export function SecretsStack({ stack }: StackContext) {
  const ADMIN_PASSWORD = new Config.Secret(stack, 'ADMIN_PASSWORD')

  return {
    ADMIN_PASSWORD
  }
}