import express from 'express';
import cors from 'cors';
import { auth } from './lib/db';

const app = express();
app.use(cors());
app.use(express.json());

// Authentication endpoints
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await auth.register(name, email, password);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await auth.login(email, password);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(401).json({ success: false, error: (error as Error).message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});