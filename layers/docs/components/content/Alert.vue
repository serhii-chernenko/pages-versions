<template>
  <UAlert
    :color="color"
    :variant="variant"
    :icon="icon"
    class="my-4 alert"
  >
    <template
      v-if="$slots.default && !$slots.title"
      #title
    >
      <slot name="default" />
    </template>
    <template
      v-else-if="$slots.title"
      #title
    >
      <slot name="title" />
    </template>
    <template
      v-if="$slots.description"
      #description
    >
      <slot name="description" />
    </template>
  </UAlert>
</template>

<script setup lang="ts">
import type { AlertProps } from '@nuxt/ui'

withDefaults(defineProps<{
  color?: AlertProps['color']
  variant?: AlertProps['variant']
  icon?: AlertProps['icon']
}>(), {
  color: 'neutral',
  variant: 'subtle',
})
</script>
