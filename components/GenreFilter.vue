<template>
  <UCollapsible default-open class="flex flex-col gap-2 w-full">
    <UButton
      class="group font-bold px-0 hover:bg-neutral hover:text-primary"
      label="Жанр"
      color="neutral"
      size="xl"
      variant="ghost"
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
          variant="soft"
          class="pb-2 pr-2"
        />
        <UCheckboxGroup v-model="selectedGenres" :items="displayedGenres" />
        <UButton
          v-if="!isShowAll"
          trailing-icon="i-lucide-chevron-down"
          variant="ghost"
          class="px-0 hover:bg-neutral"
          @click="isShowAll = true"
          >показать все</UButton
        >
      </div>
    </template>
  </UCollapsible>
</template>

<script setup lang="ts">
const { $apiFetcher } = useNuxtApp();

const { data: genres } = await useAsyncData(
  'genres',
  async () => await moviesRepo($apiFetcher).getGenreList()
);
const genre = useRouteQuery('genre', '', { transform: String });
const selectedGenres = ref<string[]>([]);
const isShowAll = ref(false);
const genreFilter = ref('');
const displayedGenres = computed(() => {
  const filteredGenres = genres.value?.filter((genre) =>
    genre.label.includes(genreFilter.value)
  );
  const slicedGenres = genres.value?.slice(0, 5);
  return isShowAll.value ? filteredGenres : slicedGenres;
});

function getGenresFromQuery() {
  if (!selectedGenres.value.length && genre.value) {
    const queryParams = genre.value.split(',');
    selectedGenres.value = queryParams;
  }
}

function clearGenresQuery(
  newSelected: string[],
  oldSelected: string[] | undefined
) {
  if (
    newSelected.length === 0 &&
    oldSelected?.length &&
    oldSelected?.length > 0
  ) {
    genre.value = '';
  }
}

function saveGenresInQuery() {
  if (selectedGenres.value.length) {
    genre.value = selectedGenres.value.toString();
  }
}

watch(
  selectedGenres,
  (newSelected, oldSelected) => {
    clearGenresQuery(newSelected, oldSelected);
    saveGenresInQuery();
    getGenresFromQuery();
  },
  { immediate: true }
);
</script>
