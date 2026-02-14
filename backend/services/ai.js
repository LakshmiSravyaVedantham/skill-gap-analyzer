const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

async function analyzeGap(jobPosting, userSkills) {
  const result = await model.generateContent(`You are a career development expert and skill gap analyst.

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

Be specific and actionable. Return ONLY JSON, no markdown.`);

  const text = result.response.text().trim();
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse AI response');
  }
}

module.exports = { analyzeGap };
