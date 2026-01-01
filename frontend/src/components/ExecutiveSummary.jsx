import React from "react";

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
    if (val <= -9.0) return { label: "Strong", color: "green", emoji: "🟢" };
    if (val <= -7.0) return { label: "Moderate", color: "yellow", emoji: "🟡" };
    return { label: "Weak", color: "red", emoji: "🔴" };
  };

  const topStrength = getBindingStrength(topLigand.binding_affinity);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        📊 Executive Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Best Ligand */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Top Candidate
            </span>
            <span className="text-2xl">🥇</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {topLigand.ligand_name}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ΔG: {topLigand.binding_affinity} kcal/mol
          </p>
          <div className="mt-2 flex items-center">
            <span className="mr-2">{topStrength.emoji}</span>
            <span
              className={`text-sm font-medium text-${topStrength.color}-600`}
            >
              {topStrength.label} Binding
            </span>
          </div>
        </div>

        {/* Average Affinity */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Average ΔG
            </span>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {avgAffinity.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-1">kcal/mol</p>
        </div>

        {/* Total Analyzed */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Ligands Analyzed
            </span>
            <span className="text-2xl">🧪</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {rankedLigands.length}
          </p>
          <p className="text-sm text-gray-600 mt-1">compounds</p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="font-semibold text-gray-900 mb-2">💡 Recommendation</h3>
        <p className="text-gray-700">
          <span className="font-medium">{topLigand.ligand_name}</span> shows{" "}
          {topStrength.label.toLowerCase()} binding affinity (
          {topLigand.binding_affinity} kcal/mol) and is recommended for further
          experimental validation.
          {rankedLigands.length > 1 && (
            <span>
              {" "}
              Consider also evaluating{" "}
              <span className="font-medium">
                {rankedLigands[1].ligand_name}
              </span>{" "}
              ({rankedLigands[1].binding_affinity} kcal/mol) as an alternative
              candidate.
            </span>
          )}
        </p>
      </div>

      {/* Blockchain Attestation */}
      {attestation && attestation.success && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✓</span>
            <span className="text-sm font-medium text-green-800">
              Verified on Solana Blockchain
            </span>
          </div>
          {attestation.explorer_url && (
            <a
              href={attestation.explorer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-600 hover:text-green-800 underline mt-1 block"
            >
              View attestation →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
