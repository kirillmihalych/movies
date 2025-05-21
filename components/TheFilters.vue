<template>
  <USlideover title="Фильтры">
    <UButton icon="lucide-settings-2" size="xl" color="neutral" variant="ghost">
      Фильтры
    </UButton>

    <template #body>
      <div class="flex flex-col gap-4">
        <AdultFilter />
        <YearFilter />
        <GenreFilter />
        <UButton @click="() => $emit('applyFilters')">Применить</UButton>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
defineEmits<{
  applyFilters: () => void;
}>();
</script>
