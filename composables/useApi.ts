export function useApi<T>(path: string, options: any = {}) {
  const config = useRuntimeConfig()
  
  return useFetch<T>(path, {
    baseURL: `${config.public.apiBase}/api/v1`,
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    ...options,
  })
}