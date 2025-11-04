<template>
  <div class="p-6 bg-white shadow rounded">
    <h2 class="text-xl font-bold mb-4">Resumo de Vendas</h2>

    <!-- Filtros -->
    <div class="flex gap-2 mb-6">
      <select v-model="period" @change="updatePeriod" class="border p-2 rounded">
        <option value="7">Últimos 7 dias</option>
        <option value="15">Últimos 15 dias</option>
        <option value="30">Últimos 30 dias</option>
        <!-- <option value="custom">Customizado</option> -->
      </select>

      <input
        v-if="period === 'custom'"
        type="date"
        v-model="startDate"
        @change="updatePeriod"
        class="border p-2 rounded"
      />
      <input
        v-if="period === 'custom'"
        type="date"
        v-model="endDate"
        @change="updatePeriod"
        class="border p-2 rounded"
      />
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="p-4 bg-blue-50 rounded text-center">
        <div class="text-sm font-medium text-gray-600">Faturamento</div>
        <div class="text-xl font-bold text-blue-600">R$ {{ overview.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</div>
      </div>
      <div class="p-4 bg-green-50 rounded text-center">
        <div class="text-sm font-medium text-gray-600">Pedidos</div>
        <div class="text-xl font-bold text-green-600">{{ overview.total_orders.toLocaleString() }}</div>
      </div>
      <div class="p-4 bg-yellow-50 rounded text-center">
        <div class="text-sm font-medium text-gray-600">Ticket Médio</div>
        <div class="text-xl font-bold text-yellow-600">R$ {{ overview.avg_ticket.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</div>
      </div>
    </div>

    <!-- Gráfico -->
    <canvas ref="chartRef" class="w-full h-64"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import Chart from "chart.js/auto";
import { useSalesOverview } from "~/composables/useSalesOverview";

const period = ref<"7" | "15" | "30" | "custom">("30");
const startDate = ref<string>("");
const endDate = ref<string>("");

const overview = ref({ revenue: 0, total_orders: 0, avg_ticket: 0 });
const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const { fetchOverview } = useSalesOverview();

const loadOverview = async () => {
  const params: any = { period: period.value };
  if (period.value === "custom") {
    params.start = startDate.value;
    params.end = endDate.value;
  }

  overview.value = await fetchOverview(params);
  renderChart();
};

const renderChart = () => {
  if (!chartRef.value) return;

const data = {
  labels: ["Faturamento", "Total de Pedidos", "Ticket Médio"],
  datasets: [
    {
      label: "KPIs",
      data: [overview.value.revenue, overview.value.total_orders, overview.value.avg_ticket],
      backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      borderRadius: 6,
      maxBarThickness: 80,   // Aumenta a largura das barras
      minBarLength: 20       // Garante que mesmo valores pequenos fiquem visíveis
    }
  ]
};

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            if (context.dataIndex === 0 || context.dataIndex === 2) {
              // Formata Faturamento e Ticket Médio
              return `R$ ${Number(context.raw).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            } else {
              // Total de pedidos
              return `${Number(context.raw).toLocaleString()} pedidos`;
            }
          }
        }
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  if (chart) {
    chart.data = data;
    chart.options = options;
    chart.update();
  } else {
    chart = new Chart(chartRef.value, {
      type: "bar",
      data,
      options
    });
  }
};

const updatePeriod = () => {
  loadOverview();
};

onMounted(loadOverview);
watch([period, startDate, endDate], loadOverview);
</script>
