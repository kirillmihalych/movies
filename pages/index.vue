<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <UPagination
      :page="page"
      :sibling-count="2"
      :total="100"
      :to="to"
      variant="ghost"
    />
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="data">
      <TheFilters @apply-filters="updateMoviesData" />
      <ul
        class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-4 px-2 py-4"
      >
        <li v-for="movie in data.movies.results" :key="movie.id">
          <NuxtLink :to="{ name: 'movie-id', params: { id: movie.id } }">
            <img
              :src="img + imgSize + movie.poster_path"
              :alt="movie.title"
              loading="lazy"
              class="aspect-[1/1.5]"
            />
            <div class="p-1 opacity-75">
              <div class="flex justify-between items-center text-xs">
                <div class="flex items-center gap-1">
                  <Icon name="lucide:star" />
                  <span>{{ movie.vote_average.toFixed(1) }}</span>
                </div>
                <p>{{ movie.release_date.slice(0, 4) }}</p>
              </div>
              <h3 class="text-sm">{{ movie.title }}</h3>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router';

const page = useRouteQuery('page', '1', { transform: Number });
function to(page: number) {
  return {
    query: {
      page,
      genre: route.query.genre,
      adult: route.query.adult,
      fromYear: route.query.fromYear,
      toYear: route.query.toYear,
    },
  };
}

const { $apiFetcher } = useNuxtApp();
const img = 'https://image.tmdb.org/t/p/';
const imgSize = 'w185';

const route = useRoute();
const genreQuery = computed(() => {
  return route.query.genre ? String(route.query.genre) : '';
});
const adultQuery = computed(() => {
  return route.query.adult ? Boolean(route.query.adult) : false;
});
const fromYearQuery = computed(() => {
  return route.query.fromYear ? `${String(route.query.fromYear)}-01-01` : '';
});
const toYearQuery = computed(() => {
  return route.query.toYear ? `${String(route.query.toYear)}-12-31` : '';
});

const {
  pending,
  error,
  data,
  refresh: refreshMovies,
} = await useAsyncData(
  'movies',
  async () => {
    const movies = await moviesRepo($apiFetcher).getMovies(
      page.value,
      genreQuery.value,
      adultQuery.value,
      fromYearQuery.value,
      toYearQuery.value
    );
    return { movies };
  },
  {
    watch: [page],
  }
);

function updateMoviesData() {
  if (page.value === 1) {
    refreshMovies();
  } else {
    // не нужно вызывать refresh,
    // page затригерит изменения
    page.value = 1;
  }
}
</script>
