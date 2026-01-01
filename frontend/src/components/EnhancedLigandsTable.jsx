import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiTrendingDown,
  FiEye,
  FiAward,
  FiChevronDown,
  FiChevronUp,
  FiGrid,
  FiList,
  FiTarget,
  FiActivity,
} from "react-icons/fi";

export default function EnhancedLigandsTable({ rankedLigands, onViewLigand }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"

  if (!rankedLigands || rankedLigands.length === 0) {
    return null;
  }

  const getAffinityColor = (affinity) => {
    const val = parseFloat(affinity);
    if (val < -8)
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        badge: "bg-green-100 text-green-800 border-green-300",
        strength: "Strong",
      };
    if (val >= -8 && val < -6)
      return {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        badge: "bg-orange-100 text-orange-800 border-orange-300",
        strength: "Moderate",
      };
    return {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      badge: "bg-red-100 text-red-800 border-red-300",
      strength: "Weak",
    };
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
          className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors[rank]} flex items-center justify-center shadow-sm`}
        >
          <FiAward className="w-4 h-4 text-white" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
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

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedLigands.map((ligand, idx) => {
        const rank = rankedLigands.indexOf(ligand) + 1;
        const affinity = parseFloat(ligand.binding_affinity);
        const colorInfo = getAffinityColor(affinity);

        return (
          <motion.div
            key={idx}
            className={`glass rounded-xl p-6 border-2 ${colorInfo.border} ${colorInfo.bg} hover:shadow-lg transition-all duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            {/* Header with rank and name */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getMedalIcon(rank)}
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {ligand.ligand_name}
                  </h3>
                  <p className="text-sm text-gray-500">Rank #{rank}</p>
                </div>
              </div>
              {rank <= 3 && (
                <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Top 3
                </div>
              )}
            </div>

            {/* Binding affinity - prominent display */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FiTarget className={`w-4 h-4 ${colorInfo.text}`} />
                <span className="text-sm font-medium text-gray-600">
                  Binding Affinity
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${colorInfo.text}`}>
                  {ligand.binding_affinity}
                </span>
                <span className="text-sm text-gray-500">kcal/mol</span>
              </div>
            </div>

            {/* Strength badge */}
            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${colorInfo.badge}`}
              >
                {colorInfo.strength} Binding
              </span>
            </div>

            {/* Pose ID */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <FiActivity className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  Pose ID
                </span>
              </div>
              <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                {ligand.pose_id}
              </span>
            </div>

            {/* Action button */}
            {onViewLigand && (
              <motion.button
                onClick={() => onViewLigand(ligand)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiEye className="w-4 h-4" />
                View 3D Structure
              </motion.button>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  const renderTableView = () => (
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
            const colorInfo = getAffinityColor(affinity);

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
                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${colorInfo.badge}`}
                  >
                    {ligand.binding_affinity} kcal/mol
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600 font-medium">
                    {colorInfo.strength}
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
  );

  return (
    <motion.div
      className="glass rounded-xl p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Header with view toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiTrendingDown className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Ranked Ligands
            </h2>
            <p className="text-sm text-gray-600">
              {rankedLigands.length} compounds analyzed and ranked by binding
              affinity
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "cards"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FiGrid className="w-4 h-4" />
            Cards
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "table"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FiList className="w-4 h-4" />
            Table
          </button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "cards" ? renderCardView() : renderTableView()}
    </motion.div>
  );
}
