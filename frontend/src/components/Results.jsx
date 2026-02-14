import React from 'react';

function scoreClass(score) {
  if (score >= 70) return 'good';
  if (score >= 40) return 'ok';
  return 'bad';
}

export default function Results({ data, onReset }) {
  const a = data.analysis;

  return (
    <div className="results">
      <div className="match-header">
        <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{a.jobTitle} {a.company !== 'Not specified' ? `@ ${a.company}` : ''}</div>
        <div className={`match-score ${scoreClass(a.matchScore)}`}>{a.matchScore}%</div>
        <div>Match Score</div>
        <div className={`match-verdict ${scoreClass(a.matchScore)}`}>{a.verdict}</div>
      </div>

      {/* Matched Skills */}
      <div className="card">
        <h3>Skills You Have</h3>
        {a.matchedSkills.map((s, i) => (
          <span key={i} className={`skill-tag ${s.level}`}>
            {s.skill}
          </span>
        ))}
      </div>

      {/* Missing Skills */}
      <div className="card">
        <h3>Skills to Develop</h3>
        {a.missingSkills.map((s, i) => (
          <div key={i} className="missing-skill">
            <div>
              <div className="name">{s.skill}</div>
              <div className="meta">{s.difficulty} to learn &middot; ~{s.timeToLearn}</div>
            </div>
            <span className={`importance-badge ${s.importance}`}>{s.importance}</span>
          </div>
        ))}
      </div>

      {/* Learning Path */}
      <div className="card">
        <h3>Learning Path</h3>
        {a.learningPath.map((phase, i) => (
          <div key={i} className="phase-card">
            <h4>Phase {phase.phase}: {phase.title}</h4>
            <div className="duration">{phase.duration}</div>
            <div className="skills-list">Skills: {phase.skills.join(', ')}</div>
            {phase.resources.map((r, j) => (
              <div key={j} className="resource">
                <span className="type">[{r.type}]</span> {r.name} {r.free && <span className="free-badge">FREE</span>}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Quick Wins */}
      <div className="card list-card wins">
        <h3>Quick Wins (Do This Week)</h3>
        <ul>{a.quickWins.map((w, i) => <li key={i}>{w}</li>)}</ul>
      </div>

      {/* Resume Tips */}
      <div className="card list-card tips">
        <h3>Resume Tailoring Tips</h3>
        <ul>{a.resumeTips.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </div>

      <button className="btn-secondary" onClick={onReset}>Analyze Another Job</button>
    </div>
  );
}
