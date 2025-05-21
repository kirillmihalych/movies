<template>
  <USwitch v-model="includeAdult" label="Фильмы для взрослых" />
</template>

<script setup lang="ts">
const includeAdult = ref(false);
const adult = useRouteQuery('adult');
watch(
  includeAdult,
  (newValue, oldValue) => {
    if (!newValue && oldValue) {
      adult.value = '';
    }

    if (includeAdult.value) {
      adult.value = 'includes';
    }

    if (!includeAdult.value && adult.value) {
      includeAdult.value = true;
    }
  },
  {
    immediate: true,
  }
);
</script>
