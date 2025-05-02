<template>
  <Header>
    Docs
    <template #button>
      <UButton
        to="/"
        color="neutral"
        variant="subtle"
      >
        <UIcon name="i-lucide-store" />
        Storefront
      </UButton>
    </template>
  </Header>
  <UContainer class="relative sm:grid grid-cols-[auto_1fr] items-start gap-4">
    <div class="sm:sticky top-18">
      <UNavigationMenu
        as="nav"
        orientation="vertical"
        color="neutral"
        :items="items"
        class="max-sm:mb-8"
      />
    </div>
    <div class="grow docs-content">
      <slot />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Content',
      type: 'label',
    },
    {
      label: 'Introduction',
      icon: 'i-lucide-house',
      to: '/docs/',
    },
    {
      label: 'Drizzle ORM schema',
      icon: 'i-lucide-database',
      to: '/docs/schema/',
    },
    {
      label: 'API',
      icon: 'i-lucide-cloud',
      to: '/docs/api/',
    },
    {
      label: 'Issue',
      icon: 'i-lucide-shield-alert',
      to: '/docs/issue/',
    },
    {
      label: 'Local installation',
      icon: 'i-lucide:terminal',
      to: '/docs/installation/',
    },
  ],
])
</script>
