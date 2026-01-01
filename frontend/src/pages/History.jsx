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
} from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedForComparison, setSelectedForComparison] = useState([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
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
  }, [searchTerm, selectedTags, selectedProject]);

  const fetchAnalyses = async () => {
    try {
      const params = new URLSearchParams();
      params.append("limit", "50");
      if (searchTerm) params.append("search", searchTerm);
      if (selectedTags.length > 0)
        params.append("tags", selectedTags.join(","));
      if (selectedProject) params.append("project", selectedProject);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.length > 0 ? (
                  allTags.map((tag) => (
                    <button
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
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {tag}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No tags available</p>
                )}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedTags.length > 0 || selectedProject) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedTags([]);
                setSelectedProject("");
              }}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <FiX className="w-4 h-4" />
              Clear all filters
            </button>
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

        {/* Analysis List */}
        {analyses.length > 0 && (
          <div className="space-y-4">
            {analyses.map((analysis, index) => (
              <motion.div
                key={analysis.analysis_id}
                className={`glass rounded-xl p-6 hover:shadow-lg transition-all ${
                  selectedForComparison.includes(analysis.analysis_id)
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Comparison Checkbox */}
                      <button
                        onClick={() => toggleComparison(analysis.analysis_id)}
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

                      <h3 className="text-lg font-semibold text-gray-900 font-mono">
                        {analysis.analysis_id.slice(0, 30)}...
                      </h3>

                      {analysis.attestation?.verified && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200 flex items-center gap-1">
                          <FiCheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      )}

                      {analysis.project && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full border border-purple-200 flex items-center gap-1">
                          <FiFolder className="w-3 h-3" />
                          {analysis.project}
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      {formatDate(analysis.timestamp)}
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
                            onChange={(e) => setEditProject(e.target.value)}
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
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && addTag()}
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
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            placeholder="Add notes..."
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(analysis.analysis_id)}
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
                                <span className="font-semibold text-gray-900">
                                  {analysis.top_candidate.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FiTrendingDown className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  Best ΔG:
                                </span>
                                <span className="font-semibold text-green-600">
                                  {analysis.top_candidate.affinity} kcal/mol
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
