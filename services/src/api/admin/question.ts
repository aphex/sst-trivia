import { QuestionPutRequestBodySchema, type QuestionResponseBody } from '@sst-trivia/types/api'
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { addQuestion, endQuestion, getActiveQuestion, getCorrectAnswers } from '../../data/trivia'
import { postToAllConnections } from '../../utils/pubsub'

export const put: APIGatewayProxyHandlerV2 = async (evt) => {
  if (!evt.body) return { statusCode: 400, body: 'Missing body' }

  try {
    const requestBody = JSON.parse(evt.body)
    const questionRequestBody = QuestionPutRequestBodySchema.parse(requestBody)

    const { text, answer, options } = questionRequestBody
    const { questionId } = await addQuestion(text, options, answer)

    await postToAllConnections({
      type: 'question-added',
      questionId,
      text,
      options,
    })

    const body = {
      questionId,
    } satisfies QuestionResponseBody

    return {
      statusCode: 200,
      body: JSON.stringify(body),
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: 'Internal server error',
    }
  }
}

export const del: APIGatewayProxyHandlerV2 = async () => {
  try {
    const activeQuestion = await getActiveQuestion()
    if (!activeQuestion) return { statusCode: 200 }

    const winners = await getCorrectAnswers(activeQuestion.questionId)
    const winner = winners[Math.floor(Math.random() * winners.length)]

    await endQuestion(activeQuestion.questionId)

    await postToAllConnections({
      type: 'question-ended',
      correct: winners.map((w) => ({
        connectionId: w.connectionId,
        username: w.username,
      })),
      winner: winner
        ? {
            connectionId: winner.connectionId,
            username: winner.username,
          }
        : undefined,
    })

    return {
      statusCode: 200,
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: 'Internal server error',
    }
  }
}
