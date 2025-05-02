<template>
  <UButton
    :href="url"
    color="neutral"
    target="_blank"
  >
    <UIcon name="i-lucide-github" />
    GitHub
  </UButton>
</template>

<script setup lang="ts">
const url = useRuntimeConfig().public?.repo ?? ''
</script>
