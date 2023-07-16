import type { Option } from '@sst-trivia/types/api'
import { CorrectAnswer } from './entities/CorrectAnswer'
import { ADMIN_OWNER, Question } from './entities/Question'

/* -------------------------------------------------------------------------- */
/*                              Question Methods                              */
/* -------------------------------------------------------------------------- */
export const getActiveQuestion = async () => {
  const { data: questions } = await Question.query
    .byOwner({
      owner: ADMIN_OWNER,
    })
    .go({
      limit: 1,
      order: 'desc',
    })

  const [question] = questions
  if (!question || question.ended) return undefined

  return question
}

export const addQuestion = async (text: string, options: Option[], answer: string) => {
  const { data: question } = await Question.create({
    text,
    options,
    answer,
  }).go()

  return question
}

export const endQuestion = async (questionId: string) => {
  const { data: question } = await Question.update({
    questionId,
  })
    .set({
      ended: true,
    })
    .go()

  return question
}

/* -------------------------------------------------------------------------- */
/*                               Answer Methods                               */
/* -------------------------------------------------------------------------- */

export const addCorrectAnswer = async (
  questionId: string,
  username: string,
  connectionId: string,
) => {
  const { data: correctAnswer } = await CorrectAnswer.create({
    questionId,
    username,
    connectionId,
  }).go()

  return correctAnswer
}

export const getCorrectAnswers = async (questionId: string) => {
  const { data: correctAnswers } = await CorrectAnswer.query
    .byQuestionId({
      questionId,
    })
    .go({
      pages: 'all',
    })

  return correctAnswers
}
