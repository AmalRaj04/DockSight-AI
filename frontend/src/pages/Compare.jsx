import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiTrendingDown,
  FiLayers,
  FiBarChart2,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import LoadingSpinner from "../components/LoadingSpinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Compare() {
  const [searchParams] = useSearchParams();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const ids = searchParams.get("ids");
    if (!ids) {
      navigate("/history");
      return;
    }

    const analysisIds = ids.split(",");
    fetchAnalyses(analysisIds);
  }, [searchParams, navigate]);

  const fetchAnalyses = async (ids) => {
    try {
      const promises = ids.map((id) =>
        fetch(`http://localhost:8000/api/analyses/${id}`).then((r) => r.json())
      );
      const results = await Promise.all(promises);
      setAnalyses(results);
      setLoading(false);
    } catch (err) {
      alert("Failed to load analyses");
      navigate("/history");
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getOverlappingLigands = () => {
    if (analyses.length < 2) return [];

    const ligandSets = analyses.map(
      (a) => new Set(a.ranked_ligands.map((l) => l.ligand_name))
    );

    const intersection = [...ligandSets[0]].filter((ligand) =>
      ligandSets.every((set) => set.has(ligand))
    );

    return intersection;
  };

  const getComparisonData = () => {
    const overlapping = getOverlappingLigands();

    return overlapping.map((ligandName) => {
      const affinities = analyses.map((analysis) => {
        const ligand = analysis.ranked_ligands.find(
          (l) => l.ligand_name === ligandName
        );
        return ligand ? parseFloat(ligand.binding_affinity) : null;
      });

      return {
        ligand: ligandName,
        affinities,
        improvement:
          affinities.length > 1
            ? affinities[affinities.length - 1] - affinities[0]
            : 0,
      };
    });
  };

  const getChartData = () => {
    const comparisonData = getComparisonData();

    const datasets = analyses.map((analysis, idx) => ({
      label: `Analysis ${idx + 1}`,
      data: comparisonData.map((d) => d.affinities[idx]),
      backgroundColor: [
        "rgba(59, 130, 246, 0.8)",
        "rgba(34, 197, 94, 0.8)",
        "rgba(234, 179, 8, 0.8)",
      ][idx],
      borderColor: [
        "rgb(59, 130, 246)",
        "rgb(34, 197, 94)",
        "rgb(234, 179, 8)",
      ][idx],
      borderWidth: 2,
      borderRadius: 6,
    }));

    return {
      labels: comparisonData.map((d) => d.ligand),
      datasets,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen molecular-grid flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading comparison..." />
      </div>
    );
  }

  const overlappingLigands = getOverlappingLigands();
  const comparisonData = getComparisonData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12, weight: "600" },
          color: "#374151",
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(23, 23, 23, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y} kcal/mol`;
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
          font: { size: 12, weight: "600" },
          color: "#6b7280",
        },
        ticks: {
          color: "#9ca3af",
          font: { size: 11 },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        ticks: {
          color: "#9ca3af",
          font: { size: 11 },
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
    <div className="min-h-screen molecular-grid">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate("/history")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to History
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Analysis Comparison
          </h1>
          <p className="text-gray-600">
            Side-by-side comparison of {analyses.length} analyses
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {analyses.map((analysis, idx) => (
            <motion.div
              key={idx}
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    idx === 0
                      ? "bg-blue-500"
                      : idx === 1
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                ></div>
                <h3 className="font-semibold text-gray-900">
                  Analysis {idx + 1}
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <FiLayers className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Ligands:</span>
                  <span className="font-semibold text-gray-900">
                    {analysis.ranked_ligands?.length || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiTrendingDown className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Best ΔG:</span>
                  <span className="font-semibold text-green-600">
                    {analysis.ranked_ligands?.[0]?.binding_affinity || "N/A"}{" "}
                    kcal/mol
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                  {formatDate(analysis.timestamp)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overlapping Ligands */}
        <motion.div
          className="glass rounded-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiLayers className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Overlapping Ligands
              </h2>
              <p className="text-sm text-gray-600">
                {overlappingLigands.length} compounds found in all analyses
              </p>
            </div>
          </div>

          {overlappingLigands.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {overlappingLigands.map((ligand, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                >
                  {ligand}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No overlapping ligands found between the selected analyses
            </p>
          )}
        </motion.div>

        {/* Comparison Chart */}
        {overlappingLigands.length > 0 && (
          <motion.div
            className="glass rounded-xl p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiBarChart2 className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Binding Affinity Comparison
              </h2>
            </div>
            <div style={{ height: "400px" }}>
              <Bar data={getChartData()} options={chartOptions} />
            </div>
          </motion.div>
        )}

        {/* Detailed Comparison Table */}
        {overlappingLigands.length > 0 && (
          <motion.div
            className="glass rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Detailed Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Ligand
                    </th>
                    {analyses.map((_, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-3 text-left font-semibold text-gray-700"
                      >
                        Analysis {idx + 1}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Difference
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {row.ligand}
                      </td>
                      {row.affinities.map((affinity, aIdx) => (
                        <td key={aIdx} className="px-4 py-3">
                          <span className="font-semibold text-gray-900">
                            {affinity !== null ? `${affinity} kcal/mol` : "N/A"}
                          </span>
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        {row.improvement !== 0 && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              row.improvement < 0
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                            }`}
                          >
                            {row.improvement > 0 ? "+" : ""}
                            {row.improvement.toFixed(2)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
