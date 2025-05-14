export default defineNuxtPlugin({
  setup() {
    const apiFetcher = $fetch.create({
      baseURL: useRuntimeConfig().public.apiBase,
      headers: {
        Authorization: useRuntimeConfig().public.apiKey,
      },
    });

    return {
      provide: {
        apiFetcher,
      },
    };
  },
});
