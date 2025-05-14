<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else-if="movies">
      <li v-for="movie in movies.results" :key="movie.id">
        <NuxtLink :to="{ name: 'movie-id', params: { id: movie.id } }">{{
          movie.title
        }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { $apiFetcher } = useNuxtApp();

const {
  pending,
  error,
  data: movies,
} = await useAsyncData(() => moviesRepo($apiFetcher).getMovies());
</script>
