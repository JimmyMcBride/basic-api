// Set up server 💻
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const TeamsRouter = require('./api/routes/teams');

// Enable .env 💬
require('dotenv').config();

// Made port dynamic for deployment 🚀
const port = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(helmet());

app.use('/api', TeamsRouter);

// Let dev know server is listening 👂
app.listen(port, () => {
  console.log(`\n* Server running on http://localhost:${port} 🚀*\n`);
});
