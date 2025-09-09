import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// In-memory users array
const users = [];

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running!' });
});

// Simple user registration route
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  const user = { id: users.length + 1, name, email };
  users.push(user);
  res.status(201).json({ message: 'User created', user });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
