<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { refAutoReset, useStorage, useWebSocket } from '@vueuse/core'
  import type { QuestionGetResponseBody, AnswerPutRequestBody } from '@sst-trivia/types/api'
  import type { PubSubEventData } from '@sst-trivia/types/events'

  /* -------------------------- Environment variables ------------------------- */
  const { VITE_API_URL, VITE_PUBSUB_URL } = import.meta.env

  /* ---------------------------------- Refs ---------------------------------- */
  const username = ref<string>()
  const connectionId = ref<string>()
  const question = ref<NonNullable<QuestionGetResponseBody['question']>>()
  const answered = useStorage<string[]>('answered-questions', [])
  const winner = refAutoReset(false, 5000)
  const correct = refAutoReset(false, 5000)
  const wrong = refAutoReset(false, 5000)

  /* -------------------------------- Computed -------------------------------- */
  const hasAnsweredQuestion = computed(
    () => question.value && answered.value.includes(question.value.questionId),
  )

  /* ------------------------------- WebSockets ------------------------------- */
  const { open, close } = useWebSocket(VITE_PUBSUB_URL, {
    immediate: false,
    autoReconnect: true,
    heartbeat: {
      message: JSON.stringify({ action: 'ping' }),
      interval: 1000 * 60 * 9,
      pongTimeout: 1000 * 5,
    },
    onConnected(ws) {
      ws.send(
        JSON.stringify({
          action: 'login',
        }),
      )
    },
    onMessage(_, event) {
      if (typeof event.data !== 'string') return

      const { data: stringifiedData } = event
      if (stringifiedData === 'pong') return

      const data = JSON.parse(stringifiedData) as PubSubEventData
      if (data.type === 'logged-in') {
        username.value = data.username
        connectionId.value = data.connectionId
      } else if (data.type === 'question-added') {
        const { type, ..._question } = data
        question.value = _question
      } else if (data.type === 'question-ended') {
        const { winner: _winner, correct: _correct } = data

        question.value = undefined
        // If there was no winner, everyone was wrong
        if (!_winner) {
          wrong.value = true
          return
        }

        // If the winner is the current player, they are the winner
        const { connectionId: _connectionId } = _winner
        if (_connectionId === connectionId.value) {
          winner.value = true
          return
        }

        const isCorrect = !!_correct.find(
          ({ connectionId: _connectionId }) => _connectionId === connectionId.value,
        )
        // If they did not win but got the question correct, they were close
        if (isCorrect) {
          correct.value = true
          return
        }

        // Otherwise, they were wrong
        wrong.value = true
      }
    },
  })

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  const loadActiveQuestion = async () => {
    const response = await fetch(`${VITE_API_URL}/question`)
    if (!response.ok) return

    const { question: activeQuestion } = (await response.json()) as QuestionGetResponseBody
    question.value = activeQuestion
  }

  const onAnswerClicked = async (answer: string) => {
    if (!question.value) return
    if (!connectionId.value) return

    const { questionId } = question.value

    await fetch(`${VITE_API_URL}/answer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connectionId: connectionId.value,
        answer,
        questionId,
      } satisfies AnswerPutRequestBody),
    })

    answered.value.push(questionId)
  }

  /* -------------------------------------------------------------------------- */
  /*                              Lifecycle Methods                             */
  /* -------------------------------------------------------------------------- */
  onMounted(() => {
    open()
    loadActiveQuestion()
  })

  onUnmounted(() => {
    close()
  })
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div
      class="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-75 font-bold text-white"
      v-if="winner"
    >
      🎉 You win! 🎉
    </div>
    <div
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 font-bold text-white"
      v-else-if="!username || !question || hasAnsweredQuestion"
    >
      <p v-if="!username">Logging in...</p>
      <div v-else="!question">
        <p>Alright {{ username }}, hold on to your butt.</p>
        <p class="text-green-500" v-if="correct">You got it right! 💪</p>
        <p class="text-red-500" v-else-if="wrong">Aw Dang, better luck next time! 🤞</p>
      </div>
    </div>
    <div v-else class="flex flex-1 flex-col gap-4">
      <h1 class="self-end px-2 text-xl font-bold">👋 {{ username }}</h1>
      <div class="flex flex-1 flex-col items-center justify-center gap-2">
        <p class="px-8 text-center text-lg">{{ question.text }}</p>
        <div class="grid grid-cols-[repeat(2,_minmax(0,_max-content))] justify-center gap-4 px-4">
          <button
            v-for="option in question.options"
            :key="option.value"
            class="rounded-md bg-teal-400 px-2 py-1 font-bold hover:bg-teal-500"
            @click="onAnswerClicked(option.value)"
          >
            {{ option.text }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 200ms ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
