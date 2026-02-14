export async function analyzeSkillGap(jobPosting, userSkills) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobPosting, userSkills }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}
