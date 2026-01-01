import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function Analyze() {
  const [result, setResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Upload
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
        </div>

        {/* Analysis Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Analysis Status
          </h2>
          <p className="text-gray-700">
            Status: <span className="font-medium capitalize">{status}</span>
          </p>
          {attestation && attestation.transaction_signature && (
            <p className="text-sm text-gray-600 mt-2">
              Attestation TX: {attestation.transaction_signature}
            </p>
          )}
        </div>

        {/* Ranked Ligands Table */}
        {rankedLigands.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ranked Ligands
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
                      Binding Affinity (kcal/mol)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pose ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rankedLigands.map((ligand, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ligand.ligand_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ligand.binding_affinity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ligand.pose_id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Interaction Summary */}
        {Object.keys(interactions).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Interaction Summary
            </h2>
            <div className="space-y-4">
              {Object.entries(interactions).map(([ligandName, data]) => (
                <div
                  key={ligandName}
                  className="border-l-4 border-blue-500 pl-4"
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
          </div>
        )}

        {/* Visualization Gallery */}
        {visualizations.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Visualizations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visualizations.map((viz, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-2 cursor-pointer hover:border-blue-500"
                  onClick={() => setSelectedImage(viz)}
                >
                  <img
                    src={viz.output_path || viz}
                    alt={viz.ligand_name || `Visualization ${idx + 1}`}
                    className="w-full h-48 object-cover rounded"
                  />
                  {viz.ligand_name && (
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      {viz.ligand_name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scientific Report */}
        {report && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Scientific Report
            </h2>
            <div className="prose max-w-none text-gray-700">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={selectedImage.output_path || selectedImage}
              alt="Enlarged visualization"
              className="max-w-full max-h-screen object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
