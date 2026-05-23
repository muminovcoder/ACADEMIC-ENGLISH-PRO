'use strict';

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('localhost')
        ? false
        : { rejectUnauthorized: true }
});

async function initDb() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(24) NOT NULL,
            password_hash VARCHAR(255),
            google_id VARCHAR(255),
            email VARCHAR(255),
            display_name VARCHAR(255),
            avatar_url TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            CONSTRAINT users_username_unique UNIQUE (username)
        );

        CREATE TABLE IF NOT EXISTS vocabulary_books (
            id SERIAL PRIMARY KEY,
            slug VARCHAR(64) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            CONSTRAINT vocabulary_books_slug_unique UNIQUE (slug)
        );

        CREATE TABLE IF NOT EXISTS profiles (
            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            username VARCHAR(24) NOT NULL,
            selected_vocabulary_book_id INTEGER REFERENCES vocabulary_books(id),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);

    await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
        ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
    `);

    await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS users_google_id_unique
        ON users (google_id) WHERE google_id IS NOT NULL;
    `);

    await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
        ON users (email) WHERE email IS NOT NULL;
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS user_presence (
            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            username VARCHAR(24) NOT NULL,
            last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS user_presence_last_seen_idx ON user_presence (last_seen);
    `);

    await pool.query(`
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0;
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS game_sessions (
            id SERIAL PRIMARY KEY,
            player1_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            player2_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            game_type VARCHAR(32) NOT NULL,
            status VARCHAR(32) NOT NULL DEFAULT 'pending',
            winner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            completed_at TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS game_sessions_status_idx ON game_sessions (status);
    `);

    await pool.query(`
        ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS player1_score INTEGER;
        ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS player2_score INTEGER;
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS game_invitations (
            id SERIAL PRIMARY KEY,
            from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            to_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            game_session_id INTEGER REFERENCES game_sessions(id) ON DELETE CASCADE,
            status VARCHAR(32) NOT NULL DEFAULT 'pending',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            responded_at TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS game_invitations_to_user_idx ON game_invitations (to_user_id, status);
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS game_match_requests (
            id SERIAL PRIMARY KEY,
            host_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            opponent_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            game_session_id INTEGER REFERENCES game_sessions(id) ON DELETE SET NULL,
            status VARCHAR(32) NOT NULL DEFAULT 'open',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            matched_at TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS game_match_requests_status_idx ON game_match_requests (status, created_at);
    `);

    const books = [
        [
            'ielts-advanced',
            'Vocabulary for IELTS Advanced',
            'Units 1–10 — academic vocabulary for IELTS Advanced learners.'
        ],
        [
            'academic-essentials',
            'Academic English Essentials',
            'Core academic words for university writing and exams.'
        ]
    ];
    for (const book of books) {
        await pool.query(
            `INSERT INTO vocabulary_books (slug, title, description)
             VALUES ($1, $2, $3)
             ON CONFLICT (slug) DO NOTHING`,
            book
        );
    }
}

module.exports = { pool, initDb };
