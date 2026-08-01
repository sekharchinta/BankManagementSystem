import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

ChartJS.defaults.font.family =
  "'Inter', ui-sans-serif, system-ui, sans-serif";
ChartJS.defaults.font.size = 11;
ChartJS.defaults.color = "#64748b";

export const CHART_COLORS = {
  indigo: "#6366f1",
  violet: "#8b5cf6",
  emerald: "#10b981",
  amber: "#f59e0b",
  sky: "#0ea5e9",
  rose: "#f43f5e",
  slate: "#94a3b8",
};

export const gridOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { usePointStyle: true, boxWidth: 8, padding: 16 } },
    tooltip: {
      backgroundColor: "#0f172a",
      padding: 10,
      cornerRadius: 8,
      titleFont: { weight: 600 },
      bodyFont: { size: 12 },
    },
  },
};

export { Line, Bar, Doughnut };
