<template>
  <UCollapsible default-open>
    <UButton
      class="group px-0 hover:bg-neutral hover:text-primary font-bold"
      label="Год"
      color="neutral"
      variant="ghost"
      size="xl"
      trailing-icon="i-lucide-chevron-down"
      :ui="{
        trailingIcon:
          'group-data-[state=open]:rotate-180 transition-transform duration-200',
      }"
      block
    />

    <template #content>
      <div class="flex justify-between items-center gap-4">
        <div>
          <p class="opacity-50 mb-1">от</p>
          <UInput v-model="fromYear" variant="soft" />
        </div>
        <div>
          <p class="opacity-50 mb-1">до</p>
          <UInput v-model="toYear" variant="soft" />
        </div>
      </div>
    </template>
  </UCollapsible>
</template>

<script setup lang="ts">
const fromYear = ref('');
const toYear = ref('');

const fromYearQuery = useRouteQuery('fromYear');
const toYearQuery = useRouteQuery('toYear');

watch(
  fromYear,
  (newFromYear) => {
    if (newFromYear.length) {
      fromYearQuery.value = fromYear.value;
    }

    if (!fromYear.value && fromYearQuery.value) {
      fromYear.value = fromYearQuery.value.toString();
    }
  },
  {
    immediate: true,
  }
);

watch(
  toYear,
  (newToYear) => {
    if (newToYear.length) {
      toYearQuery.value = toYear.value;
    }

    if (!toYear.value && toYearQuery.value) {
      toYear.value = toYearQuery.value.toString();
    }
  },
  {
    immediate: true,
  }
);
</script>
