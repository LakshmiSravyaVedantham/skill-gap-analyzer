const express = require('express');
const { analyzeGap } = require('../services/ai');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { jobPosting, userSkills } = req.body;

    if (!jobPosting || jobPosting.trim().length < 30) {
      return res.status(400).json({ error: 'Job posting must be at least 30 characters' });
    }
    if (!userSkills || userSkills.trim().length < 20) {
      return res.status(400).json({ error: 'Skills/resume must be at least 20 characters' });
    }

    const analysis = await analyzeGap(jobPosting.trim(), userSkills.trim());
    res.json({ success: true, analysis });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'Failed to analyze' });
  }
});

module.exports = router;
