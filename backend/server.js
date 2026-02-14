const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const analyzeRoutes = require('./routes/analyze');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api/analyze', analyzeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'skill-gap-analyzer' });
});

app.listen(PORT, () => {
  console.log(`Skill Gap Analyzer API running on port ${PORT}`);
});
