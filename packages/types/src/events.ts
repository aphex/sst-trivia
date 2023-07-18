import type { Option } from './api'

export type LoggedInEventData = {
  type: 'logged-in'
  username: string
  connectionId: string
}

export type QuestionAddedEventData = {
  type: 'question-added'
  questionId: string
  text: string
  options: Option[]
}

export type QuestionEndedEventData = {
  type: 'question-ended'
  correct: {
    connectionId: string
    username: string
  }[]
  winner?: {
    connectionId: string
    username: string
  }
}

export type PubSubEventData = LoggedInEventData | QuestionAddedEventData | QuestionEndedEventData
