const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/database');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/tasks', require('./src/routes/taskRoutes'));

app.get('/', (req, res) => {
  res.send('Task Management API Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
