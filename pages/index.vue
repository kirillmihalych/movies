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
      <UCollapsible class="flex flex-col gap-2 w-48">
        <UButton
          class="group"
          label="Жанр"
          color="neutral"
          variant="subtle"
          trailing-icon="i-lucide-chevron-down"
          :ui="{
            trailingIcon:
              'group-data-[state=open]:rotate-180 transition-transform duration-200',
          }"
          block
        />
        <template #content>
          <div
            class="h-[150px] pb-2"
            :class="[isShowAll ? 'overflow-y-scroll' : 'overflow-hidden']"
          >
            <UInput
              v-if="isShowAll"
              v-model="genreFilter"
              placeholder="Найти в списке"
              class="pb-2 pr-2"
            />
            <UCheckboxGroup v-model="genreList" :items="displayedGenres" />
            <UButton
              v-if="!isShowAll"
              trailing-icon="i-lucide-chevron-down"
              variant="ghost"
              @click="isShowAll = true"
              >показать все</UButton
            >
          </div>
        </template>
      </UCollapsible>
      <!--  -->
      <UButton @click="resetFilters">Сбросить фильтры</UButton>
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
const genreList = ref<string[]>([]);
const isShowAll = ref(false);
const genreFilter = ref('');

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
const displayedGenres = computed(() => {
  const genres = isShowAll.value
    ? data.value?.genres
    : data.value?.genres.slice(0, 5);
  return genres?.filter((genre) => genre.label.includes(genreFilter.value));
});

watch(
  genreList,
  () => {
    page.value = 1;
    if (genreList.value.length) {
      genre.value = genreList.value.toString();
    }

    // если лист жанров пустой, но в query есть жанры
    // то берём жанры из query
    if (!genreList.value.length && genre.value) {
      const queryParams = genre.value.split(',');
      genreList.value = queryParams;
    }
  },
  { immediate: true }
);

function resetFilters() {
  router.push({ path: '/' });
  genreList.value = [];
}
</script>
