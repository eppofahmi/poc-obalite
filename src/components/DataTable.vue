<template>
  <table class="data-table">
    <thead>
      <tr>
        <th 
          v-for="column in columns" 
          :key="column.key"
          :class="{ 
            sortable: column.sortable, 
            [column.align || 'left']: true,
            [`width-${column.width}`]: column.width
          }"
          @click="column.sortable && handleSort(column.key)"
        >
          <span v-if="column.sortable" class="sortable-header">
            {{ column.title }}
            <ChevronsUpDown :size="16" class="sort-icon" />
          </span>
          <span v-else>{{ column.title }}</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr 
        v-for="(item, index) in data" 
        :key="getRowKey(item, index)"
        class="table-row"
        @click="handleRowClick(item, index)"
      >
        <td 
          v-for="column in columns" 
          :key="column.key"
          :class="[column.align || 'left', column.className]"
        >
          <slot 
            :name="`cell-${column.key}`" 
            :item="item" 
            :value="getNestedValue(item, column.key)"
            :index="index"
          >
            {{ getNestedValue(item, column.key) }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { ChevronsUpDown } from 'lucide-vue-next'

export interface TableColumn {
  key: string
  title: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

interface Props {
  columns: TableColumn[]
  data: T[]
  rowKey?: string | ((row: T, index: number) => string | number)
}

const props = defineProps<Props>()

const emit = defineEmits<{
  sort: [column: string]
  rowClick: [item: T, index: number]
}>()

const handleSort = (column: string) => {
  emit('sort', column)
}

const handleRowClick = (item: T, index: number) => {
  emit('rowClick', item, index)
}

const getRowKey = (item: T, index: number): string | number => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(item, index)
  }
  if (props.rowKey && item[props.rowKey as keyof T]) {
    return item[props.rowKey as keyof T] as string | number
  }
  return index
}

const getNestedValue = (obj: T, path: string): unknown => {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}
</script>

<style scoped>
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.data-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table th {
  background: #f8fafc;
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--oba-text);
  border-bottom: 1px solid var(--oba-border);
  white-space: nowrap;
}

.data-table th.center {
  text-align: center;
}

.data-table th.right {
  text-align: right;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.data-table th.sortable:hover {
  background: #f1f5f9;
}

.sortable-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-icon {
  color: var(--oba-text-light);
  transition: color 0.2s ease;
}

.data-table th.sortable:hover .sort-icon {
  color: var(--oba-primary);
}

.data-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.875rem;
  color: var(--oba-text);
}

.data-table td.center {
  text-align: center;
}

.data-table td.right {
  text-align: right;
}

.table-row:hover {
  background-color: #f8fafc;
}

.table-row:last-child td {
  border-bottom: none;
}

/* Width utilities */
.data-table th.width-sm,
.data-table td.width-sm {
  width: 80px;
}

.data-table th.width-md,
.data-table td.width-md {
  width: 120px;
}

.data-table th.width-lg,
.data-table td.width-lg {
  width: 200px;
}

.data-table th.width-xl,
.data-table td.width-xl {
  width: 300px;
}
</style>