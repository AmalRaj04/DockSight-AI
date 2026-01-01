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
  FiArrowRight,
  FiPlay,
  FiTrendingUp,
  FiShield,
  FiZap,
  FiAlertCircle,
  FiLoader,
  FiFileText,
  FiDatabase,
} from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";
import ParticleBackground from "../components/ParticleBackground";
import { cn } from "../utils/cn";
import { animations } from "../utils/animations";

// Lazy load below-the-fold components
import FeaturesShowcase from "../components/FeaturesShowcase";
import HowItWorks from "../components/HowItWorks";
import BenefitsSection from "../components/BenefitsSection";
import UseCases from "../components/UseCases";
import TechnologyStack from "../components/TechnologyStack";
import SocialProof from "../components/SocialProof";
import Footer from "../components/Footer";

export default function Landing() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadState, setUploadState] = useState("idle"); // idle, dragOver, uploading, success, error
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
      setUploadState("dragOver");
    } else if (e.type === "dragleave") {
      setDragActive(false);
      setUploadState("idle");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploadState("idle");

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
      setUploadState("error");
      const invalidExts = [
        ...new Set(
          invalidFiles.map((f) =>
            f.name.substring(f.name.lastIndexOf(".")).toLowerCase()
          )
        ),
      ];

      let errorMessage = `Invalid file types detected: ${invalidExts.join(
        ", "
      )}. `;
      errorMessage += "Only .pdbqt and .log files are supported. ";

      if (invalidExts.some((ext) => [".txt", ".csv", ".xlsx"].includes(ext))) {
        errorMessage +=
          "If you have docking data in text format, please save it as .log file.";
      } else if (
        invalidExts.some((ext) => [".pdb", ".mol2", ".sdf"].includes(ext))
      ) {
        errorMessage +=
          "Please convert molecular structure files to .pdbqt format using AutoDock Tools.";
      } else {
        errorMessage +=
          "Please check our sample data for examples of supported formats.";
      }

      toast.error(errorMessage, { duration: 6000 });
      setTimeout(() => setUploadState("idle"), 3000);
      return;
    }

    // Check for empty files
    const emptyFiles = selectedFiles.filter((file) => file.size === 0);
    if (emptyFiles.length > 0) {
      setUploadState("error");
      toast.error(
        "Some files are empty. Please check your files and try again.",
        { duration: 4000 }
      );
      setTimeout(() => setUploadState("idle"), 3000);
      return;
    }

    // Check for very large files (>50MB)
    const largeFiles = selectedFiles.filter(
      (file) => file.size > 50 * 1024 * 1024
    );
    if (largeFiles.length > 0) {
      setUploadState("error");
      toast.error(
        "Some files are too large (>50MB). Please use smaller files or contact support for large datasets.",
        { duration: 6000 }
      );
      setTimeout(() => setUploadState("idle"), 3000);
      return;
    }

    setFiles(selectedFiles);
    setUploadState("success");
    toast.success(`${selectedFiles.length} file(s) selected successfully`);
    setTimeout(() => setUploadState("idle"), 2000);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    toast.success("File removed");
  };

  // Get file icon based on extension
  const getFileIcon = (fileName) => {
    const ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    switch (ext) {
      case ".pdbqt":
        return <FiDatabase className="w-5 h-5 text-blue-500 flex-shrink-0" />;
      case ".log":
        return <FiFileText className="w-5 h-5 text-green-500 flex-shrink-0" />;
      default:
        return <FiFile className="w-5 h-5 text-gray-500 flex-shrink-0" />;
    }
  };

  // Get file status indicator
  const getFileStatus = (file, index) => {
    if (uploading) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (index + 1) * 20)}%` }}
            ></div>
          </div>
          <FiLoader className="w-4 h-4 text-blue-500 animate-spin" />
        </div>
      );
    }

    if (uploadState === "success") {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <FiCheckCircle className="w-4 h-4 text-green-500" />
        </motion.div>
      );
    }

    if (uploadState === "error") {
      return <FiAlertCircle className="w-4 h-4 text-red-500" />;
    }

    return null;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Get visual state classes for upload zone
  const getUploadZoneClasses = () => {
    const baseClasses =
      "relative glass rounded-2xl p-12 transition-all duration-300 border-2";

    switch (uploadState) {
      case "dragOver":
        return `${baseClasses} border-blue-500 bg-blue-50/50 scale-[1.02] shadow-lg ring-2 ring-blue-200 upload-pulse`;
      case "uploading":
        return `${baseClasses} border-blue-500 bg-blue-50/30 animate-pulse`;
      case "success":
        return `${baseClasses} border-green-500 bg-green-50/50 shadow-lg`;
      case "error":
        return `${baseClasses} border-red-500 bg-red-50/50 shadow-lg`;
      default:
        return `${baseClasses} border-dashed border-gray-300 hover:border-gray-400 hover:shadow-xl`;
    }
  };

  // Get upload icon based on state
  const getUploadIcon = () => {
    switch (uploadState) {
      case "dragOver":
        return (
          <FiUploadCloud className="mx-auto h-16 w-16 text-blue-500 animate-bounce" />
        );
      case "uploading":
        return (
          <FiLoader className="mx-auto h-16 w-16 text-blue-500 animate-spin" />
        );
      case "success":
        return <FiCheckCircle className="mx-auto h-16 w-16 text-green-500" />;
      case "error":
        return <FiAlertCircle className="mx-auto h-16 w-16 text-red-500" />;
      default:
        return <FiUploadCloud className="mx-auto h-16 w-16 text-blue-500" />;
    }
  };

  // Get upload text based on state
  const getUploadText = () => {
    switch (uploadState) {
      case "dragOver":
        return {
          title: "Drop files here",
          subtitle: "Release to upload your files",
          description: "Supports .pdbqt and .log formats",
        };
      case "uploading":
        return {
          title: "Uploading files...",
          subtitle: "Please wait while we process your files",
          description: "This may take a few moments",
        };
      case "success":
        return {
          title: "Files uploaded successfully!",
          subtitle: "Your files are ready for analysis",
          description: "Click analyze to continue",
        };
      case "error":
        return {
          title: "Upload failed",
          subtitle: "There was an error with your files",
          description: "Please check file formats and try again",
        };
      default:
        return {
          title: "Upload Docking Files",
          subtitle: "Drag and drop your files or click to browse",
          description: "Supports .pdbqt and .log formats",
        };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please select at least one file to analyze");
      return;
    }

    setUploading(true);
    setUploadState("uploading");
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
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Analysis submission failed. ";

        if (response.status === 413) {
          errorMessage += "Files are too large. Please try with smaller files.";
        } else if (response.status === 400) {
          errorMessage += errorData.detail || "Invalid file format or content.";
        } else if (response.status === 500) {
          errorMessage += "Server error. Please try again or contact support.";
        } else {
          errorMessage += `Server returned ${response.status}. Please try again.`;
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      sessionStorage.setItem("analysisResult", JSON.stringify(result));

      setUploadState("success");
      toast.success("Analysis complete!", { id: loadingToast });
      navigate("/analyze");
    } catch (err) {
      setUploadState("error");
      const errorMessage =
        err.message ||
        "Failed to submit files. Please check your connection and try again.";
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 6000,
      });
      setUploading(false);
      setTimeout(() => setUploadState("idle"), 3000);
    }
  };

  return (
    <div className="min-h-screen molecular-grid relative overflow-hidden">
      {/* Animated Particle Background */}
      <ParticleBackground />

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

        {/* Enhanced Hero Section */}
        <motion.div
          className="text-center mb-20 max-w-4xl mx-auto"
          variants={animations.staggerChildren}
          initial="initial"
          animate="animate"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6"
            variants={animations.fadeIn}
          >
            <FiZap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              AI-Powered Drug Discovery
            </span>
          </motion.div>

          {/* Headline with Gradient Text */}
          <motion.h2
            className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            variants={animations.fadeIn}
          >
            Transform Docking Results into{" "}
            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-500 to-green-500 bg-clip-text text-transparent">
              Publication-Ready Insights
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
            variants={animations.fadeIn}
          >
            Autonomous analysis agent that ranks ligands, generates
            visualizations, and creates scientific reports in minutes—powered by
            AI and verified on blockchain.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            variants={animations.fadeIn}
          >
            <motion.button
              onClick={() => {
                document
                  .getElementById("upload-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Start Analysis</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              onClick={() => navigate("/analyze")}
              className="flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-white hover:border-gray-300 hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlay className="w-5 h-5" />
              <span>View Demo</span>
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 text-sm"
            variants={animations.fadeIn}
          >
            <div className="flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-gray-700 font-medium">1000+ Analyses</span>
            </div>
            <div className="flex items-center gap-2">
              <FiShield className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium">
                Blockchain Verified
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span className="text-gray-700 font-medium">Open Source</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          id="upload-section"
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <form onSubmit={handleSubmit}>
            {/* Drop Zone */}
            <div
              className={getUploadZoneClasses()}
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
                  animate={
                    uploadState === "dragOver"
                      ? { scale: 1.05, y: -5 }
                      : { scale: 1, y: 0 }
                  }
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-6">{getUploadIcon()}</div>
                  <h3
                    className={cn(
                      "text-xl font-semibold mb-2",
                      uploadState === "success" && "text-green-700",
                      uploadState === "error" && "text-red-700",
                      uploadState === "uploading" && "text-blue-700",
                      uploadState === "dragOver" && "text-blue-700",
                      uploadState === "idle" && "text-gray-900"
                    )}
                  >
                    {getUploadText().title}
                  </h3>
                  <p
                    className={cn(
                      "mb-1",
                      uploadState === "success" && "text-green-600",
                      uploadState === "error" && "text-red-600",
                      uploadState === "uploading" && "text-blue-600",
                      uploadState === "dragOver" && "text-blue-600",
                      uploadState === "idle" && "text-gray-600"
                    )}
                  >
                    {getUploadText().subtitle}
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      uploadState === "success" && "text-green-500",
                      uploadState === "error" && "text-red-500",
                      uploadState === "uploading" && "text-blue-500",
                      uploadState === "dragOver" && "text-blue-500",
                      uploadState === "idle" && "text-gray-500"
                    )}
                  >
                    {getUploadText().description}
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
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {files.map((file, idx) => (
                        <motion.div
                          key={idx}
                          className={cn(
                            "group relative p-4 rounded-xl border transition-all duration-300",
                            uploadState === "success" &&
                              "bg-green-50/50 border-green-200",
                            uploadState === "error" &&
                              "bg-red-50/50 border-red-200",
                            uploadState === "uploading" &&
                              "bg-blue-50/50 border-blue-200",
                            uploadState === "idle" &&
                              "bg-white/70 border-gray-200 hover:bg-white hover:shadow-md"
                          )}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-center gap-4">
                            {/* File Icon */}
                            <div className="flex-shrink-0">
                              {getFileIcon(file.name)}
                            </div>

                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-medium text-gray-900 truncate pr-2">
                                  {file.name}
                                </h4>
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                  {formatFileSize(file.size)}
                                </span>
                              </div>

                              {/* File Type Badge */}
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                    file.name.endsWith(".pdbqt") &&
                                      "bg-blue-100 text-blue-700",
                                    file.name.endsWith(".log") &&
                                      "bg-green-100 text-green-700"
                                  )}
                                >
                                  {file.name
                                    .substring(file.name.lastIndexOf("."))
                                    .toUpperCase()}
                                </span>

                                {/* Progress/Status */}
                                <div className="flex-1">
                                  {getFileStatus(file, idx)}
                                </div>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <motion.button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              disabled={uploading}
                            >
                              <FiX className="w-4 h-4" />
                            </motion.button>
                          </div>

                          {/* Upload Progress Bar (full width when uploading) */}
                          {uploading && (
                            <motion.div
                              className="mt-3 w-full bg-gray-200 rounded-full h-2"
                              initial={{ opacity: 0, scaleX: 0 }}
                              animate={{ opacity: 1, scaleX: 1 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <motion.div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{
                                  width: `${Math.min(100, (idx + 1) * 25)}%`,
                                }}
                                transition={{ duration: 1, delay: idx * 0.2 }}
                              />
                            </motion.div>
                          )}
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

          {/* File Format Information */}
          <motion.div
            className="mt-6 p-4 bg-gray-50/50 rounded-xl border border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                <FiFile className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Supported File Formats
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <FiDatabase className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        .pdbqt files
                      </span>
                      <p className="text-xs text-gray-500">
                        AutoDock Vina output files
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiFileText className="w-4 h-4 text-green-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        .log files
                      </span>
                      <p className="text-xs text-gray-500">
                        Docking log files with binding data
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sample Data Link */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">
                    Need test files? Try our sample data to see how it works.
                  </p>
                  <motion.a
                    href="/sample_data"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Download Samples</span>
                    <FiArrowRight className="w-3 h-3" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Landing Page Sections - Load immediately */}
      <div className="mt-20">
        <FeaturesShowcase />
        <HowItWorks />
        <BenefitsSection />
        <UseCases />
        <TechnologyStack />
        <SocialProof />
        <Footer />
      </div>
    </div>
  );
}
