<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="movie">{{ movie.title }}</div>
  </div>
</template>

<script setup lang="ts">
const { id } = useRoute().params;
const { $apiFetcher } = useNuxtApp();

const {
  pending,
  error,
  data: movie,
} = await useAsyncData(`movie:${id}`, () =>
  moviesRepo($apiFetcher).getMovieDetails(id as string)
);
</script>
