export function useTopProductsWeekday() {
  const fetchTopProductsWeekday = async (params: {
    period?: string;
    channel?: string | string[];
    weekday?: number | number[];
  } = {}) => {
    const queryParams = new URLSearchParams();

    if (params.period) queryParams.append("period", params.period);

    if (params.channel) {
      const channels = Array.isArray(params.channel) ? params.channel : [params.channel];
      channels.forEach((c) => queryParams.append("channel", c));
    }

    if (params.weekday) {
      const days = Array.isArray(params.weekday) ? params.weekday : [params.weekday];
      days.forEach((d) => queryParams.append("weekday", String(d)));
    }

    return await $fetch(`/api/top-products-weekday?${queryParams.toString()}`);
  };

  return { fetchTopProductsWeekday };
}
