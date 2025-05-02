<template>
  <header class="sticky top-0 z-50 py-4 backdrop-blur-2xl bg-white/30 dark:bg-neutral-900/30">
    <UContainer class="flex max-sm:flex-col items-center justify-between">
      <div class="flex items-end gap-4 max-sm:mb-4">
        <h1 class="py-1.5 text-2xl leading-none">
          <slot />
        </h1>
        <ClientOnly v-if="!colorMode?.forced">
          <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            color="neutral"
            variant="ghost"
            @click="isDark = !isDark"
          />
          <template #fallback>
            <div class="size-8" />
          </template>
        </ClientOnly>
      </div>
      <div class="flex items-center gap-2">
        <slot name="button">
          <UButton
            to="/"
            color="neutral"
            variant="subtle"
          >
            <UIcon name="i-lucide-arrow-left-from-line" />
            Back
          </UButton>
        </slot>
        <GitHub />
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  },
})
</script>
