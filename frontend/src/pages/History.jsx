import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiSearch,
  FiFilter,
  FiTag,
  FiFolder,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiCheckSquare,
  FiSquare,
  FiX,
  FiPlus,
  FiCheckCircle,
  FiActivity,
  FiTrendingDown,
  FiLayers,
  FiAward,
  FiGrid,
  FiList,
  FiImage,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";
import { LazySection } from "../utils/lazyLoading.jsx";

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [allTags, setAllTags] = useState([]);
  const [allProjects, setAllProjects] = useState([]);

  // Edit mode
  const [editingId, setEditingId] = useState(null);
  const [editTags, setEditTags] = useState([]);
  const [editProject, setEditProject] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [newTag, setNewTag] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalyses();
    fetchStatistics();
    fetchTags();
    fetchProjects();
  }, [searchTerm, selectedTags, selectedProject, dateRange]);

  const fetchAnalyses = async () => {
    try {
      const params = new URLSearchParams();
      params.append("limit", "50");
      if (searchTerm) params.append("search", searchTerm);
      if (selectedTags.length > 0)
        params.append("tags", selectedTags.join(","));
      if (selectedProject) params.append("project", selectedProject);
      if (dateRange.start) params.append("start_date", dateRange.start);
      if (dateRange.end) params.append("end_date", dateRange.end);

      const response = await fetch(
        `http://localhost:8000/api/analyses?${params}`
      );
      const data = await response.json();
      setAnalyses(data.analyses || []);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load analysis history");
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/analyses/stats/summary"
      );
      const data = await response.json();
      setStatistics(data);
    } catch (err) {
      console.error("Failed to load statistics:", err);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/analyses/tags");
      const data = await response.json();
      setAllTags(data.tags || []);
    } catch (err) {
      console.error("Failed to load tags:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/analyses/projects"
      );
      const data = await response.json();
      setAllProjects(data.projects || []);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  const viewAnalysis = async (analysisId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/analyses/${analysisId}`
      );
      const data = await response.json();

      sessionStorage.setItem("analysisResult", JSON.stringify(data));
      navigate("/analyze");
    } catch (err) {
      toast.error("Failed to load analysis");
    }
  };

  const deleteAnalysis = async (analysisId) => {
    if (!confirm("Are you sure you want to delete this analysis?")) {
      return;
    }

    try {
      await fetch(`http://localhost:8000/api/analyses/${analysisId}`, {
        method: "DELETE",
      });

      toast.success("Analysis deleted");
      fetchAnalyses();
      fetchStatistics();
    } catch (err) {
      toast.error("Failed to delete analysis");
    }
  };

  const startEdit = (analysis) => {
    setEditingId(analysis.analysis_id);
    setEditTags(analysis.tags || []);
    setEditProject(analysis.project || "");
    setEditNotes(analysis.notes || "");
  };

  const saveEdit = async (analysisId) => {
    try {
      await fetch(`http://localhost:8000/api/analyses/${analysisId}/metadata`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tags: editTags,
          project: editProject,
          notes: editNotes,
        }),
      });

      setEditingId(null);
      toast.success("Metadata updated");
      fetchAnalyses();
      fetchTags();
      fetchProjects();
    } catch (err) {
      toast.error("Failed to update metadata");
    }
  };

  const addTag = () => {
    if (newTag && !editTags.includes(newTag)) {
      setEditTags([...editTags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tag) => {
    setEditTags(editTags.filter((t) => t !== tag));
  };

  const toggleComparison = (analysisId) => {
    if (selectedForComparison.includes(analysisId)) {
      setSelectedForComparison(
        selectedForComparison.filter((id) => id !== analysisId)
      );
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison([...selectedForComparison, analysisId]);
    } else {
      toast.error("You can compare up to 3 analyses at a time");
    }
  };

  const compareSelected = () => {
    if (selectedForComparison.length < 2) {
      toast.error("Please select at least 2 analyses to compare");
      return;
    }
    navigate(`/compare?ids=${selectedForComparison.join(",")}`);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const generateThumbnail = (analysis) => {
    // Generate a simple visual representation based on analysis data
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
    ];
    const colorIndex = analysis.analysis_id.charCodeAt(0) % colors.length;
    const ligandCount = analysis.ligand_count || 0;
    const topAffinity = analysis.top_candidate?.affinity || 0;

    return {
      color: colors[colorIndex],
      ligandCount,
      topAffinity,
      hasVerification: analysis.attestation?.verified || false,
    };
  };

  const getCategoryBadge = (analysis) => {
    const ligandCount = analysis.ligand_count || 0;
    const topAffinity = parseFloat(analysis.top_candidate?.affinity || 0);

    if (topAffinity < -8) return { label: "High Affinity", color: "green" };
    if (topAffinity < -6) return { label: "Moderate", color: "yellow" };
    if (ligandCount > 10) return { label: "Large Screen", color: "blue" };
    if (ligandCount > 5) return { label: "Medium Screen", color: "purple" };
    return { label: "Small Screen", color: "gray" };
  };

  if (loading) {
    return (
      <div className="min-h-screen molecular-grid flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading analysis history..." />
      </div>
    );
  }

  const statsMetrics = statistics
    ? [
        {
          icon: FiActivity,
          label: "Total Analyses",
          value: statistics.total_analyses,
          color: "blue",
        },
        {
          icon: FiLayers,
          label: "Ligands Tested",
          value: statistics.total_ligands_tested,
          color: "green",
        },
        {
          icon: FiFolder,
          label: "Projects",
          value: statistics.total_projects,
          color: "purple",
        },
        {
          icon: FiAward,
          label: "Best Candidate",
          value: statistics.best_overall_candidate?.name || "N/A",
          subtitle: statistics.best_overall_candidate?.affinity
            ? `${statistics.best_overall_candidate.affinity} kcal/mol`
            : "",
          color: "orange",
        },
      ]
    : [];

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <div className="min-h-screen molecular-grid">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Upload
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Analysis History
          </h1>
          <p className="text-gray-600">
            View, search, and manage all your docking analyses
          </p>
        </motion.div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={index}
                  className="glass rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${
                      colorClasses[metric.color]
                    } w-fit mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    {metric.label}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 truncate">
                    {metric.value}
                  </div>
                  {metric.subtitle && (
                    <div className="text-sm text-gray-500 mt-1">
                      {metric.subtitle}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Search and Filters */}
        <motion.div
          className="glass rounded-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* View Toggle and Search Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FiList className="w-4 h-4" />
                  List
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {analyses.length}{" "}
              {analyses.length === 1 ? "analysis" : "analyses"} found
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by ligand, ID, or project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Project Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </label>
              <div className="relative">
                <FiFolder className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all"
                >
                  <option value="">All Projects</option>
                  {allProjects.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                    placeholder="Start date"
                  />
                </div>
                <div className="relative flex-1">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                    placeholder="End date"
                  />
                </div>
              </div>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                {allTags.length > 0 ? (
                  allTags.map((tag) => (
                    <motion.button
                      key={tag}
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          setSelectedTags(
                            selectedTags.filter((t) => t !== tag)
                          );
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tag}
                    </motion.button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No tags available</p>
                )}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm ||
            selectedTags.length > 0 ||
            selectedProject ||
            dateRange.start ||
            dateRange.end) && (
            <motion.button
              onClick={() => {
                setSearchTerm("");
                setSelectedTags([]);
                setSelectedProject("");
                setDateRange({ start: "", end: "" });
              }}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiX className="w-4 h-4" />
              Clear all filters
            </motion.button>
          )}
        </motion.div>

        {/* Comparison Bar */}
        <AnimatePresence>
          {selectedForComparison.length > 0 && (
            <motion.div
              className="glass rounded-xl p-4 mb-6 flex items-center justify-between border border-blue-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center gap-2">
                <FiCheckSquare className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">
                  {selectedForComparison.length} analyses selected for
                  comparison
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={compareSelected}
                  disabled={selectedForComparison.length < 2}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                >
                  Compare Selected
                </button>
                <button
                  onClick={() => setSelectedForComparison([])}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && analyses.length === 0 && (
          <motion.div
            className="glass rounded-xl p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiActivity className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {searchTerm || selectedTags.length > 0 || selectedProject
                ? "No Matching Analyses"
                : "No Analyses Yet"}
            </h2>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedTags.length > 0 || selectedProject
                ? "Try adjusting your filters"
                : "Upload your first docking results to get started"}
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Upload Files
            </button>
          </motion.div>
        )}

        {/* Analysis List - Lazy loaded */}
        <LazySection
          placeholder={
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                      <div className="flex gap-2">
                        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
          threshold={0.1}
          rootMargin="50px"
        >
          <AnimatePresence mode="wait">
            {analyses.length > 0 && (
              <motion.div
                key={`${searchTerm}-${selectedTags.join(
                  ","
                )}-${selectedProject}-${dateRange.start}-${dateRange.end}`}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {analyses.map((analysis, index) => {
                  const thumbnail = generateThumbnail(analysis);
                  const categoryBadge = getCategoryBadge(analysis);

                  return viewMode === "grid" ? (
                    /* Grid View Card */
                    <motion.div
                      key={analysis.analysis_id}
                      className={`glass rounded-xl overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group ${
                        selectedForComparison.includes(analysis.analysis_id)
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => viewAnalysis(analysis.analysis_id)}
                    >
                      {/* Thumbnail Header */}
                      <div
                        className={`h-24 ${thumbnail.color} relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComparison(analysis.analysis_id);
                            }}
                            className="text-white/80 hover:text-white transition-colors"
                          >
                            {selectedForComparison.includes(
                              analysis.analysis_id
                            ) ? (
                              <FiCheckSquare className="w-5 h-5" />
                            ) : (
                              <FiSquare className="w-5 h-5" />
                            )}
                          </button>
                          {analysis.attestation?.verified && (
                            <FiCheckCircle className="w-4 h-4 text-white/90" />
                          )}
                        </div>
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm border border-white/30`}
                          >
                            {categoryBadge.label}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center justify-between text-white/90 text-sm">
                            <div className="flex items-center gap-1">
                              <FiLayers className="w-4 h-4" />
                              <span>{thumbnail.ligandCount}</span>
                            </div>
                            {thumbnail.topAffinity && (
                              <div className="flex items-center gap-1">
                                <FiTrendingDown className="w-4 h-4" />
                                <span>{thumbnail.topAffinity} kcal/mol</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-mono font-semibold text-gray-900 truncate">
                              {analysis.analysis_id.slice(0, 20)}...
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <FiCalendar className="w-3 h-3" />
                              <span>{formatDate(analysis.timestamp)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Project and Tags */}
                        <div className="space-y-2 mb-4">
                          {analysis.project && (
                            <div className="flex items-center gap-1">
                              <FiFolder className="w-3 h-3 text-purple-500" />
                              <span className="text-xs text-purple-700 font-medium">
                                {analysis.project}
                              </span>
                            </div>
                          )}

                          {analysis.tags && analysis.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {analysis.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200"
                                >
                                  {tag}
                                </span>
                              ))}
                              {analysis.tags.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{analysis.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Top Candidate */}
                        {analysis.top_candidate && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <FiAward className="w-4 h-4 text-orange-500" />
                              <span className="text-xs font-medium text-gray-700">
                                Top Candidate
                              </span>
                            </div>
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {analysis.top_candidate.name}
                            </div>
                            <div className="text-xs text-green-600 font-medium">
                              {analysis.top_candidate.affinity} kcal/mol
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              viewAnalysis(analysis.analysis_id);
                            }}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                          >
                            <FiEye className="w-3 h-3" />
                            View
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(analysis);
                            }}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs font-medium flex items-center gap-1 transition-colors"
                          >
                            <FiEdit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAnalysis(analysis.analysis_id);
                            }}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs font-medium flex items-center gap-1 transition-colors"
                          >
                            <FiTrash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* List View Card */
                    <motion.div
                      key={analysis.analysis_id}
                      className={`glass rounded-xl p-6 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 ${
                        selectedForComparison.includes(analysis.analysis_id)
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Thumbnail */}
                          <div
                            className={`w-16 h-16 ${thumbnail.color} rounded-lg flex items-center justify-center relative overflow-hidden flex-shrink-0`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                            <div className="text-white text-xs font-bold">
                              {thumbnail.ligandCount}
                            </div>
                            {analysis.attestation?.verified && (
                              <FiCheckCircle className="absolute top-1 right-1 w-3 h-3 text-white/90" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              {/* Comparison Checkbox */}
                              <button
                                onClick={() =>
                                  toggleComparison(analysis.analysis_id)
                                }
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                {selectedForComparison.includes(
                                  analysis.analysis_id
                                ) ? (
                                  <FiCheckSquare className="w-5 h-5 text-blue-600" />
                                ) : (
                                  <FiSquare className="w-5 h-5" />
                                )}
                              </button>

                              <h3 className="text-lg font-semibold text-gray-900 font-mono truncate">
                                {analysis.analysis_id.slice(0, 30)}...
                              </h3>

                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                  categoryBadge.color === "green"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : categoryBadge.color === "yellow"
                                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                    : categoryBadge.color === "blue"
                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                    : categoryBadge.color === "purple"
                                    ? "bg-purple-100 text-purple-700 border-purple-200"
                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                }`}
                              >
                                {categoryBadge.label}
                              </span>

                              {analysis.project && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full border border-purple-200 flex items-center gap-1">
                                  <FiFolder className="w-3 h-3" />
                                  {analysis.project}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <FiCalendar className="w-4 h-4" />
                                <span>{formatDate(analysis.timestamp)}</span>
                              </div>
                            </div>

                            {/* Tags */}
                            {analysis.tags && analysis.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {analysis.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200 flex items-center gap-1"
                                  >
                                    <FiTag className="w-3 h-3" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {editingId === analysis.analysis_id ? (
                              /* Edit Mode */
                              <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Project
                                  </label>
                                  <input
                                    type="text"
                                    value={editProject}
                                    onChange={(e) =>
                                      setEditProject(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Project name"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Tags
                                  </label>
                                  <div className="flex gap-2 mb-2">
                                    <input
                                      type="text"
                                      value={newTag}
                                      onChange={(e) =>
                                        setNewTag(e.target.value)
                                      }
                                      onKeyPress={(e) =>
                                        e.key === "Enter" && addTag()
                                      }
                                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                      placeholder="Add tag"
                                    />
                                    <button
                                      onClick={addTag}
                                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                      <FiPlus className="w-4 h-4" />
                                      Add
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {editTags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1"
                                      >
                                        {tag}
                                        <button
                                          onClick={() => removeTag(tag)}
                                          className="hover:text-blue-900"
                                        >
                                          <FiX className="w-3 h-3" />
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Notes
                                  </label>
                                  <textarea
                                    value={editNotes}
                                    onChange={(e) =>
                                      setEditNotes(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Add notes..."
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      saveEdit(analysis.analysis_id)
                                    }
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* View Mode */
                              <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                  <div className="flex items-center gap-2">
                                    <FiLayers className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      Ligands:
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                      {analysis.ligand_count}
                                    </span>
                                  </div>
                                  {analysis.top_candidate && (
                                    <>
                                      <div className="flex items-center gap-2">
                                        <FiAward className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                          Top:
                                        </span>
                                        <span className="font-semibold text-gray-900 truncate">
                                          {analysis.top_candidate.name}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <FiTrendingDown className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                          Best ΔG:
                                        </span>
                                        <span className="font-semibold text-green-600">
                                          {analysis.top_candidate.affinity}{" "}
                                          kcal/mol
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>

                                {analysis.notes && (
                                  <div className="text-sm text-gray-600 italic mb-3 p-3 bg-gray-50 rounded-lg">
                                    {analysis.notes}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => viewAnalysis(analysis.analysis_id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => startEdit(analysis)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <FiEdit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteAnalysis(analysis.analysis_id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </LazySection>
      </div>
    </div>
  );
}
