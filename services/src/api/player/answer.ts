import { AnswerPutRequestBodySchema } from '@sst-trivia/types/api'
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { addCorrectAnswer, getActiveQuestion } from '../../data/trivia'
import { getConnection } from '../../data/pubsub'

export const put: APIGatewayProxyHandlerV2 = async (evt) => {
  if (!evt.body) return { statusCode: 400, body: 'Missing body' }

  try {
    const requestBody = JSON.parse(evt.body)
    const answerRequestBody = AnswerPutRequestBodySchema.parse(requestBody)
    const { answer, questionId, connectionId } = answerRequestBody

    const connection = await getConnection(connectionId)
    if (!connection) return { statusCode: 400, body: 'No User Found' }

    const activeQuestion = await getActiveQuestion()
    if (!activeQuestion) return { statusCode: 400, body: 'No active question' }
    if (activeQuestion.ended) return { statusCode: 400, body: 'Question has ended' }
    if (activeQuestion.questionId !== questionId) return { statusCode: 400, body: 'Wrong question' }
    if (activeQuestion.answer !== answer) return { statusCode: 200 }

    await addCorrectAnswer(questionId, connection.username, connectionId)

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
