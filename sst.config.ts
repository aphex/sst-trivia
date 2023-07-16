import { SSTConfig } from 'sst'
import stacks from './stacks'

export default {
  config(_input) {
    return {
      name: 'sst-trivia',
      region: 'us-east-2',
    }
  },
  stacks,
} satisfies SSTConfig
