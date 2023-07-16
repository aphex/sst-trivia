import { z } from 'zod'

/* ----------------------------- Player Requests ---------------------------- */
export const AnswerPutRequestBodySchema = z.strictObject({
  questionId: z.string(),
  connectionId: z.string(),
  answer: z.string(),
})

export type AnswerPutRequestBody = z.infer<typeof AnswerPutRequestBodySchema>

const OptionSchema = z.strictObject({
  text: z.string(),
  value: z.string(),
})

export type Option = z.infer<typeof OptionSchema>

export type QuestionGetResponseBody = {
  question:
    | {
        questionId: string
        text: string
        options: Option[]
      }
    | undefined
}

/* ----------------------------- Admin Requests ----------------------------- */
export const QuestionPutRequestBodySchema = z.strictObject({
  text: z.string(),
  answer: z.string(),
  options: z.array(OptionSchema).min(2),
})

export type QuestionPutRequestBody = z.infer<typeof QuestionPutRequestBodySchema>

export const QuestionPutResponseBodySchema = z.strictObject({
  questionId: z.string(),
})

export type QuestionResponseBody = z.infer<typeof QuestionPutResponseBodySchema>
