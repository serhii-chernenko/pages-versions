<template>
  <Header>
    Create a new page
    <template #button>
      <UButton
        to="/"
        color="neutral"
        variant="subtle"
      >
        <UIcon name="i-lucide-arrow-left-from-line" />
        Back
      </UButton>
    </template>
  </Header>
  <UContainer>
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField
        label="Title"
        name="title"
      >
        <UInput
          v-model="state.title"
          placeholder="Enter title"
          color="neutral"
        />
      </UFormField>

      <UFormField
        label="Slug"
        name="slug"
      >
        <UInput
          v-model="state.slug"
          type="text"
          placeholder="Enter slug"
          color="neutral"
        />
      </UFormField>

      <UButton
        type="submit"
        color="neutral"
      >
        Submit
      </UButton>
    </UForm>
  </UContainer>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const schema = z.object({
  title: z.string().min(4).max(60),
  slug: z.string().min(4).max(60),
})

type Schema = z.output<typeof schema>

const state = shallowReactive<Partial<Schema>>({
  title: '',
  slug: '',
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const { content } = await $fetch('/api/pages', {
      method: 'put',
      body: event.data,
    })

    state.title = ''
    state.slug = ''

    toast.add({
      title: 'Success',
      description: `Page ${content.title} created succesfully`,
      color: 'success',
      icon: 'i-lucide-circle-check',
    })

    navigateTo('/')
  } catch (exception: any) {
    // eslint-disable-next-line no-console
    console.error(exception)
    toast.add({
      title: 'Error',
      description: exception?.statusMessage ?? 'An error occurred while creating the page.',
      color: 'error',
      icon: 'i-lucide-circle-x',
    })
  }
}
</script>
