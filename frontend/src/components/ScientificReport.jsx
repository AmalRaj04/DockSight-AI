import { useState } from "react";

export default function ScientificReport({ report, rankedLigands }) {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => copyToClipboard(report, "full")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
        >
          {copiedSection === "full" ? "✓ Copied!" : "📋 Copy Full Report"}
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm font-medium"
        >
          🖨️ Print/PDF
        </button>
      </div>

      {/* Results Summary Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            📊 Results Summary
          </h3>
          <button
            onClick={() =>
              copyToClipboard(generateResultsTable(rankedLigands), "results")
            }
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {copiedSection === "results" ? "✓ Copied" : "📋 Copy Table"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Rank
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Compound
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  ΔG (kcal/mol)
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Binding Strength
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Recommendation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankedLigands.map((ligand, idx) => {
                const affinity = parseFloat(ligand.binding_affinity);
                const strength =
                  affinity <= -9.0
                    ? "Strong"
                    : affinity <= -7.0
                    ? "Moderate"
                    : "Weak";
                const recommendation =
                  idx === 0
                    ? "Primary candidate"
                    : idx === 1
                    ? "Alternative"
                    : "Further study";

                return (
                  <tr key={idx} className={idx < 3 ? "bg-blue-50" : ""}>
                    <td className="px-4 py-3 font-medium">{idx + 1}</td>
                    <td className="px-4 py-3 font-mono text-sm">
                      {ligand.ligand_name}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {ligand.binding_affinity}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          strength === "Strong"
                            ? "bg-green-100 text-green-800"
                            : strength === "Moderate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {strength}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {recommendation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Findings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">🔑 Key Findings</h3>
          <button
            onClick={() =>
              copyToClipboard(generateKeyFindings(rankedLigands), "findings")
            }
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {copiedSection === "findings" ? "✓ Copied" : "📋 Copy"}
          </button>
        </div>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong>{rankedLigands[0]?.ligand_name}</strong> exhibited the
              strongest binding affinity ({rankedLigands[0]?.binding_affinity}{" "}
              kcal/mol), indicating favorable protein-ligand interactions.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              A total of <strong>{rankedLigands.length} compounds</strong> were
              evaluated using AutoDock Vina.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Binding affinities ranged from{" "}
              <strong>{rankedLigands[0]?.binding_affinity}</strong> to{" "}
              <strong>
                {rankedLigands[rankedLigands.length - 1]?.binding_affinity}
              </strong>{" "}
              kcal/mol.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Top candidates warrant further experimental validation through
              biochemical assays.
            </span>
          </li>
        </ul>
      </div>

      {/* Methods Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">🔬 Methods</h3>
          <button
            onClick={() => copyToClipboard(generateMethodsText(), "methods")}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {copiedSection === "methods" ? "✓ Copied" : "📋 Copy"}
          </button>
        </div>
        <div className="prose prose-sm max-w-none text-gray-700">
          <p className="mb-3">
            <strong>Molecular Docking:</strong> Docking simulations were
            performed using AutoDock Vina. Ligand structures were prepared in
            PDBQT format, and binding affinities (ΔG) were calculated for each
            ligand-protein complex.
          </p>
          <p className="mb-3">
            <strong>Ranking Criteria:</strong> Compounds were ranked by
            predicted binding affinity in ascending order, where more negative
            values indicate stronger binding.
          </p>
          <p>
            <strong>Analysis:</strong> The best-scoring pose for each ligand was
            selected for further analysis.
          </p>
        </div>
      </div>

      {/* Discussion Points */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            💬 Discussion Points
          </h3>
          <button
            onClick={() =>
              copyToClipboard(generateDiscussion(rankedLigands), "discussion")
            }
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {copiedSection === "discussion" ? "✓ Copied" : "📋 Copy"}
          </button>
        </div>
        <div className="space-y-3 text-gray-700">
          <p>
            The computational screening identified{" "}
            <strong>{rankedLigands[0]?.ligand_name}</strong> as the most
            promising candidate with a binding affinity of{" "}
            {rankedLigands[0]?.binding_affinity} kcal/mol. This suggests
            favorable interactions with the target protein binding site.
          </p>
          <p>
            {rankedLigands.length > 1 && (
              <>
                Additionally, <strong>{rankedLigands[1]?.ligand_name}</strong>{" "}
                showed competitive binding ({rankedLigands[1]?.binding_affinity}{" "}
                kcal/mol) and may serve as an alternative scaffold for
                optimization.
              </>
            )}
          </p>
          <p className="text-sm italic text-gray-600 mt-4 pt-4 border-t">
            <strong>Note:</strong> These computational predictions require
            experimental validation. Binding affinities are theoretical
            estimates and may not directly correlate with biological activity.
          </p>
        </div>
      </div>

      {/* Citation Format */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            📚 Citation Format
          </h3>
          <button
            onClick={() => copyToClipboard(generateCitation(), "citation")}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {copiedSection === "citation" ? "✓ Copied" : "📋 Copy"}
          </button>
        </div>
        <p className="text-sm text-gray-700 font-mono bg-white p-3 rounded border">
          Molecular docking analysis performed using DockSight AI (v0.1.0) with
          AutoDock Vina. Analysis verified on Solana blockchain for
          reproducibility.
        </p>
      </div>
    </div>
  );
}

// Helper functions
function generateResultsTable(ligands) {
  let table = "Rank\tCompound\tΔG (kcal/mol)\tBinding Strength\n";
  ligands.forEach((l, i) => {
    const affinity = parseFloat(l.binding_affinity);
    const strength =
      affinity <= -9.0 ? "Strong" : affinity <= -7.0 ? "Moderate" : "Weak";
    table += `${i + 1}\t${l.ligand_name}\t${l.binding_affinity}\t${strength}\n`;
  });
  return table;
}

function generateKeyFindings(ligands) {
  return `Key Findings:
• ${ligands[0]?.ligand_name} exhibited the strongest binding affinity (${
    ligands[0]?.binding_affinity
  } kcal/mol)
• Total of ${ligands.length} compounds evaluated
• Binding affinities ranged from ${ligands[0]?.binding_affinity} to ${
    ligands[ligands.length - 1]?.binding_affinity
  } kcal/mol
• Top candidates warrant experimental validation`;
}

function generateMethodsText() {
  return `Methods:
Molecular docking simulations were performed using AutoDock Vina. Ligand structures were prepared in PDBQT format, and binding affinities (ΔG) were calculated for each ligand-protein complex. Compounds were ranked by predicted binding affinity in ascending order, where more negative values indicate stronger binding.`;
}

function generateDiscussion(ligands) {
  return `Discussion:
The computational screening identified ${
    ligands[0]?.ligand_name
  } as the most promising candidate with a binding affinity of ${
    ligands[0]?.binding_affinity
  } kcal/mol, suggesting favorable interactions with the target protein binding site. ${
    ligands.length > 1
      ? `Additionally, ${ligands[1]?.ligand_name} showed competitive binding (${ligands[1]?.binding_affinity} kcal/mol) and may serve as an alternative scaffold.`
      : ""
  } These computational predictions require experimental validation.`;
}

function generateCitation() {
  return "Molecular docking analysis performed using DockSight AI (v0.1.0) with AutoDock Vina. Analysis verified on Solana blockchain for reproducibility.";
}
