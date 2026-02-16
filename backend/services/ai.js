const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';

async function callAI(prompt) {
  if (GROQ_API_KEY) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: 'You are a world-class career advisor, skill gap analyst, and technical recruiter with 20 years of experience. You provide extremely detailed, actionable analysis. Always return valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4096
      }),
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
  catch {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
    throw new Error('Failed to parse AI response');
  }
}

async function analyzeGap(jobPosting, userSkills) {
  const text = await callAI(`You are a world-class career development expert, technical recruiter, and skill gap analyst.

=== JOB POSTING ===
${jobPosting}

=== CANDIDATE CURRENT SKILLS / RESUME ===
${userSkills}

Perform an exhaustive skill gap analysis. Return ONLY valid JSON (no markdown, no code fences) with this EXACT structure:

{
  "jobTitle": "<extracted job title>",
  "company": "<extracted company or Not specified>",
  "matchScore": 75,
  "verdict": "<Ready to Apply|Almost Ready|Need More Preparation|Significant Gap>",

  "matchedSkills": [
    {
      "skill": "<skill name>",
      "level": "<strong|moderate|basic>",
      "currentProficiency": "<advanced|intermediate|beginner>",
      "targetProficiency": "<advanced|intermediate|beginner>",
      "note": "<how this skill relates to the job>"
    }
  ],

  "missingSkills": [
    {
      "skill": "<skill name>",
      "importance": "<critical|important|nice-to-have>",
      "priorityScore": 8,
      "difficulty": "<easy|medium|hard>",
      "timeToLearn": "<e.g. 2 weeks>",
      "currentProficiency": "none",
      "targetProficiency": "<advanced|intermediate|beginner>",
      "salaryImpact": "<estimated annual salary increase in USD if this skill is acquired, e.g. +5000-10000>",
      "industryDemand": "<very high|high|moderate|low>",
      "demandTrend": "<rising|stable|declining>",
      "portfolioProject": "<a specific project idea to demonstrate this skill>"
    }
  ],

  "salaryAnalysis": {
    "estimatedRangeWithCurrentSkills": "<e.g. 80000-95000>",
    "estimatedRangeWithAllSkills": "<e.g. 110000-130000>",
    "potentialIncrease": "<e.g. +25000-35000>",
    "topPayingSkills": ["<skill that adds most salary value>", "<next>", "<next>"]
  },

  "candidateComparison": {
    "strengthsVsTypical": ["<what makes this candidate stand out>"],
    "weaknessesVsTypical": ["<where this candidate falls behind typical applicants>"],
    "competitiveEdge": "<brief summary of how candidate compares to top applicants for this role>"
  },

  "quickWins": [
    {
      "action": "<specific action to take>",
      "timeRequired": "<e.g. 2 hours, 1 day>",
      "impact": "<high|medium|low>"
    }
  ],

  "learningRoadmap": [
    {
      "week": "<e.g. Week 1-2>",
      "phase": 1,
      "title": "<phase title>",
      "focusSkills": ["<skill>"],
      "dailyHours": 2,
      "milestones": ["<what you should be able to do by end of this phase>"],
      "resources": [
        {
          "name": "<specific course/tutorial/book name>",
          "url": "<actual URL if possible, otherwise empty string>",
          "type": "<course|tutorial|book|project|video|documentation>",
          "platform": "<e.g. freeCodeCamp, Coursera, YouTube, MDN, etc.>",
          "free": true,
          "estimatedHours": 10
        }
      ]
    }
  ],

  "portfolioProjects": [
    {
      "title": "<project name>",
      "description": "<what to build>",
      "skillsDemonstrated": ["<skill>"],
      "difficulty": "<beginner|intermediate|advanced>",
      "estimatedTime": "<e.g. 1 week>",
      "techStack": ["<technology>"]
    }
  ],

  "resumeTips": ["<actionable tip to improve resume for this specific role>"],

  "interviewPrep": [
    "<likely interview question or topic for this role>"
  ]
}

IMPORTANT INSTRUCTIONS:
- Be extremely specific with resource recommendations - use real course names, real platforms
- For salary figures, use realistic market data for this role
- Priority scores should reflect how critical each skill is for getting hired
- Quick wins should be things achievable in under a week
- The learning roadmap should be week-by-week for 4-8 weeks
- Portfolio projects should be impressive enough to discuss in interviews
- Compare against what a strong candidate for this specific role looks like
- Return ONLY the JSON object, no other text`);

  return parseJSON(text);
}

module.exports = { analyzeGap };
