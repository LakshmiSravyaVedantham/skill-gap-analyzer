import React, { useState } from 'react';
import Results from './components/Results';
import { analyzeSkillGap } from './utils/api';

export default function App() {
  const [jobPosting, setJobPosting] = useState('');
  const [userSkills, setUserSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await analyzeSkillGap(jobPosting, userSkills);
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setResults(null);
    setError('');
  };

  const canSubmit = jobPosting.trim().length >= 30 && userSkills.trim().length >= 20 && !loading;

  if (results) {
    return (
      <div className="app">
        <header className="header">
          <h1>Skill Gap Analyzer</h1>
          <p>Your personalized bridge to your dream job</p>
        </header>
        <Results data={results} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Skill Gap Analyzer</h1>
        <p>Paste a job posting + your skills. See exactly what you need to learn.</p>
      </header>

      {error && (
        <div style={{ background: 'rgba(248,81,73,0.1)', padding: '1rem', borderRadius: '10px', marginBottom: '1rem', textAlign: 'center', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      <div className="input-section">
        <h3>Job Posting</h3>
        <textarea
          placeholder="Paste the full job description here..."
          value={jobPosting}
          onChange={(e) => setJobPosting(e.target.value)}
        />
      </div>

      <div className="input-section">
        <h3>Your Skills / Resume</h3>
        <textarea
          placeholder="Paste your resume, list your skills, or describe your experience..."
          value={userSkills}
          onChange={(e) => setUserSkills(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
          <p style={{ color: 'var(--text-dim)' }}>Analyzing your skill gap...</p>
        </div>
      ) : (
        <button className="btn-primary" disabled={!canSubmit} onClick={handleAnalyze}>
          Analyze My Gap
        </button>
      )}
    </div>
  );
}
