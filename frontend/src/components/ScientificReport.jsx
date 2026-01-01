import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiCopy,
  FiCheck,
  FiDownload,
  FiPrinter,
  FiFileText,
  FiBarChart,
  FiKey,
  FiBook,
  FiMessageSquare,
  FiBookmark,
} from "react-icons/fi";

export default function ScientificReport({ report, rankedLigands }) {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const exportToCSV = () => {
    const csv = generateCSV(rankedLigands);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `docking_analysis_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    toast.success("CSV exported");
  };

  const exportToExcel = () => {
    const tsv = generateTSV(rankedLigands);
    const blob = new Blob([tsv], { type: "text/tab-separated-values" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `docking_analysis_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    a.click();
    toast.success("Excel file exported");
  };

  const CopyButton = ({ onClick, copied, section }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
    >
      {copied === section ? (
        <>
          <FiCheck className="w-4 h-4" />
          Copied
        </>
      ) : (
        <>
          <FiCopy className="w-4 h-4" />
          Copy
        </>
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <motion.div
        className="flex gap-3 flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => copyToClipboard(report, "full")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
        >
          <FiCopy className="w-4 h-4" />
          {copiedSection === "full" ? "Copied!" : "Copy Full Report"}
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors"
        >
          <FiPrinter className="w-4 h-4" />
          Print/PDF
        </button>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
        >
          <FiDownload className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors"
        >
          <FiBarChart className="w-4 h-4" />
          Export Excel
        </button>
      </motion.div>

      {/* Results Summary Table */}
      <motion.div
        className="glass rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiFileText className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Results Summary</h3>
          </div>
          <CopyButton
            onClick={() =>
              copyToClipboard(generateResultsTable(rankedLigands), "results")
            }
            copied={copiedSection}
            section="results"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
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
            <tbody className="divide-y divide-gray-100">
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
                  <tr
                    key={idx}
                    className={
                      idx < 3 ? "bg-blue-50/50" : "hover:bg-gray-50/50"
                    }
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-gray-900">
                      {ligand.ligand_name}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {ligand.binding_affinity}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          strength === "Strong"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : strength === "Moderate"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
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
      </motion.div>

      {/* Key Findings */}
      <motion.div
        className="glass rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiKey className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Key Findings</h3>
          </div>
          <CopyButton
            onClick={() =>
              copyToClipboard(generateKeyFindings(rankedLigands), "findings")
            }
            copied={copiedSection}
            section="findings"
          />
        </div>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>
              <strong className="text-gray-900">
                {rankedLigands[0]?.ligand_name}
              </strong>{" "}
              exhibited the strongest binding affinity (
              {rankedLigands[0]?.binding_affinity} kcal/mol), indicating
              favorable protein-ligand interactions.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>
              A total of{" "}
              <strong className="text-gray-900">
                {rankedLigands.length} compounds
              </strong>{" "}
              were evaluated using AutoDock Vina.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>
              Binding affinities ranged from{" "}
              <strong className="text-gray-900">
                {rankedLigands[0]?.binding_affinity}
              </strong>{" "}
              to{" "}
              <strong className="text-gray-900">
                {rankedLigands[rankedLigands.length - 1]?.binding_affinity}
              </strong>{" "}
              kcal/mol.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>
              Top candidates warrant further experimental validation through
              biochemical assays.
            </span>
          </li>
        </ul>
      </motion.div>

      {/* Methods Section */}
      <motion.div
        className="glass rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiBook className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Methods</h3>
          </div>
          <CopyButton
            onClick={() => copyToClipboard(generateMethodsText(), "methods")}
            copied={copiedSection}
            section="methods"
          />
        </div>
        <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
          <p>
            <strong className="text-gray-900">Molecular Docking:</strong>{" "}
            Docking simulations were performed using AutoDock Vina. Ligand
            structures were prepared in PDBQT format, and binding affinities
            (ΔG) were calculated for each ligand-protein complex.
          </p>
          <p>
            <strong className="text-gray-900">Ranking Criteria:</strong>{" "}
            Compounds were ranked by predicted binding affinity in ascending
            order, where more negative values indicate stronger binding.
          </p>
          <p>
            <strong className="text-gray-900">Analysis:</strong> The
            best-scoring pose for each ligand was selected for further analysis.
          </p>
        </div>
      </motion.div>

      {/* Discussion Points */}
      <motion.div
        className="glass rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FiMessageSquare className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Discussion Points
            </h3>
          </div>
          <CopyButton
            onClick={() =>
              copyToClipboard(generateDiscussion(rankedLigands), "discussion")
            }
            copied={copiedSection}
            section="discussion"
          />
        </div>
        <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
          <p>
            The computational screening identified{" "}
            <strong className="text-gray-900">
              {rankedLigands[0]?.ligand_name}
            </strong>{" "}
            as the most promising candidate with a binding affinity of{" "}
            {rankedLigands[0]?.binding_affinity} kcal/mol. This suggests
            favorable interactions with the target protein binding site.
          </p>
          {rankedLigands.length > 1 && (
            <p>
              Additionally,{" "}
              <strong className="text-gray-900">
                {rankedLigands[1]?.ligand_name}
              </strong>{" "}
              showed competitive binding ({rankedLigands[1]?.binding_affinity}{" "}
              kcal/mol) and may serve as an alternative scaffold for
              optimization.
            </p>
          )}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs italic text-gray-600">
              <strong>Note:</strong> These computational predictions require
              experimental validation. Binding affinities are theoretical
              estimates and may not directly correlate with biological activity.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Citation Format */}
      <motion.div
        className="glass rounded-xl p-6 bg-gray-50/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-200 rounded-lg">
              <FiBookmark className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Citation Format</h3>
          </div>
          <CopyButton
            onClick={() => copyToClipboard(generateCitation(), "citation")}
            copied={copiedSection}
            section="citation"
          />
        </div>
        <p className="text-sm text-gray-700 font-mono bg-white p-4 rounded-lg border border-gray-200">
          Molecular docking analysis performed using DockSight AI (v0.1.0) with
          AutoDock Vina. Analysis verified on Solana blockchain for
          reproducibility.
        </p>
      </motion.div>
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

function generateCSV(ligands) {
  let csv =
    "Rank,Compound,Binding Affinity (kcal/mol),Binding Strength,Recommendation\n";
  ligands.forEach((l, i) => {
    const affinity = parseFloat(l.binding_affinity);
    const strength =
      affinity <= -9.0 ? "Strong" : affinity <= -7.0 ? "Moderate" : "Weak";
    const recommendation =
      i === 0 ? "Primary candidate" : i === 1 ? "Alternative" : "Further study";
    csv += `${i + 1},"${l.ligand_name}",${
      l.binding_affinity
    },${strength},${recommendation}\n`;
  });
  return csv;
}

function generateTSV(ligands) {
  let tsv =
    "Rank\tCompound\tBinding Affinity (kcal/mol)\tBinding Strength\tRecommendation\n";
  ligands.forEach((l, i) => {
    const affinity = parseFloat(l.binding_affinity);
    const strength =
      affinity <= -9.0 ? "Strong" : affinity <= -7.0 ? "Moderate" : "Weak";
    const recommendation =
      i === 0 ? "Primary candidate" : i === 1 ? "Alternative" : "Further study";
    tsv += `${i + 1}\t${l.ligand_name}\t${
      l.binding_affinity
    }\t${strength}\t${recommendation}\n`;
  });
  return tsv;
}
