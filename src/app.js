import express from 'express';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

let users = [];

function validateUserId(req, res, next) {
    const { id } = req.params;
    if (!uuidValidate(id)) {
        return res.status(400).json({ message: 'Invalid userId' });
    }
    next();
}

app.get('/api/users', (req, res) => {
    res.status(200).json(users);
});

app.get('/api/users/:id', validateUserId, (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
});

app.post('/api/users', (req, res) => {
    const { username, age, hobbies } = req.body;
    if (!username || age === undefined || !hobbies) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if (typeof username !== 'string' || typeof age !== 'number' || !Array.isArray(hobbies) || hobbies.some(h => typeof h !== 'string')) {
        return res.status(400).json({ message: 'Invalid field types' });
    }
    const newUser = { id: uuidv4(), username, age, hobbies };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.put('/api/users/:id', validateUserId, (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
    const { username, age, hobbies } = req.body;
    if (!username || age === undefined || !hobbies) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if (typeof username !== 'string' || typeof age !== 'number' || !Array.isArray(hobbies) || hobbies.some(h => typeof h !== 'string')) {
        return res.status(400).json({ message: 'Invalid field types' });
    }
    users[userIndex] = { ...users[userIndex], username, age, hobbies };
    res.status(200).json(users[userIndex]);
});

app.delete('/api/users/:id', validateUserId, (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
    users.splice(userIndex, 1);
    res.sendStatus(204);
});

app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

export default app;
