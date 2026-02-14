const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.AI_MODEL || 'llama3.2:3b';

async function callAI(prompt) {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt, stream: false }),
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = await res.json();
  return data.response;
}

function parseJSON(text) {
  try {
    return JSON.parse(text.trim());
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse AI response');
  }
}

async function analyzeGap(jobPosting, userSkills) {
  const text = await callAI(`You are a career development expert and skill gap analyst.

JOB POSTING:
${jobPosting}

CANDIDATE'S CURRENT SKILLS/RESUME:
${userSkills}

Analyze the gap between what the job requires and what the candidate has. Return ONLY valid JSON:
{
  "jobTitle": "<extracted job title>",
  "company": "<extracted company or 'Not specified'>",
  "matchScore": <1-100>,
  "matchedSkills": [
    { "skill": "<skill name>", "level": "<strong|moderate|basic>", "note": "<brief note>" }
  ],
  "missingSkills": [
    { "skill": "<skill name>", "importance": "<critical|important|nice-to-have>", "difficulty": "<easy|medium|hard>", "timeToLearn": "<e.g., 2 weeks, 1 month>" }
  ],
  "learningPath": [
    {
      "phase": 1,
      "title": "<phase title>",
      "duration": "<e.g., 1-2 weeks>",
      "skills": ["<skill 1>", "<skill 2>"],
      "resources": [
        { "name": "<resource name>", "type": "<course|book|tutorial|project>", "free": true }
      ]
    }
  ],
  "quickWins": ["<something they can do this week to strengthen their application>"],
  "resumeTips": ["<specific tip to tailor their resume for this job>"],
  "verdict": "<Ready to Apply|Almost Ready|Need More Preparation|Significant Gap>"
}

Be specific and actionable. Return ONLY JSON, no markdown, no explanation.`);

  return parseJSON(text);
}

module.exports = { analyzeGap };
