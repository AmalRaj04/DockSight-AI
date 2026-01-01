import { motion } from "framer-motion";
import {
  FiAward,
  FiTrendingDown,
  FiLayers,
  FiCheckCircle,
  FiExternalLink,
} from "react-icons/fi";

export default function ExecutiveSummary({ rankedLigands, attestation }) {
  if (!rankedLigands || rankedLigands.length === 0) {
    return null;
  }

  const topLigand = rankedLigands[0];
  const avgAffinity =
    rankedLigands.reduce((sum, l) => sum + parseFloat(l.binding_affinity), 0) /
    rankedLigands.length;

  const getBindingStrength = (affinity) => {
    const val = parseFloat(affinity);
    if (val <= -9.0) return { label: "Strong", color: "green" };
    if (val <= -7.0) return { label: "Moderate", color: "yellow" };
    return { label: "Weak", color: "red" };
  };

  const topStrength = getBindingStrength(topLigand.binding_affinity);

  const metrics = [
    {
      icon: FiAward,
      label: "Top Candidate",
      value: topLigand.ligand_name,
      subtitle: `ΔG: ${topLigand.binding_affinity} kcal/mol`,
      badge: `${topStrength.label} Binding`,
      badgeColor: topStrength.color,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: FiTrendingDown,
      label: "Average ΔG",
      value: avgAffinity.toFixed(2),
      subtitle: "kcal/mol",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: FiLayers,
      label: "Ligands Analyzed",
      value: rankedLigands.length,
      subtitle: "compounds",
      gradient: "from-green-500 to-green-600",
    },
  ];

  const badgeColors = {
    green: "bg-green-100 text-green-700 border-green-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    red: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="mb-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={index}
              className="glass rounded-xl p-6 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${metric.gradient}`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {metric.badge && (
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${
                      badgeColors[metric.badgeColor]
                    }`}
                  >
                    {metric.badge}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1 truncate">
                {metric.value}
              </div>
              <div className="text-sm text-gray-500">{metric.subtitle}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Recommendation Card */}
      <motion.div
        className="glass rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <FiCheckCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Recommendation</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              <span className="font-medium">{topLigand.ligand_name}</span> shows{" "}
              {topStrength.label.toLowerCase()} binding affinity (
              {topLigand.binding_affinity} kcal/mol) and is recommended for
              further experimental validation.
              {rankedLigands.length > 1 && (
                <span>
                  {" "}
                  Consider also evaluating{" "}
                  <span className="font-medium">
                    {rankedLigands[1].ligand_name}
                  </span>{" "}
                  ({rankedLigands[1].binding_affinity} kcal/mol) as an
                  alternative candidate.
                </span>
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Blockchain Attestation */}
      {attestation && attestation.success && (
        <motion.div
          className="mt-4 glass rounded-xl p-4 border border-green-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Verified on Solana Blockchain
                </span>
                <p className="text-xs text-gray-600 mt-0.5">
                  Immutable attestation recorded
                </p>
              </div>
            </div>
            {attestation.explorer_url && (
              <a
                href={attestation.explorer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View
                <FiExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
