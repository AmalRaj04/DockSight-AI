import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExecutiveSummary from "../components/ExecutiveSummary";
import BindingAffinityChart from "../components/BindingAffinityChart";
import EnhancedLigandsTable from "../components/EnhancedLigandsTable";
import CollapsibleSection from "../components/CollapsibleSection";
import MolecularViewer3D from "../components/MolecularViewer3D";
import ScientificReport from "../components/ScientificReport";

export default function Analyze() {
  const [result, setResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedLigand, setSelectedLigand] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResult = sessionStorage.getItem("analysisResult");
    if (!storedResult) {
      navigate("/");
      return;
    }
    setResult(JSON.parse(storedResult));
  }, [navigate]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const status = result.status || "completed";
  const rankedLigands = result.ranked_ligands || [];
  const interactions = result.interactions || {};
  const visualizations = result.visualizations || [];
  const report = result.report || result.final_report_md || "";
  const attestation = result.attestation;
  const pdbqtFiles = result.pdbqt_files || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 hover:text-blue-800 flex items-center font-medium"
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
              Back to Upload
            </button>
            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              View History
            </button>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔬 Analysis Results
          </h1>
          <p className="text-gray-600">
            Comprehensive molecular docking analysis powered by AI
          </p>
        </div>

        {/* Executive Summary */}
        <ExecutiveSummary
          rankedLigands={rankedLigands}
          attestation={attestation}
        />

        {/* Binding Affinity Chart */}
        {rankedLigands.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <BindingAffinityChart rankedLigands={rankedLigands} />
          </div>
        )}

        {/* Enhanced Ranked Ligands Table */}
        <EnhancedLigandsTable
          rankedLigands={rankedLigands}
          onViewLigand={setSelectedLigand}
        />

        {/* 3D Molecular Viewer (if ligand selected) */}
        {selectedLigand && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                🧬 3D Molecular Structure
              </h2>
              <button
                onClick={() => setSelectedLigand(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕ Close
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-4">
                Interactive 3D view of{" "}
                <span className="font-semibold">
                  {selectedLigand.ligand_name}
                </span>{" "}
                (ΔG: {selectedLigand.binding_affinity} kcal/mol)
              </p>
              {pdbqtFiles[selectedLigand.ligand_name] ? (
                <MolecularViewer3D
                  pdbqtData={pdbqtFiles[selectedLigand.ligand_name]}
                  ligandName={selectedLigand.ligand_name}
                  height="500px"
                />
              ) : (
                <div className="bg-white rounded-lg p-2">
                  <p className="text-center text-gray-500 py-20">
                    PDBQT data not available for this ligand
                    <br />
                    <span className="text-sm">
                      (Only .pdbqt files can be visualized)
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interaction Summary */}
        {Object.keys(interactions).length > 0 && (
          <CollapsibleSection
            title="Molecular Interactions"
            icon="🔗"
            defaultOpen={false}
          >
            <div className="space-y-4">
              {Object.entries(interactions).map(([ligandName, data]) => (
                <div
                  key={ligandName}
                  className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg"
                >
                  <h3 className="font-medium text-gray-900 mb-2">
                    {ligandName}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    {data.hydrogen_bonds !== undefined && (
                      <p>💧 Hydrogen bonds: {data.hydrogen_bonds}</p>
                    )}
                    {data.hydrophobic_contacts !== undefined && (
                      <p>
                        🔵 Hydrophobic contacts: {data.hydrophobic_contacts}
                      </p>
                    )}
                    {data.salt_bridges !== undefined && (
                      <p>⚡ Salt bridges: {data.salt_bridges}</p>
                    )}
                    {data.key_residues && data.key_residues.length > 0 && (
                      <p>🎯 Key residues: {data.key_residues.join(", ")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Visualization Gallery */}
        {visualizations.length > 0 && (
          <CollapsibleSection
            title="Visualizations"
            icon="📊"
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visualizations.map((viz, idx) => {
                const imagePath = viz.output_path || viz;
                const imageUrl = imagePath.startsWith("http")
                  ? imagePath
                  : `http://localhost:8000/${imagePath}`;

                return (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-2 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all"
                    onClick={() => setSelectedImage(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={viz.ligand_name || `Visualization ${idx + 1}`}
                      className="w-full h-48 object-contain rounded bg-white"
                      onError={(e) => {
                        e.target.src =
                          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text x="50%" y="50%" text-anchor="middle" fill="gray">Image not available</text></svg>';
                      }}
                    />
                    {viz.ligand_name && (
                      <p className="text-sm text-gray-600 mt-2 text-center font-medium">
                        {viz.ligand_name}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>
        )}

        {/* Scientific Report */}
        {report && (
          <CollapsibleSection
            title="Scientific Report"
            icon="📄"
            defaultOpen={true}
          >
            <ScientificReport report={report} rankedLigands={rankedLigands} />
          </CollapsibleSection>
        )}

        {/* Analysis Metadata */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ℹ️ Analysis Metadata
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className="ml-2 capitalize text-gray-600">{status}</span>
            </div>
            {attestation && attestation.transaction_signature && (
              <>
                <div>
                  <span className="font-medium text-gray-700">Network:</span>
                  <span className="ml-2 text-gray-600">
                    {attestation.network || "devnet"}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">
                    Attestation TX:
                  </span>
                  <div className="mt-1 flex items-center">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 break-all">
                      {attestation.transaction_signature}
                    </code>
                    {attestation.explorer_url && (
                      <a
                        href={attestation.explorer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-800 text-xs whitespace-nowrap"
                      >
                        View on Explorer →
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Enlarged visualization"
              className="max-w-full max-h-screen object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
