import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { FiBarChart2 } from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BindingAffinityChart({ rankedLigands }) {
  if (!rankedLigands || rankedLigands.length === 0) {
    return null;
  }

  // Prepare data
  const labels = rankedLigands.map((l) => l.ligand_name);
  const affinities = rankedLigands.map((l) => parseFloat(l.binding_affinity));

  // Color code by binding strength with gradients
  const backgroundColors = affinities.map((affinity) => {
    if (affinity <= -9.0) return "rgba(34, 197, 94, 0.85)"; // Strong (green)
    if (affinity <= -7.0) return "rgba(234, 179, 8, 0.85)"; // Moderate (yellow)
    return "rgba(239, 68, 68, 0.85)"; // Weak (red)
  });

  const borderColors = affinities.map((affinity) => {
    if (affinity <= -9.0) return "rgb(34, 197, 94)";
    if (affinity <= -7.0) return "rgb(234, 179, 8)";
    return "rgb(239, 68, 68)";
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Binding Affinity (kcal/mol)",
        data: affinities,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(23, 23, 23, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function (context) {
            return context[0].label;
          },
          label: function (context) {
            const value = context.parsed.y;
            const strength =
              value <= -9.0 ? "Strong" : value <= -7.0 ? "Moderate" : "Weak";
            return [`ΔG: ${value} kcal/mol`, `Binding: ${strength}`];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "ΔG (kcal/mol)",
          font: {
            size: 12,
            weight: "600",
          },
          color: "#6b7280",
        },
        ticks: {
          callback: function (value) {
            return value.toFixed(1);
          },
          color: "#9ca3af",
          font: {
            size: 11,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
      },
      x: {
        title: {
          display: true,
          text: "Ligand",
          font: {
            size: 12,
            weight: "600",
          },
          color: "#6b7280",
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <motion.div
      className="glass rounded-xl p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <FiBarChart2 className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Binding Affinity Landscape
          </h2>
          <p className="text-sm text-gray-600">
            Lower values indicate stronger binding
          </p>
        </div>
      </div>

      <div style={{ height: "350px" }}>
        <Bar data={data} options={options} />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-sm text-gray-600">Strong (≤ -9.0)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500"></div>
          <span className="text-sm text-gray-600">Moderate (-9.0 to -7.0)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-sm text-gray-600">Weak (≥ -7.0)</span>
        </div>
      </div>
    </motion.div>
  );
}
