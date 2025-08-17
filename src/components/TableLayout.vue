<template>
  <div class="table-layout">
    <!-- Page Header Section -->
    <div class="page-header">
      <div class="header-title">
        <h1>{{ title }}</h1>
        <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.headerActions" class="header-actions">
        <slot name="headerActions" />
      </div>
    </div>

    <!-- Filter Section -->
    <div v-if="$slots.filters" class="filter-section">
      <slot name="filters" />
    </div>

    <!-- Table Container (Scrollable) -->
    <div class="table-container">
      <div class="table-wrapper">
        <slot name="table" />
      </div>
      
      <!-- Pagination Section (Unified with Table) -->
      <div v-if="$slots.pagination" class="table-pagination">
        <slot name="pagination" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<style scoped>
/* Table Layout Container */
.table-layout {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  background-color: var(--oba-background);
  overflow: hidden;
}

/* Page Header Section */
.page-header {
  background: var(--oba-background);
  padding: 24px 32px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-title h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--oba-text);
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--oba-text-light);
  margin: 0;
  line-height: 1.5;
}

.header-actions {
  flex-shrink: 0;
}

/* Filter Section */
.filter-section {
  background: var(--oba-background);
  padding: 20px 32px;
  flex-shrink: 0;
}

/* Table Container (Scrollable) */
.table-container {
  flex: 1;
  overflow: hidden;
  padding: 0 32px;
  margin: 16px 0 32px 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.table-wrapper {
  background: var(--oba-white);
  border-radius: 12px 12px 0 0;
  border: 1px solid var(--oba-border);
  border-bottom: none;
  flex: 1;
  overflow: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  min-height: 0;
}

/* Pagination Section */
.table-pagination {
  background: var(--oba-white);
  border: 1px solid var(--oba-border);
  border-top: none;
  border-radius: 0 0 12px 12px;
  padding: 16px 20px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .page-header,
  .filter-section,
  .table-container {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-actions {
    align-self: stretch;
  }
}

@media (max-width: 640px) {
  .page-header,
  .filter-section,
  .table-container {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .table-pagination {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
</style>