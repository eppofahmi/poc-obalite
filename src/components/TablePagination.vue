<template>
  <div class="pagination-container">
    <div class="pagination-info">
      Menampilkan {{ startIndex + 1 }}-{{ endIndex }} dari {{ total }} data
    </div>
    <div class="pagination-controls">
      <button 
        class="btn-pagination" 
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <ChevronLeft :size="16" />
        Sebelumnya
      </button>
      <div class="page-numbers">
        <button 
          v-for="page in visiblePages" 
          :key="page"
          class="btn-page"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>
      <button 
        class="btn-pagination" 
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Selanjutnya
        <ChevronRight :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
  currentPage: number
  pageSize: number
  total: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  pageChange: [page: number]
}>()

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const startIndex = computed(() => (props.currentPage - 1) * props.pageSize)
const endIndex = computed(() => Math.min(startIndex.value + props.pageSize, props.total))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('pageChange', page)
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info {
  font-size: 0.875rem;
  color: var(--oba-text-light);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-pagination {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--oba-border);
  background: var(--oba-white);
  color: var(--oba-text);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.btn-pagination:hover:not(:disabled) {
  border-color: var(--oba-primary);
  color: var(--oba-primary);
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.btn-page {
  width: 32px;
  height: 32px;
  border: 1px solid var(--oba-border);
  background: var(--oba-white);
  color: var(--oba-text);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-page:hover {
  border-color: var(--oba-primary);
  color: var(--oba-primary);
}

.btn-page.active {
  background: var(--oba-primary);
  border-color: var(--oba-primary);
  color: var(--oba-white);
}

/* Responsive Design */
@media (max-width: 640px) {
  .pagination-container {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .pagination-info {
    order: 2;
  }
}
</style>