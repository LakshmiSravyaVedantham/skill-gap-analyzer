import React, { useState } from "react";

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
        {(a.matchedSkills||[]).map((s, i) => (
          <span key={i} className={`skill-tag ${s.level}`}>
            {s.skill}{s.currentProficiency?" ("+s.currentProficiency+")":""}
          </span>
        ))}
      </div>

      {/* Missing Skills */}
      <div className="card">
        <h3>Skills to Develop</h3>
        {(a.missingSkills||[]).map((s, i) => (
          <div key={i} className="missing-skill">
            <div>
              <div className="name">{s.skill} {s.priorityScore && <span className="priority-score">P{s.priorityScore}/10</span>}</div>
              <div className="meta">{s.difficulty} to learn &middot; ~{s.timeToLearn}{s.industryDemand && <span className="demand-tag"> &middot; {s.industryDemand} demand{s.demandTrend==="rising"?" ↑":s.demandTrend==="declining"?" ↓":""}</span>}</div>
              {s.salaryImpact && <div className="salary-inline">Salary impact: {s.salaryImpact}</div>}
              {s.portfolioProject && <div className="portfolio-inline">Project: {s.portfolioProject}</div>}
            </div>
            <span className={`importance-badge ${s.importance}`}>{s.importance}</span>
          </div>
        ))}
      </div>

      {/* Learning Path */}
      <div className="card">
        <h3>Learning Path</h3>
        {(a.learningRoadmap||a.learningPath||[]).map((phase, i) => (
          <div key={i} className="phase-card">
            <h4>Phase {phase.phase}: {phase.title}</h4>
            <div className="duration">{phase.week||phase.duration}</div>
            <div className="skills-list">Skills: {(phase.focusSkills||phase.skills||[]).join(', ')}</div>
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
        <ul>{(a.quickWins||[]).map((w, i) => { const item = typeof w==="string"?{action:w}:w; return <li key={i}>{item.action}{item.timeRequired?" ("+item.timeRequired+")":""}{item.impact?" - "+item.impact+" impact":""}</li>; })}</ul>
      </div>

      {/* Resume Tips */}
      <div className="card list-card tips">
        <h3>Resume Tailoring Tips</h3>
        <ul>{(a.resumeTips||[]).map((t, i) => <li key={i}>{t}</li>)}</ul>
      </div>

      {/* Candidate Comparison */}
      {a.candidateComparison && (
        <div className="card comparison-card">
          <h3>How You Compare</h3>
          <p className="comp-edge">{a.candidateComparison.competitiveEdge}</p>
          <div className="comp-grid">
            <div className="comp-col good">
              <h4>Your Strengths</h4>
              <ul>{(a.candidateComparison.strengthsVsTypical||[]).map((s,i)=><li key={i}>{s}</li>)}</ul>
            </div>
            <div className="comp-col warn">
              <h4>Areas to Improve</h4>
              <ul>{(a.candidateComparison.weaknessesVsTypical||[]).map((w,i)=><li key={i}>{w}</li>)}</ul>
            </div>
          </div>
        </div>
      )}

      {/* Salary Analysis */}
      {a.salaryAnalysis && (
        <div className="card salary-card">
          <h3>Salary Impact Analysis</h3>
          <div className="salary-grid">
            <div className="salary-box"><div className="sal-label">Current Skills</div><div className="sal-value">{a.salaryAnalysis.estimatedRangeWithCurrentSkills}</div></div>
            <div className="salary-arrow">{"→"}</div>
            <div className="salary-box target"><div className="sal-label">With All Skills</div><div className="sal-value">{a.salaryAnalysis.estimatedRangeWithAllSkills}</div></div>
          </div>
          <div className="sal-increase">Potential increase: <strong>{a.salaryAnalysis.potentialIncrease}</strong></div>
          {a.salaryAnalysis.topPayingSkills && <div className="top-skills"><strong>Highest-value skills:</strong> {a.salaryAnalysis.topPayingSkills.join(", ")}</div>}
        </div>
      )}

      {a.portfolioProjects&&a.portfolioProjects.length>0&&(
        <div className={"card"}>
          <h3>Portfolio Projects</h3>
          {a.portfolioProjects.map((p,i)=><div key={i} className={"project-item"}><strong>{p.title}</strong><p>{p.description}</p><div>{p.estimatedTime} | {p.difficulty}</div></div>)}
        </div>
      )}

      {a.interviewPrep&&a.interviewPrep.length>0&&(
        <div className={"card list-card tips"}>
          <h3>Interview Preparation</h3>
          <ul>{a.interviewPrep.map((q,i)=><li key={i}>{q}</li>)}</ul>
        </div>
      )}

      <button className="btn-secondary" onClick={onReset}>Analyze Another Job</button>
    </div>
  );
}
