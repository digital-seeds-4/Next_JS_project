'use client';

import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

interface ProjectSubmission {
  id: string;
  projectName: string;
  userName: string;
  createdAt: string;
  submittedAt: string;
  maturityScore: number;
  evaluationStatus: 'pending' | 'evaluated' | 'approved' | 'rejected';
  evaluationNotes: string;
  evaluatedBy: string | null;
  evaluatedAt: string | null;
  phaseScores: Record<number, number>;
  recommendations: string[];
}

const AdminDashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectSubmission[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectSubmission | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'evaluated' | 'approved' | 'rejected'>('all');
  const [evaluationNotes, setEvaluationNotes] = useState('');
  const [evaluationRating, setEvaluationRating] = useState<'approved' | 'rejected'>('approved');

  // Fonction pour obtenir couleur et message selon le pourcentage
  const getScoreColor = (score: number) => {
    if (score <= 30) {
      return { color: '#dc3545', message: '🔴 Projet Fragile' };
    } else if (score <= 70) {
      return { color: '#ffc107', message: '🟠 À améliorer' };
    } else {
      return { color: '#28a745', message: '🟢 Prêt pour financement ' };
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const parsed = JSON.parse(storedProjects);
      setProjects(parsed);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.evaluationStatus === filterStatus;
  });

  const handleEvaluateProject = () => {
    if (!selectedProject) return;

    const updatedProject = {
      ...selectedProject,
      evaluationStatus: evaluationRating,
      evaluationNotes,
      evaluatedBy: 'Mentor/Admin',
      evaluatedAt: new Date().toISOString(),
    };

    const updatedProjects = projects.map((p) =>
      p.id === selectedProject.id ? updatedProject : p
    );

    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setSelectedProject(null);
    setEvaluationNotes('');
    setEvaluationRating('approved');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'approved':
        return '#28a745';
      case 'rejected':
        return '#dc3545';
      case 'evaluated':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: '⏳ En attente',
      evaluated: '📋 Évalué',
      approved: '✅ Approuvé',
      rejected: '❌ Rejeté',
    };
    return labels[status] || status;
  };

  const stats = {
    total: projects.length,
    pending: projects.filter((p) => p.evaluationStatus === 'pending').length,
    approved: projects.filter((p) => p.evaluationStatus === 'approved').length,
    rejected: projects.filter((p) => p.evaluationStatus === 'rejected').length,
    avgScore: Math.round(
      projects.reduce((sum, p) => sum + p.maturityScore, 0) / (projects.length || 1)
    ),
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>📊 Tableau de Bord Admin</h1>
        <p>Suivi des projets, évaluation et progression</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📌</div>
          <div className="stat-content">
            <h3>Total Projets</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>En Attente</h3>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>

        <div className="stat-card approved">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Approuvés</h3>
            <p className="stat-value">{stats.approved}</p>
          </div>
        </div>

        <div className="stat-card rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>Rejetés</h3>
            <p className="stat-value">{stats.rejected}</p>
          </div>
        </div>

        <div className="stat-card score">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Score Moyen</h3>
            <p className="stat-value">{stats.avgScore}%</p>
          </div>
        </div>
      </div>

      {/* Filter & List Section */}
      <div className="content-wrapper">
        <div className="projects-section">
          <div className="filter-tabs">
            {(['all', 'pending', 'evaluated', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
                onClick={() => setFilterStatus(status)}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>

          <div className="projects-list">
            {filteredProjects.length === 0 ? (
              <div className="empty-state">
                <p>Aucun projet pour ce filtre</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`project-card ${selectedProject?.id === project.id ? 'selected' : ''}`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="project-header">
                    <div>
                      <h3>{project.projectName}</h3>
                      <p className="project-author">👤 {project.userName}</p>
                    </div>
                    <div className="project-score">
                      <span className="score-circle" style={{ background: `linear-gradient(135deg, ${getScoreColor(project.maturityScore).color} 0%, ${getScoreColor(project.maturityScore).color} 100%)` }}>
                        {project.maturityScore}%
                      </span>
                    </div>
                  </div>

                  <div className="project-details">
                    <div className="detail-item">
                      <span>Créé:</span>
                      <strong>{project.createdAt}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Soumis:</span>
                      <strong>{project.submittedAt ? new Date(project.submittedAt).toLocaleDateString('fr-FR') : '-'}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Statut:</span>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(project.evaluationStatus) }}
                      >
                        {getStatusLabel(project.evaluationStatus)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Evaluation Section */}
        {selectedProject && (
          <div className="evaluation-section">
            <div className="evaluation-header">
              <h2>📋 Évaluation du Projet</h2>
              <button className="close-btn" onClick={() => setSelectedProject(null)}>✕</button>
            </div>

            <div className="project-info">
              <h3>{selectedProject.projectName}</h3>
              <p className="author-info">Entrepreneur: {selectedProject.userName}</p>
              <div className="score-display">
                <div className="score-circle-large" style={{ background: `linear-gradient(135deg, ${getScoreColor(selectedProject.maturityScore).color} 0%, ${getScoreColor(selectedProject.maturityScore).color} 100%)` }}>
                  {selectedProject.maturityScore}%
                </div>
                <div className="score-interpretation">
                  {getScoreColor(selectedProject.maturityScore).message}
                </div>
              </div>
            </div>

            {/* Phase Scores */}
            <div className="phase-scores-eval">
              <h4>Scores par Phase</h4>
              <div className="scores-grid">
                {Object.entries(selectedProject.phaseScores).map(([phase, score]) => (
                  <div key={phase} className="phase-score-item">
                    <span className="phase-label">Phase {phase}</span>
                    <div className="score-bar">
                      <div
                        className="score-bar-fill"
                        style={{ width: `${Math.min(score / 2, 100)}%` }}
                      ></div>
                    </div>
                    <span className="score-text">{score}/200</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {selectedProject.recommendations && selectedProject.recommendations.length > 0 && (
              <div className="recommendations">
                <h4>📝 Recommandations</h4>
                <ul>
                  {selectedProject.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Evaluation Form */}
            {selectedProject.evaluationStatus === 'pending' && (
              <div className="evaluation-form">
                <h4>Évaluer ce Projet</h4>

                <div className="form-group">
                  <label>Décision:</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        value="approved"
                        checked={evaluationRating === 'approved'}
                        onChange={(e) => setEvaluationRating(e.target.value as 'approved' | 'rejected')}
                      />
                      ✅ Approuver
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        value="rejected"
                        checked={evaluationRating === 'rejected'}
                        onChange={(e) => setEvaluationRating(e.target.value as 'approved' | 'rejected')}
                      />
                      ❌ Rejeter
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes d'Évaluation:</label>
                  <textarea
                    value={evaluationNotes}
                    onChange={(e) => setEvaluationNotes(e.target.value)}
                    placeholder="Entrez vos notes, suggestions et feedback..."
                    rows={5}
                  />
                </div>

                <button className="btn-evaluate" onClick={handleEvaluateProject}>
                  💾 Enregistrer l'Évaluation
                </button>
              </div>
            )}

            {selectedProject.evaluationStatus !== 'pending' && (
              <div className="evaluation-summary">
                <h4>📋 Évaluation Complétée</h4>
                <div className="summary-item">
                  <span>Décision:</span>
                  <strong>{getStatusLabel(selectedProject.evaluationStatus)}</strong>
                </div>
                <div className="summary-item">
                  <span>Évaluée par:</span>
                  <strong>{selectedProject.evaluatedBy || '-'}</strong>
                </div>
                <div className="summary-item">
                  <span>Date:</span>
                  <strong>
                    {selectedProject.evaluatedAt
                      ? new Date(selectedProject.evaluatedAt).toLocaleDateString('fr-FR')
                      : '-'}
                  </strong>
                </div>
                {selectedProject.evaluationNotes && (
                  <div className="summary-notes">
                    <span>Notes:</span>
                    <p>{selectedProject.evaluationNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
