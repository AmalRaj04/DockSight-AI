import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

    return {
      labels: comparisonData.map((d) => d.ligand),
      datasets: analyses.map((analysis, idx) => ({
        label: `Analysis ${idx + 1} (${formatDate(analysis.timestamp)})`,
        data: comparisonData.map((d) => d.affinities[idx]),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ][idx],
      })),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comparison...</p>
        </div>
      </div>
    );
  }

  const overlappingLigands = getOverlappingLigands();
  const comparisonData = getComparisonData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/history")}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center font-medium"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to History
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 Analysis Comparison
          </h1>
          <p className="text-gray-600">
            Comparing {analyses.length} analyses side-by-side
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {analyses.map((analysis, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-2">
                Analysis {idx + 1}
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">
                {formatDate(analysis.timestamp)}
              </div>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-gray-600">Ligands:</span>
                  <span className="ml-2 font-semibold">
                    {analysis.ranked_ligands.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Top:</span>
                  <span className="ml-2 font-semibold">
                    {analysis.ranked_ligands[0]?.ligand_name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Best ΔG:</span>
                  <span className="ml-2 font-semibold text-green-600">
                    {analysis.ranked_ligands[0]?.binding_affinity} kcal/mol
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overlapping Ligands */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🔗 Overlapping Ligands
          </h2>
          {overlappingLigands.length > 0 ? (
            <div>
              <p className="text-gray-600 mb-4">
                {overlappingLigands.length} ligands appear in all analyses
              </p>
              <div className="flex flex-wrap gap-2">
                {overlappingLigands.map((ligand) => (
                  <span
                    key={ligand}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {ligand}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No overlapping ligands found</p>
          )}
        </div>

        {/* Comparison Chart */}
        {overlappingLigands.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📈 Binding Affinity Comparison
            </h2>
            <Bar
              data={getChartData()}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: {
                    display: true,
                    text: "Binding Affinities Across Analyses",
                  },
                },
                scales: {
                  y: {
                    title: { display: true, text: "ΔG (kcal/mol)" },
                    reverse: true,
                  },
                },
              }}
            />
          </div>
        )}

        {/* Detailed Comparison Table */}
        {overlappingLigands.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📋 Detailed Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
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
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-medium">{row.ligand}</td>
                      {row.affinities.map((affinity, aIdx) => (
                        <td key={aIdx} className="px-4 py-3">
                          {affinity !== null ? `${affinity} kcal/mol` : "N/A"}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        {row.improvement !== 0 && (
                          <span
                            className={
                              row.improvement < 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {row.improvement > 0 ? "+" : ""}
                            {row.improvement.toFixed(2)} kcal/mol
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Ligands */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analyses.map((analysis, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Analysis {idx + 1} - All Ligands
              </h3>
              <div className="space-y-2">
                {analysis.ranked_ligands.slice(0, 10).map((ligand, lIdx) => (
                  <div key={lIdx} className="flex justify-between text-sm">
                    <span className="text-gray-700">{ligand.ligand_name}</span>
                    <span className="font-semibold">
                      {ligand.binding_affinity}
                    </span>
                  </div>
                ))}
                {analysis.ranked_ligands.length > 10 && (
                  <div className="text-sm text-gray-500 italic">
                    +{analysis.ranked_ligands.length - 10} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
