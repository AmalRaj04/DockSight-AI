import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiTrendingDown,
  FiLayers,
  FiBarChart2,
  FiArrowUp,
  FiArrowDown,
  FiMinus,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiCalendar,
  FiFolder,
  FiTag,
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
import { LazySection } from "../utils/lazyLoading.jsx";

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
  const [syncScroll, setSyncScroll] = useState(true);
  const scrollContainerRefs = useRef([]);
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

  const handleSyncScroll = (scrollingIndex, scrollTop) => {
    if (!syncScroll) return;

    scrollContainerRefs.current.forEach((ref, index) => {
      if (ref && index !== scrollingIndex) {
        ref.scrollTop = scrollTop;
      }
    });
  };

  const getDifferenceIndicator = (value1, value2) => {
    if (!value1 || !value2) return null;

    const diff = parseFloat(value2) - parseFloat(value1);
    if (Math.abs(diff) < 0.01) return { type: "same", value: 0, icon: FiMinus };
    if (diff > 0) return { type: "worse", value: diff, icon: FiArrowUp };
    return { type: "better", value: diff, icon: FiArrowDown };
  };

  const getAnalysisMetadata = (analysis) => {
    return {
      date: formatDate(analysis.timestamp),
      project: analysis.project || "No Project",
      tags: analysis.tags || [],
      ligandCount: analysis.ranked_ligands?.length || 0,
      topAffinity: analysis.ranked_ligands?.[0]?.binding_affinity || "N/A",
      verified: analysis.attestation?.verified || false,
    };
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

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Analysis Comparison
              </h1>
              <p className="text-gray-600">
                Side-by-side comparison of {analyses.length} analyses
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Sync Scroll:
              </span>
              <button
                onClick={() => setSyncScroll(!syncScroll)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  syncScroll ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    syncScroll ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Analysis Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {analyses.map((analysis, idx) => {
            const metadata = getAnalysisMetadata(analysis);
            return (
              <motion.div
                key={idx}
                className="glass rounded-xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {/* Color indicator */}
                <div
                  className={`absolute top-0 left-0 w-1 h-full ${
                    idx === 0
                      ? "bg-blue-500"
                      : idx === 1
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        idx === 0
                          ? "bg-blue-500"
                          : idx === 1
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <h3 className="font-semibold text-gray-900">
                      Analysis {idx + 1}
                    </h3>
                  </div>

                  {metadata.verified && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      <FiCheckCircle className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                </div>

                {/* Metadata Grid */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiCalendar className="w-4 h-4" />
                      <span>Date:</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {metadata.date}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiFolder className="w-4 h-4" />
                      <span>Project:</span>
                    </div>
                    <span
                      className="font-medium text-gray-900 truncate max-w-32"
                      title={metadata.project}
                    >
                      {metadata.project}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiLayers className="w-4 h-4" />
                      <span>Ligands:</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {metadata.ligandCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiTrendingDown className="w-4 h-4" />
                      <span>Best ΔG:</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {metadata.topAffinity}{" "}
                      {metadata.topAffinity !== "N/A" ? "kcal/mol" : ""}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {metadata.tags.length > 0 && (
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FiTag className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-600">
                        Tags
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {metadata.tags.slice(0, 3).map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                      {metadata.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{metadata.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
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

        {/* Comparison Chart - Lazy loaded */}
        {overlappingLigands.length > 0 && (
          <LazySection
            placeholder={
              <div className="glass rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Loading chart...</p>
                  </div>
                </div>
              </div>
            }
            threshold={0.1}
            rootMargin="100px"
          >
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
          </LazySection>
        )}

        {/* Detailed Comparison Table - Lazy loaded */}
        {overlappingLigands.length > 0 && (
          <LazySection
            placeholder={
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            }
            threshold={0.1}
            rootMargin="100px"
          >
            <motion.div
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Detailed Comparison
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiInfo className="w-4 h-4" />
                  <span>Color coding shows binding affinity differences</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Side-by-side comparison */}
                {analyses.length === 2 ? (
                  <div className="lg:col-span-2 grid grid-cols-2 gap-6">
                    {analyses.map((analysis, analysisIdx) => (
                      <div key={analysisIdx} className="space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              analysisIdx === 0 ? "bg-blue-500" : "bg-green-500"
                            }`}
                          />
                          <h3 className="font-semibold text-gray-900">
                            Analysis {analysisIdx + 1}
                          </h3>
                        </div>

                        <div
                          ref={(el) =>
                            (scrollContainerRefs.current[analysisIdx] = el)
                          }
                          className="max-h-96 overflow-y-auto space-y-2"
                          onScroll={(e) =>
                            handleSyncScroll(analysisIdx, e.target.scrollTop)
                          }
                        >
                          {comparisonData.map((row, rowIdx) => {
                            const currentValue = row.affinities[analysisIdx];
                            const otherValue = row.affinities[1 - analysisIdx];
                            const diff = getDifferenceIndicator(
                              otherValue,
                              currentValue
                            );

                            return (
                              <div
                                key={rowIdx}
                                className={`p-3 rounded-lg border transition-all ${
                                  diff?.type === "better"
                                    ? "bg-green-50 border-green-200"
                                    : diff?.type === "worse"
                                    ? "bg-red-50 border-red-200"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">
                                      {row.ligand}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {currentValue !== null
                                        ? `${currentValue} kcal/mol`
                                        : "N/A"}
                                    </div>
                                  </div>

                                  {diff && diff.type !== "same" && (
                                    <div
                                      className={`flex items-center gap-1 text-xs font-medium ${
                                        diff.type === "better"
                                          ? "text-green-700"
                                          : "text-red-700"
                                      }`}
                                    >
                                      <diff.icon className="w-3 h-3" />
                                      <span>
                                        {diff.type === "better"
                                          ? "Better"
                                          : "Worse"}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Traditional table for 3+ analyses */
                  <div className="lg:col-span-2 overflow-x-auto">
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
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    idx === 0
                                      ? "bg-blue-500"
                                      : idx === 1
                                      ? "bg-green-500"
                                      : "bg-yellow-500"
                                  }`}
                                />
                                Analysis {idx + 1}
                              </div>
                            </th>
                          ))}
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            Best vs Worst
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {comparisonData.map((row, idx) => {
                          const validAffinities = row.affinities.filter(
                            (a) => a !== null
                          );
                          const bestValue =
                            validAffinities.length > 0
                              ? Math.min(...validAffinities)
                              : null;
                          const worstValue =
                            validAffinities.length > 0
                              ? Math.max(...validAffinities)
                              : null;

                          return (
                            <tr key={idx} className="hover:bg-gray-50/50">
                              <td className="px-4 py-3 font-medium text-gray-900">
                                {row.ligand}
                              </td>
                              {row.affinities.map((affinity, aIdx) => (
                                <td key={aIdx} className="px-4 py-3">
                                  <div
                                    className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
                                      affinity === bestValue &&
                                      validAffinities.length > 1
                                        ? "bg-green-100 text-green-700 border border-green-200"
                                        : affinity === worstValue &&
                                          validAffinities.length > 1 &&
                                          bestValue !== worstValue
                                        ? "bg-red-100 text-red-700 border border-red-200"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {affinity !== null ? (
                                      <>
                                        <span>{affinity} kcal/mol</span>
                                        {affinity === bestValue &&
                                          validAffinities.length > 1 && (
                                            <FiCheckCircle className="w-3 h-3" />
                                          )}
                                        {affinity === worstValue &&
                                          validAffinities.length > 1 &&
                                          bestValue !== worstValue && (
                                            <FiAlertCircle className="w-3 h-3" />
                                          )}
                                      </>
                                    ) : (
                                      "N/A"
                                    )}
                                  </div>
                                </td>
                              ))}
                              <td className="px-4 py-3">
                                {bestValue !== null &&
                                  worstValue !== null &&
                                  bestValue !== worstValue && (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                      Δ {(worstValue - bestValue).toFixed(2)}{" "}
                                      kcal/mol
                                    </span>
                                  )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          </LazySection>
        )}
      </div>
    </div>
  );
}
