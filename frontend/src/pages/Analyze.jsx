import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiClock,
  FiX,
  FiMaximize2,
  FiFileText,
  FiImage,
  FiActivity,
  FiInfo,
} from "react-icons/fi";
import ExecutiveSummary from "../components/ExecutiveSummary";
import SummaryDashboard from "../components/SummaryDashboard";
import EnhancedLigandsTable from "../components/EnhancedLigandsTable";
import CollapsibleSection from "../components/CollapsibleSection";
import LoadingSpinner from "../components/LoadingSpinner";
import { LazySection } from "../utils/lazyLoading.jsx";

// Lazy load heavy components
import LazyBindingAffinityChart from "../components/lazy/LazyBindingAffinityChart";
import LazyMolecularViewer3D from "../components/lazy/LazyMolecularViewer3D";
import LazyScientificReport from "../components/lazy/LazyScientificReport";

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
      <div className="min-h-screen molecular-grid flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading analysis..." />
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
    <div className="min-h-screen molecular-grid">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back to Upload
            </button>
            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:shadow-md font-medium transition-all"
            >
              <FiClock className="w-5 h-5" />
              View History
            </button>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Analysis Results
          </h1>
          <p className="text-gray-600">
            Comprehensive molecular docking analysis powered by AI
          </p>
        </motion.div>

        {/* Executive Summary */}
        <ExecutiveSummary
          rankedLigands={rankedLigands}
          attestation={attestation}
        />

        {/* Summary Dashboard */}
        <SummaryDashboard
          rankedLigands={rankedLigands}
          attestation={attestation}
        />

        {/* Binding Affinity Chart - Lazy loaded */}
        {rankedLigands.length > 0 && (
          <LazySection
            className="mb-6"
            placeholder={
              <div className="glass rounded-xl p-6 mb-6 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Loading chart...</p>
                </div>
              </div>
            }
          >
            <LazyBindingAffinityChart rankedLigands={rankedLigands} />
          </LazySection>
        )}

        {/* Enhanced Ranked Ligands Table */}
        <EnhancedLigandsTable
          rankedLigands={rankedLigands}
          onViewLigand={setSelectedLigand}
        />

        {/* 3D Molecular Viewer (if ligand selected) */}
        <AnimatePresence>
          {selectedLigand && (
            <motion.div
              className="glass rounded-xl p-6 mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiActivity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      3D Molecular Structure
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedLigand.ligand_name} (ΔG:{" "}
                      {selectedLigand.binding_affinity} kcal/mol)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLigand(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                {pdbqtFiles[selectedLigand.ligand_name] ? (
                  <LazyMolecularViewer3D
                    pdbqtData={pdbqtFiles[selectedLigand.ligand_name]}
                    ligandName={selectedLigand.ligand_name}
                    height="500px"
                  />
                ) : (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <p className="text-gray-500">
                      PDBQT data not available for this ligand
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Only .pdbqt files can be visualized
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interaction Summary */}
        {Object.keys(interactions).length > 0 && (
          <CollapsibleSection
            title="Molecular Interactions"
            icon={FiActivity}
            defaultOpen={false}
            variant="elevated"
          >
            <div className="space-y-4">
              {Object.entries(interactions).map(([ligandName, data]) => (
                <div
                  key={ligandName}
                  className="border-l-4 border-blue-500 pl-4 bg-blue-50/50 p-4 rounded-r-lg"
                >
                  <h3 className="font-medium text-gray-900 mb-2">
                    {ligandName}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    {data.hydrogen_bonds !== undefined && (
                      <p>Hydrogen bonds: {data.hydrogen_bonds}</p>
                    )}
                    {data.hydrophobic_contacts !== undefined && (
                      <p>Hydrophobic contacts: {data.hydrophobic_contacts}</p>
                    )}
                    {data.salt_bridges !== undefined && (
                      <p>Salt bridges: {data.salt_bridges}</p>
                    )}
                    {data.key_residues && data.key_residues.length > 0 && (
                      <p>Key residues: {data.key_residues.join(", ")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Visualization Gallery - Lazy loaded */}
        {visualizations.length > 0 && (
          <CollapsibleSection
            title="Visualizations"
            icon={FiImage}
            defaultOpen={false}
            variant="bordered"
          >
            <LazySection
              placeholder={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="glass rounded-lg p-3">
                      <div className="w-full h-48 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visualizations.map((viz, idx) => {
                  const imagePath = viz.output_path || viz;
                  const imageUrl = imagePath.startsWith("http")
                    ? imagePath
                    : `http://localhost:8000/${imagePath}`;

                  return (
                    <motion.div
                      key={idx}
                      className="glass rounded-lg p-3 cursor-pointer hover:shadow-lg transition-all group"
                      onClick={() => setSelectedImage(imageUrl)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt={viz.ligand_name || `Visualization ${idx + 1}`}
                          loading="lazy"
                          className="w-full h-48 object-contain rounded bg-white"
                          onError={(e) => {
                            e.target.src =
                              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text x="50%" y="50%" text-anchor="middle" fill="gray">Image not available</text></svg>';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded flex items-center justify-center">
                          <FiMaximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      {viz.ligand_name && (
                        <p className="text-sm text-gray-700 mt-2 text-center font-medium">
                          {viz.ligand_name}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </LazySection>
          </CollapsibleSection>
        )}

        {/* Scientific Report - Lazy loaded */}
        {report && (
          <CollapsibleSection
            title="Scientific Report"
            icon={FiFileText}
            defaultOpen={true}
            variant="elevated"
          >
            <LazySection
              placeholder={
                <div className="space-y-6">
                  <div className="flex gap-3 flex-wrap">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="glass rounded-xl p-6">
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              <LazyScientificReport
                report={report}
                rankedLigands={rankedLigands}
              />
            </LazySection>
          </CollapsibleSection>
        )}

        {/* Analysis Metadata */}
        <motion.div
          className="glass rounded-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FiInfo className="w-5 h-5 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Analysis Metadata
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  status === "complete"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                {status}
              </span>
            </div>
            {attestation && attestation.transaction_signature && (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Network:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                    {attestation.network || "devnet"}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700 block mb-2">
                    Attestation Transaction:
                  </span>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <code className="text-xs text-gray-600 break-all flex-1 font-mono">
                      {attestation.transaction_signature}
                    </code>
                    {attestation.explorer_url && (
                      <a
                        href={attestation.explorer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-xs whitespace-nowrap font-medium flex items-center gap-1"
                      >
                        View
                        <FiMaximize2 className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-w-6xl max-h-full relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-white" />
              </button>
              <img
                src={selectedImage}
                alt="Enlarged visualization"
                className="max-w-full max-h-screen object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
