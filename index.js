'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const configRoutes = require('./routes/config');
const presenceRoutes = require('./routes/presence');
const gamesRoutes = require('./routes/games');

const PORT = Number(process.env.PORT) || 3000;
const root = path.join(__dirname, '..');

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('Missing DATABASE_URL in .env');
        process.exit(1);
    }
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
        console.error('Missing or weak JWT_SECRET in .env (min 16 characters)');
        process.exit(1);
    }

    await initDb();

    const app = express();
    app.use(cors({ origin: true }));
    app.use(express.json({ limit: '64kb' }));

    app.use('/api/config', configRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/books', booksRoutes);
    app.use('/api/presence', presenceRoutes);
    app.use('/api/games', gamesRoutes);

    app.get('/api/health', (_req, res) => {
        res.json({ ok: true });
    });

    app.use(express.static(root));

    app.use((req, res) => {
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.sendFile(path.join(root, 'index.html'));
    });

    app.listen(PORT, () => {
        console.log(`Academic Vocabulary running at http://localhost:${PORT}`);
    });
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
