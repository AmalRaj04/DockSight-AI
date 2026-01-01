import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setError("Failed to load analysis history");
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
      alert("Failed to load analysis");
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

      fetchAnalyses();
      fetchStatistics();
    } catch (err) {
      alert("Failed to delete analysis");
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
      fetchAnalyses();
      fetchTags();
      fetchProjects();
    } catch (err) {
      alert("Failed to update metadata");
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
      alert("You can compare up to 3 analyses at a time");
    }
  };

  const compareSelected = () => {
    if (selectedForComparison.length < 2) {
      alert("Please select at least 2 analyses to compare");
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center font-medium"
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📚 Analysis History
          </h1>
          <p className="text-gray-600">
            View, search, and manage all your docking analyses
          </p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">Total Analyses</div>
              <div className="text-3xl font-bold text-blue-600">
                {statistics.total_analyses}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">Ligands Tested</div>
              <div className="text-3xl font-bold text-green-600">
                {statistics.total_ligands_tested}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">Projects</div>
              <div className="text-3xl font-bold text-purple-600">
                {statistics.total_projects}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">Best Candidate</div>
              <div className="text-lg font-bold text-gray-900 truncate">
                {statistics.best_overall_candidate?.name || "N/A"}
              </div>
              <div className="text-sm text-gray-600">
                {statistics.best_overall_candidate?.affinity || "N/A"} kcal/mol
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by ligand, ID, or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Project Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Projects</option>
                {allProjects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (selectedTags.includes(tag)) {
                        setSelectedTags(selectedTags.filter((t) => t !== tag));
                      } else {
                        setSelectedTags([...selectedTags, tag]);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTags.includes(tag)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
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
              className="mt-4 text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Comparison Bar */}
        {selectedForComparison.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div>
              <span className="font-medium text-blue-900">
                {selectedForComparison.length} analyses selected for comparison
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={compareSelected}
                disabled={selectedForComparison.length < 2}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm font-medium"
              >
                Compare Selected
              </button>
              <button
                onClick={() => setSelectedForComparison([])}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && analyses.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
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
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Upload Files
            </button>
          </div>
        )}

        {/* Analysis List */}
        {analyses.length > 0 && (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div
                key={analysis.analysis_id}
                className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                  selectedForComparison.includes(analysis.analysis_id)
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Comparison Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedForComparison.includes(
                          analysis.analysis_id
                        )}
                        onChange={() => toggleComparison(analysis.analysis_id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />

                      <h3 className="text-lg font-semibold text-gray-900">
                        Analysis {analysis.analysis_id.slice(0, 12)}...
                      </h3>

                      {analysis.attestation?.verified && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          ✅ Verified
                        </span>
                      )}

                      {analysis.project && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                          📁 {analysis.project}
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
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            🏷️ {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {editingId === analysis.analysis_id ? (
                      /* Edit Mode */
                      <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Project
                          </label>
                          <input
                            type="text"
                            value={editProject}
                            onChange={(e) => setEditProject(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
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
                              className="flex-1 px-3 py-2 border rounded"
                              placeholder="Add tag"
                            />
                            <button
                              onClick={addTag}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Add
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {editTags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded flex items-center gap-1"
                              >
                                {tag}
                                <button
                                  onClick={() => removeTag(tag)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  ×
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
                            className="w-full px-3 py-2 border rounded"
                            rows="3"
                            placeholder="Add notes..."
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(analysis.analysis_id)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-600">
                              Ligands:
                            </span>
                            <span className="ml-2 font-semibold text-gray-900">
                              {analysis.ligand_count}
                            </span>
                          </div>
                          {analysis.top_candidate && (
                            <>
                              <div>
                                <span className="text-sm text-gray-600">
                                  Top Candidate:
                                </span>
                                <span className="ml-2 font-semibold text-gray-900">
                                  {analysis.top_candidate.name}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600">
                                  Best ΔG:
                                </span>
                                <span className="ml-2 font-semibold text-green-600">
                                  {analysis.top_candidate.affinity} kcal/mol
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        {analysis.notes && (
                          <div className="text-sm text-gray-600 italic mb-3">
                            📝 {analysis.notes}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => viewAnalysis(analysis.analysis_id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                    >
                      View Report
                    </button>
                    <button
                      onClick={() => startEdit(analysis)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteAnalysis(analysis.analysis_id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
