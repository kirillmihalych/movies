<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <p>{{ page }}</p>
    <UPagination v-model:page="page" :sibling-count="2" :total="100" />
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="movies">
      <ul class="flex flex-wrap">
        <li v-for="movie in movies.results" :key="movie.id">
          <NuxtLink :to="{ name: 'movie-id', params: { id: movie.id } }">
            <NuxtImg
              width="50px"
              :src="img + imgSize + movie.poster_path"
              alt=""
            />
            <h3>{{ movie.title }}</h3>
            <p>{{ movie.vote_average.toFixed(1) }}</p>
            <p>{{ movie.release_date.slice(0, 4) }}</p>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $apiFetcher } = useNuxtApp();
const page = ref(1);
const img = 'https://image.tmdb.org/t/p/';
const imgSize = 'w185';

const {
  pending,
  error,
  data: movies,
} = await useAsyncData(
  'movies',
  async () => {
    return moviesRepo($apiFetcher).getMovies(page.value);
  },
  {
    watch: [page],
  }
);
</script>
