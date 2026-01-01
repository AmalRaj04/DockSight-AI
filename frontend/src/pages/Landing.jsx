import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiUploadCloud,
  FiClock,
  FiCheckCircle,
  FiX,
  FiFile,
} from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";
import { cn } from "../utils/cn";

export default function Landing() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndSetFiles(droppedFiles);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndSetFiles(selectedFiles);
  };

  const validateAndSetFiles = (selectedFiles) => {
    const validExtensions = [".pdbqt", ".log"];

    const invalidFiles = selectedFiles.filter((file) => {
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      return !validExtensions.includes(ext);
    });

    if (invalidFiles.length > 0) {
      toast.error(
        "Invalid file types. Only .pdbqt and .log files are allowed."
      );
      return;
    }

    setFiles(selectedFiles);
    toast.success(`${selectedFiles.length} file(s) selected`);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    toast.success("File removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading("Analyzing docking results...");

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis submission failed");
      }

      const result = await response.json();
      sessionStorage.setItem("analysisResult", JSON.stringify(result));

      toast.success("Analysis complete!", { id: loadingToast });
      navigate("/analyze");
    } catch (err) {
      toast.error(err.message || "Failed to submit files", {
        id: loadingToast,
      });
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen molecular-grid relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DockSight AI</h1>
              <p className="text-sm text-gray-600">Autonomous Analysis Agent</p>
            </div>
          </div>

          <motion.button
            onClick={() => navigate("/history")}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-white hover:shadow-md transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiClock className="w-4 h-4" />
            <span className="font-medium">History</span>
          </motion.button>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Molecular Docking
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Analysis & Reporting
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your AutoDock Vina results to generate ranked ligand
            analysis, interactive visualizations, and publication-ready
            scientific reports.
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <form onSubmit={handleSubmit}>
            {/* Drop Zone */}
            <div
              className={cn(
                "relative glass rounded-2xl p-12 transition-all duration-300",
                dragActive && "ring-2 ring-blue-500 ring-offset-2 scale-[1.02]",
                !dragActive && "hover:shadow-xl"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept=".pdbqt,.log"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />

              <label
                htmlFor="file-upload"
                className="cursor-pointer block text-center"
              >
                <motion.div
                  animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-6">
                    <FiUploadCloud className="mx-auto h-16 w-16 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {dragActive ? "Drop files here" : "Upload Docking Files"}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    Drag and drop your files or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports .pdbqt and .log formats
                  </p>
                </motion.div>
              </label>

              {/* File List */}
              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div
                    className="mt-8 pt-8 border-t border-gray-200"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-medium text-gray-700">
                        Selected Files ({files.length})
                      </p>
                      <button
                        type="button"
                        onClick={() => setFiles([])}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {files.map((file, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-gray-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FiFile className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="ml-2 p-1 hover:bg-red-50 rounded transition-colors"
                          >
                            <FiX className="w-4 h-4 text-red-500" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={uploading || files.length === 0}
              className={cn(
                "w-full mt-6 py-4 px-6 rounded-xl font-semibold text-white transition-all",
                "bg-gradient-to-r from-blue-600 to-blue-700",
                "hover:from-blue-700 hover:to-blue-800 hover:shadow-lg",
                "disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-3"
              )}
              whileHover={!uploading && files.length > 0 ? { scale: 1.01 } : {}}
              whileTap={!uploading && files.length > 0 ? { scale: 0.99 } : {}}
            >
              {uploading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-5 h-5" />
                  <span>Analyze Docking Results</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Features */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            {
              icon: "📊",
              title: "Automated Ranking",
              description:
                "Ligands ranked by binding affinity with best pose selection",
            },
            {
              icon: "🔬",
              title: "Scientific Reports",
              description:
                "Publication-ready reports with LLM-powered analysis",
            },
            {
              icon: "⛓️",
              title: "Blockchain Verified",
              description:
                "Immutable attestation on Solana for reproducibility",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="glass rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
