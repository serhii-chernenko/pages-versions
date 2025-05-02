<template>
  <ContentRenderer
    v-if="page"
    :value="page"
  />
</template>

<script setup lang="ts">
const route = useRoute()

const { data: page, error } = await useAsyncData(
  computed(() => `page-${route.path}`),
  () => {
    return queryCollection('docs')
      .path(route.path.replace('/docs/', '/'))
      .first()
  },
)

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
})

definePageMeta({
  layout: 'docs',
})

if (error.value) {
  // eslint-disable-next-line no-console
  console.error(error.value)
  navigateTo('/docs/')
}
</script>
