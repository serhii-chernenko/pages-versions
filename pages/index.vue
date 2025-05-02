<template>
  <Header>
    Pages
    <template #button>
      <UButton
        to="/docs"
        color="neutral"
        variant="subtle"
      >
        <UIcon name="i-lucide-book" />
        Docs
      </UButton>
    </template>
  </Header>
  <UContainer>
    <UAlert
      v-if="!pages?.length"
      color="neutral"
      variant="subtle"
      title="Pages not found"
      description="Please create a new page to see it here."
      icon="i-lucide-list-plus"
      :actions="[
        {
          label: 'Create first page',
          to: '/new',
          color: 'neutral',
        },
      ]"
    />
    <template v-else>
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 py-1">
          <UInput
            ref="input"
            v-model="searchValue"
            icon="i-lucide-search"
            placeholder="Search..."
            color="neutral"
            @blur="checkSearch"
            @keydown.enter="search"
            @keydown.esc="resetSearch"
          >
            <template #trailing>
              <div class="flex items-center gap-1">
                <UKbd value="meta" />
                <UKbd value="k" />
              </div>
            </template>
          </UInput>
          <UButton
            v-if="$route.query.search && searchValue === $route.query.search"
            color="error"
            icon="i-lucide-search-x"
            @click="resetSearch"
          />
          <UButton
            v-else
            color="neutral"
            icon="i-lucide-search"
            @click="search"
          />
        </div>
        <UButton
          v-if="pages?.length"
          to="/new"
          color="neutral"
        >
          Add <span class="max-sm:sr-only">a new page</span>
        </UButton>
      </div>
      <UTable
        sticky
        :columns="columns"
        :loading="pending"
        loading-color="neutral"
        loading-animation="carousel"
        :data="pages"
        class="flex-1"
      />
    </template>
  </UContainer>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'

const input = useTemplateRef('input')

defineShortcuts({
  meta_k: () => {
    input.value?.inputRef?.focus()
  },
})

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const router = useRouter()
const route = useRoute()

type SortDirections = 'asc' | 'desc'

interface Query {
  sort?: string
  direction?: SortDirections
  search?: string
}

const query = computed(() => {
  const result: Query = {}
  const { sort, direction, search } = route.query

  if (sort) {
    result.sort = sort as string
  }

  if (direction) {
    result.direction = direction as SortDirections
  }

  if (search) {
    result.search = search as string
  }

  return result
})

const {
  data: pages,
  pending,
  execute: reloadPages,
} = await useFetch('/api/pages', {
  key: 'pages',
  query,
  transform: (data) => {
    return (data ?? []).map((page: any) => {
      const version = page.versions[0]
      const content = version.content

      return {
        id: page.id,
        createdAt: new Date(version.createdAt).toLocaleString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        status: version.status,
        title: content.title,
        slug: content.slug,
      }
    })
  },
})

const columns: TableColumn<PagesListing>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      const { direction } = route.query

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Title',
        icon: route.query.sort === column.id
          ? direction === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick() {
          router.push({
            query: {
              ...route.query,
              sort: column.id,
              direction: (route.query.sort === column.id
                && direction === 'asc')
              || route.query.sort !== column.id
                ? 'desc'
                : 'asc',
            },
          })
        },
      })
    },
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => {
      const { direction } = route.query

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Slug',
        icon: route.query.sort === column.id
          ? direction === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick() {
          router.push({
            query: {
              ...route.query,
              sort: column.id,
              direction: (route.query.sort === column.id
                && direction === 'asc')
              || route.query.sort !== column.id
                ? 'desc'
                : 'asc',
            },
          })
        },
      })
    },
    cell: ({ row }) => {
      return h(UBadge, { variant: 'subtle', color: 'neutral' }, () =>
        row.getValue('slug'),
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const color = {
        published: 'success' as const,
        modified: 'warn' as const,
        scheduled: 'info' as const,
        draft: 'neutral' as const,
      }[row.getValue('status') as string]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('status'),
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      const { direction, sort } = route.query

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Created At',
        icon: !sort || sort === column.id
          ? direction === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick() {
          const { sort, direction } = route.query
          const newSort = column.id
          let newDirection: SortDirections = 'desc'

          if (!sort || sort === column.id) {
            if (!direction) {
              newDirection = 'asc'
            } else {
              newDirection = direction === 'asc' ? 'desc' : 'asc'
            }
          } else {
            newDirection = 'desc'
          }

          router.push({
            query: {
              ...route.query,
              sort: newSort,
              direction: newDirection,
            },
          })
        },
      })
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            'content': {
              align: 'end',
            },
            'items': getRowItems(row),
            'aria-label': 'Actions dropdown',
          },
          () =>
            h(UButton, {
              'icon': 'i-lucide-ellipsis-vertical',
              'color': 'neutral',
              'variant': 'ghost',
              'class': 'ml-auto',
              'aria-label': 'Actions dropdown',
            }),
        ),
      )
    },
  },
]

function getRowItems(row: Row<PagesListing>) {
  return [
    {
      label: 'Delete',
      icon: 'i-lucide-trash',
      color: 'error',
      async onSelect() {
        try {
          await $fetch(`/api/pages/${row.original.id}`, {
            method: 'delete',
          })

          toast.add({
            title: 'Page deleted',
            description: `Page ${row.original.title} deleted successfully`,
            color: 'success',
            icon: 'i-lucide-circle-check',
          })

          await reloadPages()
        } catch (_exception: any) {
          toast.add({
            title: 'Error deleting page',
            description: `Page ${row.original.title} could not be deleted`,
            color: 'error',
            icon: 'i-lucide-circle-x',
          })
        }
      },
    },
  ]
}

const searchValue = shallowRef<string>(query.value?.search ?? '')

function search() {
  const newQuery = { ...route.query }
  const value = toValue(searchValue) ?? ''

  if (value) {
    if (route.query.search !== value) {
      newQuery.search = value
    } else {
      toast.add({
        title: 'Search',
        description: 'The value is the same as the current search',
        color: 'neutral',
        icon: 'i-lucide-circle-x',
      })
    }
  } else {
    delete newQuery.search
  }

  router.push({
    query: newQuery,
  })
}

function resetSearch() {
  const newQuery = { ...route.query }

  delete newQuery.search

  router.push({
    query: newQuery,
  })
  searchValue.value = ''
  input.value?.inputRef?.focus()
}

function checkSearch() {
  if (!searchValue.value && route.query.search) {
    resetSearch()
  }
}
</script>
