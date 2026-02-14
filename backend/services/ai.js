const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';

async function callAI(prompt) {
  if (GROQ_API_KEY) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({ model: GROQ_MODEL, messages: [{ role: 'user', content: prompt }], temperature: 0.7 }),
    });
    if (res.ok) { const data = await res.json(); return data.choices[0].message.content; }
    console.warn('Groq failed, falling back to Ollama...');
  }
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
  });
  if (!res.ok) throw new Error('Both Groq and Ollama failed. Set GROQ_API_KEY or start Ollama.');
  return (await res.json()).response;
}

function parseJSON(text) {
  try { return JSON.parse(text.trim()); }
  catch { const m = text.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]); throw new Error('Failed to parse AI response'); }
}

async function analyzeGap(jobPosting, userSkills) {
  const text = await callAI(`You are a career development expert and skill gap analyst.

JOB POSTING:
${jobPosting}

CANDIDATE'S CURRENT SKILLS/RESUME:
${userSkills}

Analyze the gap. Return ONLY valid JSON:
{
  "jobTitle": "<extracted job title>",
  "company": "<extracted company or 'Not specified'>",
  "matchScore": <1-100>,
  "matchedSkills": [{"skill":"<name>","level":"<strong|moderate|basic>","note":"<note>"}],
  "missingSkills": [{"skill":"<name>","importance":"<critical|important|nice-to-have>","difficulty":"<easy|medium|hard>","timeToLearn":"<e.g. 2 weeks>"}],
  "learningPath": [{"phase":1,"title":"<title>","duration":"<duration>","skills":["<skill>"],"resources":[{"name":"<name>","type":"<course|book|tutorial|project>","free":true}]}],
  "quickWins": ["<action>"],
  "resumeTips": ["<tip>"],
  "verdict": "<Ready to Apply|Almost Ready|Need More Preparation|Significant Gap>"
}

Return ONLY JSON, no markdown.`);
  return parseJSON(text);
}

module.exports = { analyzeGap };
