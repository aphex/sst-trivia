import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { getActiveQuestion } from '../../data/trivia'
import type { QuestionGetResponseBody } from '@sst-trivia/types/api'

export const get: APIGatewayProxyHandlerV2 = async () => {
  try {
    const activeQuestion = await getActiveQuestion()

    const body = {
      question: activeQuestion
        ? {
            questionId: activeQuestion.questionId,
            text: activeQuestion.text,
            options: activeQuestion.options,
          }
        : undefined,
    } satisfies QuestionGetResponseBody

    return {
      headers: {
        'content-type': 'application/json',
      },
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
