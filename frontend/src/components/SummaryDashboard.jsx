import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiTarget,
  FiLayers,
  FiDownload,
  FiShare2,
  FiBarChart2,
  FiAward,
} from "react-icons/fi";
import MetricCard from "./MetricCard";

export default function SummaryDashboard({ rankedLigands, attestation }) {
  if (!rankedLigands || rankedLigands.length === 0) {
    return null;
  }

  // Calculate metrics
  const totalLigands = rankedLigands.length;
  const topCandidate = rankedLigands[0];
  const averageAffinity =
    rankedLigands.reduce(
      (sum, ligand) => sum + parseFloat(ligand.binding_affinity),
      0
    ) / totalLigands;

  // Count binding strength categories
  const strongBinding = rankedLigands.filter(
    (l) => parseFloat(l.binding_affinity) < -8
  ).length;
  const moderateBinding = rankedLigands.filter((l) => {
    const affinity = parseFloat(l.binding_affinity);
    return affinity >= -8 && affinity < -6;
  }).length;
  const weakBinding = rankedLigands.filter(
    (l) => parseFloat(l.binding_affinity) >= -6
  ).length;

  // Determine color for top candidate based on binding strength
  const getAffinityColor = (affinity) => {
    const value = parseFloat(affinity);
    if (value < -8) return "green";
    if (value < -6) return "orange";
    return "red";
  };

  const handleExport = () => {
    // Create CSV data
    const headers = [
      "Rank",
      "Ligand Name",
      "Binding Affinity (kcal/mol)",
      "Binding Strength",
    ];
    const rows = rankedLigands.map((ligand, index) => {
      const affinity = parseFloat(ligand.binding_affinity);
      const strength =
        affinity < -8 ? "Strong" : affinity < -6 ? "Moderate" : "Weak";
      return [index + 1, ligand.ligand_name, affinity, strength];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "docking_analysis_results.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareData = {
      title: "DockSight AI Analysis Results",
      text: `Analysis complete: ${totalLigands} ligands analyzed. Top candidate: ${topCandidate.ligand_name} (ΔG: ${topCandidate.binding_affinity} kcal/mol)`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(
          `${shareData.text}\n${shareData.url}`
        );
        // You could show a toast notification here
        alert("Results copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
      }
    }
  };

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Analysis Summary
          </h2>
          <p className="text-gray-600">
            Key metrics and insights from your molecular docking analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiDownload className="w-4 h-4" />
            Export CSV
          </motion.button>
          <motion.button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:shadow-md transition-all font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiShare2 className="w-4 h-4" />
            Share
          </motion.button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Top Candidate"
          value={topCandidate.ligand_name}
          icon={FiAward}
          color={getAffinityColor(topCandidate.binding_affinity)}
          animated={false}
          delay={0.1}
        />
        <MetricCard
          title="Best Affinity"
          value={parseFloat(topCandidate.binding_affinity)}
          unit="kcal/mol"
          icon={FiTarget}
          color={getAffinityColor(topCandidate.binding_affinity)}
          delay={0.2}
        />
        <MetricCard
          title="Average ΔG"
          value={averageAffinity}
          unit="kcal/mol"
          icon={FiTrendingUp}
          color="blue"
          delay={0.3}
        />
        <MetricCard
          title="Ligands Analyzed"
          value={totalLigands}
          icon={FiLayers}
          color="purple"
          delay={0.4}
        />
      </div>

      {/* Binding Affinity Distribution */}
      <motion.div
        className="glass rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiBarChart2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Binding Affinity Distribution
            </h3>
            <p className="text-sm text-gray-600">
              Classification of ligands by binding strength
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700 mb-1">
              {strongBinding}
            </div>
            <div className="text-sm font-medium text-green-600 mb-1">
              Strong Binding
            </div>
            <div className="text-xs text-green-500">ΔG &lt; -8 kcal/mol</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-700 mb-1">
              {moderateBinding}
            </div>
            <div className="text-sm font-medium text-orange-700 mb-1">
              Moderate Binding
            </div>
            <div className="text-xs text-orange-700">-8 to -6 kcal/mol</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-700 mb-1">
              {weakBinding}
            </div>
            <div className="text-sm font-medium text-red-600 mb-1">
              Weak Binding
            </div>
            <div className="text-xs text-red-500">ΔG ≥ -6 kcal/mol</div>
          </div>
        </div>

        {/* Blockchain Attestation Badge */}
        {attestation && attestation.transaction_signature && (
          <motion.div
            className="mt-4 pt-4 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">
                Results verified on Solana blockchain
              </span>
              <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                {attestation.network || "devnet"}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
