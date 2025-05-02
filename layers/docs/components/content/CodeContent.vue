<template>
  <UAlert
    :color="color"
    :variant="variant"
    :icon="icon"
    class="my-4"
  >
    <template
      v-if="$slots.path"
      #title
    >
      <UTooltip
        :delay-duration="0"
        :text="tooltipText"
        arrow
        :disabled="!tooltip"
        :content="{
          side: 'right',
          sideOffset: 8,
        }"
      >
        <UBadge
          ref="badge"
          color="info"
          variant="subtle"
          class="mb-4 file-path"
        >
          <slot name="path" />
        </UBadge>
      </UTooltip>
    </template>
    <template
      v-if="$slots.default"
      #description
    >
      <slot />
    </template>
  </UAlert>
</template>

<script setup lang="ts">
import type { AlertProps, TooltipProps } from '@nuxt/ui'

withDefaults(defineProps<{
  color?: AlertProps['color']
  variant?: AlertProps['variant']
  icon?: AlertProps['icon']
  tooltip?: TooltipProps['disabled']
  tooltipText?: TooltipProps['text']
}>(), {
  color: 'neutral',
  variant: 'subtle',
  icon: 'i-lucide-terminal',
  tooltipText: 'Open in GitHub',
})
</script>
