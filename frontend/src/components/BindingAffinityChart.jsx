import React from "react";
import { Bar } from "react-chartjs-2";
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

  // Color code by binding strength
  const backgroundColors = affinities.map((affinity) => {
    if (affinity <= -9.0) return "rgba(34, 197, 94, 0.8)"; // Strong (green)
    if (affinity <= -7.0) return "rgba(234, 179, 8, 0.8)"; // Moderate (yellow)
    return "rgba(239, 68, 68, 0.8)"; // Weak (red)
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Binding Affinity (kcal/mol)",
        data: affinities,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map((c) => c.replace("0.8", "1")),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Binding Affinity Comparison",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `ΔG: ${context.parsed.y} kcal/mol`;
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
        },
        ticks: {
          callback: function (value) {
            return value.toFixed(1);
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Ligand",
        },
      },
    },
  };

  return (
    <div style={{ height: "350px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
