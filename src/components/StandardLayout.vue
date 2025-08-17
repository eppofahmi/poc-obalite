<template>
  <div class="standard-layout">
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

    <!-- Filter Section (Optional) -->
    <div v-if="$slots.filters" class="filter-section">
      <slot name="filters" />
    </div>

    <!-- Scrollable Content -->
    <div class="content-area">
      <slot name="content" />
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
/* Standard Layout Container */
.standard-layout {
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

/* Content Area (Scrollable) */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px 32px 32px 32px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .page-header,
  .filter-section,
  .content-area {
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
  .content-area {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .content-area {
    padding: 12px 16px 20px 16px;
  }
}
</style>