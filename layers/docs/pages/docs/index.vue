<template>
  <ContentRenderer
    v-if="home"
    :value="home"
  />
  <div v-else>
    Home not found
  </div>
</template>

<script setup lang="ts">
const { data: home } = await useAsyncData(() => {
  return queryCollection('docs').path('/').first()
})

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
})

definePageMeta({
  layout: 'docs',
})
</script>
