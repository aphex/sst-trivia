<script setup lang="ts">
  import { QuestionPutRequestBody } from '@sst-trivia/types/api'
  import questions from './data/questions.json'

  /* -------------------------- Environment variables ------------------------- */
  const { VITE_API_URL } = import.meta.env

  const onQuestionClicked = async (question: QuestionPutRequestBody) => {
    await fetch(`${VITE_API_URL}/question`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(question),
    })
  }

  const onEndQuestionClicked = async () => {
    await fetch(`${VITE_API_URL}/question`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2">
    <h1 class="text-2xl font-bold">SST Trivia Admin</h1>
    <div class="grid grid-cols-3 gap-4">
      <button
        v-for="question in questions"
        class="rounded-md bg-blue-400 p-2"
        @click="onQuestionClicked(question.data)"
      >
        {{ question.label }}
      </button>
      <button class="rounded-md bg-red-400 p-2" @click="onEndQuestionClicked">End</button>
    </div>
  </div>
</template>
