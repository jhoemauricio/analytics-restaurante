<template>
  <div class="p-6 bg-white shadow rounded">
    <h2 class="text-xl font-bold mb-4">Top Produtos por Dia da Semana</h2>

    <!-- Filtros -->
    <div class="flex gap-2 mb-4">
      <select v-model="period" @change="loadData" class="border p-2 rounded">
        <option value="7">Últimos 7 dias</option>
        <option value="15">Últimos 15 dias</option>
        <option value="30">Últimos 30 dias</option>
      </select>

      <select v-model="selectedChannels" multiple @change="loadData" class="border p-2 rounded">
        <option v-for="c in channels" :key="c" :value="c">{{ c }}</option>
      </select>

      <select v-model="selectedWeekdays" multiple @change="loadData" class="border p-2 rounded">
        <option v-for="(d, i) in weekdays" :key="i" :value="i">{{ d }}</option>
      </select>
    </div>

    <canvas ref="chartRef" class="w-full h-64"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";
import { useTopProductsWeekday } from "~/composables/useTopProductsWeekDay";

const period = ref("30");
const selectedChannels = ref<string[]>([]);
const selectedWeekdays = ref<number[]>([]);

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const channels = ["iFood", "Rappi", "Presencial", "Uber Eats","WhatsApp","App Próprio"];
const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const { fetchTopProductsWeekday } = useTopProductsWeekday();

const loadData = async () => {
  const data = await fetchTopProductsWeekday({
    period: period.value,
    channel: selectedChannels.value,
    weekday: selectedWeekdays.value,
  });

  renderChart(data);
};

const renderChart = (data: any[]) => {
  if (!chartRef.value) return;

  // Agrupar por produto e weekday
  const products = Array.from(new Set(data.map((d) => d.product_name)));
  const datasets: any[] = [];

  weekdays.forEach((day, idx) => {
    const dayData = products.map((product) => {
      const row = data.find((d) => d.product_name === product && Number(d.weekday) === idx);
      return row ? row.total_sales : 0;
    });
    datasets.push({
      label: day,
      data: dayData,
      backgroundColor: `hsl(${(idx * 50) % 360}, 70%, 50%)`,
    });
  });

  const chartData = { labels: products, datasets };
  const options = { responsive: true, plugins: { legend: { position: "top" } }, scales: { y: { beginAtZero: true } } };

  if (chart) {
    chart.data = chartData;
    chart.update();
  } else {
    chart = new Chart(chartRef.value, { type: "bar", data: chartData, options });
  }
};

onMounted(loadData);
watch([period, selectedChannels, selectedWeekdays], loadData);
</script>
