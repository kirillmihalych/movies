<template>
  <div>
    <p class="mb-4">{{ title }}</p>
    <div class="flex justify-between">
      <UInput v-model="fromYear" placeholder="От" />
      <UInput v-model="toYear" placeholder="До" />
    </div>
  </div>
</template>

<script setup lang="ts">
const title = 'Год';

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
