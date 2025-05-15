export default defineNuxtPlugin({
  setup() {
    const apiFetcher = $fetch.create({
      baseURL: useRuntimeConfig().public.apiBase,
      headers: {
        Authorization: useRuntimeConfig().public.apiKey,
      },
      retry: 3,
      retryDelay: 500,
    });

    return {
      provide: {
        apiFetcher,
      },
    };
  },
});
