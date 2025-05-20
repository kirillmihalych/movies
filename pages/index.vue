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
      <UButton @click="resetFilters">Сбросить фильтры</UButton>
      <USelectMenu
        v-model="genreList"
        :items="data.genres"
        multiple
        placeholder="Жанр"
        :ui="{
          trailingIcon:
            'group-data-[state=open]:rotate-180 transition-transform duration-200',
        }"
        class="w-48"
      />
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
import type { ISelectItem } from '#imports';

const router = useRouter();

const page = useRouteQuery('page', '1', { transform: Number });

function to(page: number) {
  return {
    query: {
      page,
    },
  };
}

const genre = useRouteQuery('genre', '', { transform: String });
const genreList = ref<ISelectItem[]>([]);

const { $apiFetcher } = useNuxtApp();
const img = 'https://image.tmdb.org/t/p/';
const imgSize = 'w185';

const { pending, error, data } = await useAsyncData(
  'movies',
  async () => {
    const [movies, genres] = await Promise.all([
      moviesRepo($apiFetcher).getMovies(page.value, genre.value),
      moviesRepo($apiFetcher).getGenreList(),
    ]);

    return { movies, genres };
  },
  {
    watch: [page, genre],
  }
);

watch(
  genreList,
  () => {
    genre.value = genreList.value.map((genre) => genre.value).toString();
    page.value = 1;

    // если лист жанров пустой, но в query есть жанры
    // то берём жанры из query
    if (!genreList.value.length && genre.value) {
      const queryParams = genre.value.split(',');
      genreList.value = data.value?.genres.filter((genre) =>
        queryParams.includes(genre.value)
      ) as ISelectItem[];
    }
  },
  { immediate: true }
);

function resetFilters() {
  router.push({ path: '/' });
  genreList.value = [];
}
</script>
