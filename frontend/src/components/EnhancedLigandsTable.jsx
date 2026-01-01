import React from "react";

export default function EnhancedLigandsTable({ rankedLigands, onViewLigand }) {
  if (!rankedLigands || rankedLigands.length === 0) {
    return null;
  }

  const getAffinityColor = (affinity) => {
    const val = parseFloat(affinity);
    if (val <= -9.0) return "text-green-600 bg-green-50";
    if (val <= -7.0) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        🎯 Ranked Ligands
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ligand Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Binding Affinity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Strength
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pose ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rankedLigands.map((ligand, idx) => {
              const rank = idx + 1;
              const affinity = parseFloat(ligand.binding_affinity);
              const colorClass = getAffinityColor(affinity);
              const strength =
                affinity <= -9.0
                  ? "Strong"
                  : affinity <= -7.0
                  ? "Moderate"
                  : "Weak";

              return (
                <tr
                  key={idx}
                  className={rank <= 3 ? "bg-blue-50" : "hover:bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-lg">{getMedalEmoji(rank)}</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ligand.ligand_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold ${colorClass}`}
                    >
                      {ligand.binding_affinity} kcal/mol
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {strength}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ligand.pose_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => onViewLigand && onViewLigand(ligand)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View 3D →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
