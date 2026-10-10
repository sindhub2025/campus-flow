require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const port = Number(process.env.PORT || 5000);

async function start() {
  await connectDB();
  app.listen(port, () => {
    console.log(`CampusFlow API running on port ${port}`);
  });
}

start().catch((error) => {
  console.error('Unable to start server', error);
  process.exit(1);
});
