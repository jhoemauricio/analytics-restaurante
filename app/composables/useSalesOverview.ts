export function useSalesOverview() {
  const fetchOverview = async (params: { period?: string; start?: string; end?: string } = {}) => {
    return await $fetch("/api/overview", { params });
  };

  return { fetchOverview };
}
