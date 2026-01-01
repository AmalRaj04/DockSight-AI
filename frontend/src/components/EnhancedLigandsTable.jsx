import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiTrendingDown,
  FiEye,
  FiAward,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

export default function EnhancedLigandsTable({ rankedLigands, onViewLigand }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  if (!rankedLigands || rankedLigands.length === 0) {
    return null;
  }

  const getAffinityColor = (affinity) => {
    const val = parseFloat(affinity);
    if (val <= -9.0) return "text-green-700 bg-green-50 border-green-200";
    if (val <= -7.0) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  const getMedalIcon = (rank) => {
    const colors = {
      1: "from-yellow-400 to-yellow-600",
      2: "from-gray-300 to-gray-500",
      3: "from-orange-400 to-orange-600",
    };

    if (rank <= 3) {
      return (
        <div
          className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors[rank]} flex items-center justify-center`}
        >
          <FiAward className="w-4 h-4 text-white" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-600">{rank}</span>
      </div>
    );
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedLigands = [...rankedLigands].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === "binding_affinity") {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <motion.div
      className="glass rounded-xl p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FiTrendingDown className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Ranked Ligands</h2>
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium">
          {rankedLigands.length} compounds
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rank
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors"
                onClick={() => handleSort("ligand_name")}
              >
                <div className="flex items-center gap-1">
                  Ligand Name
                  {sortConfig.key === "ligand_name" &&
                    (sortConfig.direction === "asc" ? (
                      <FiChevronUp className="w-4 h-4" />
                    ) : (
                      <FiChevronDown className="w-4 h-4" />
                    ))}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors"
                onClick={() => handleSort("binding_affinity")}
              >
                <div className="flex items-center gap-1">
                  Binding Affinity
                  {sortConfig.key === "binding_affinity" &&
                    (sortConfig.direction === "asc" ? (
                      <FiChevronUp className="w-4 h-4" />
                    ) : (
                      <FiChevronDown className="w-4 h-4" />
                    ))}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Strength
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Pose ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedLigands.map((ligand, idx) => {
              const rank = rankedLigands.indexOf(ligand) + 1;
              const affinity = parseFloat(ligand.binding_affinity);
              const colorClass = getAffinityColor(affinity);
              const strength =
                affinity <= -9.0
                  ? "Strong"
                  : affinity <= -7.0
                  ? "Moderate"
                  : "Weak";

              return (
                <motion.tr
                  key={idx}
                  className={`${
                    rank <= 3 ? "bg-blue-50/50" : ""
                  } hover:bg-gray-50/50 transition-colors`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getMedalIcon(rank)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {ligand.ligand_name}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold border ${colorClass}`}
                    >
                      {ligand.binding_affinity} kcal/mol
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 font-medium">
                      {strength}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500 font-mono">
                      {ligand.pose_id}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {onViewLigand && (
                      <button
                        onClick={() => onViewLigand(ligand)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                      >
                        <FiEye className="w-4 h-4" />
                        View 3D
                      </button>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
