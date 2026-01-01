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
    if (affinity <= -8.0) return "rgba(34, 197, 94, 0.85)"; // Strong (green)
    if (affinity <= -6.0) return "rgba(234, 179, 8, 0.85)"; // Moderate (yellow)
    return "rgba(239, 68, 68, 0.85)"; // Weak (red)
  });

  const borderColors = affinities.map((affinity) => {
    if (affinity <= -8.0) return "rgb(34, 197, 94)";
    if (affinity <= -6.0) return "rgb(234, 179, 8)";
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
      duration: 1500,
      easing: "easeInOutQuart",
      delay: (context) => {
        // Stagger bar animations
        return context.dataIndex * 100;
      },
      onProgress: (animation) => {
        // Add a subtle bounce effect at the end
        if (animation.currentStep === animation.numSteps) {
          animation.chart.update("none");
        }
      },
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
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "600",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: function (context) {
            return context[0].label;
          },
          label: function (context) {
            const value = context.parsed.y;
            const strength =
              value <= -8.0 ? "Strong" : value <= -6.0 ? "Moderate" : "Weak";
            return [`ΔG: ${value} kcal/mol`, `Binding: ${strength}`];
          },
        },
        // Add hover animations
        external: function (context) {
          const tooltip = context.tooltip;
          if (tooltip.opacity === 0) return;

          // Add subtle scale animation on hover
          const chart = context.chart;
          const activeElements = chart.getActiveElements();

          if (activeElements.length > 0) {
            const element = activeElements[0];
            const datasetIndex = element.datasetIndex;
            const index = element.index;

            // You could add custom hover effects here
          }
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
    // Add hover effects
    onHover: (event, activeElements, chart) => {
      event.native.target.style.cursor =
        activeElements.length > 0 ? "pointer" : "default";
    },
    // Add click interactions
    onClick: (event, activeElements, chart) => {
      if (activeElements.length > 0) {
        const element = activeElements[0];
        const ligandName = chart.data.labels[element.index];
        const affinity = chart.data.datasets[0].data[element.index];

        // You could trigger a modal or detailed view here
        console.log(`Clicked on ${ligandName}: ${affinity} kcal/mol`);
      }
    },
  };

  return (
    <motion.div
      className="glass rounded-xl p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3 },
      }}
    >
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="p-2 bg-purple-100 rounded-lg"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FiBarChart2 className="w-5 h-5 text-purple-600" />
        </motion.div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Binding Affinity Landscape
          </h2>
          <p className="text-sm text-gray-600">
            Lower values indicate stronger binding
          </p>
        </div>
      </motion.div>

      <motion.div
        style={{ height: "350px" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Bar data={data} options={options} />
      </motion.div>

      {/* Enhanced Legend with animations */}
      <motion.div
        className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        {[
          {
            color: "bg-green-500",
            label: "Strong (≤ -8.0)",
            count: affinities.filter((a) => a <= -8.0).length,
          },
          {
            color: "bg-yellow-500",
            label: "Moderate (-8.0 to -6.0)",
            count: affinities.filter((a) => a > -8.0 && a <= -6.0).length,
          },
          {
            color: "bg-red-500",
            label: "Weak (≥ -6.0)",
            count: affinities.filter((a) => a > -6.0).length,
          },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className={`w-4 h-4 rounded ${item.color}`}></div>
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {item.count}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
