'use strict';

const jwt = require('jsonwebtoken');
const { pool } = require('../db');

async function loadUserPayload(userId) {
    const { rows } = await pool.query(
        `SELECT u.id, u.username, u.email, u.display_name, u.avatar_url, u.google_id,
                u.created_at,
                p.selected_vocabulary_book_id, p.coins,
                vb.slug AS book_slug,
                vb.title AS book_title
         FROM users u
         JOIN profiles p ON p.user_id = u.id
         LEFT JOIN vocabulary_books vb ON vb.id = p.selected_vocabulary_book_id
         WHERE u.id = $1`,
        [userId]
    );
    return rows[0] || null;
}

function toPublicUser(row) {
    return {
        id: row.id,
        username: row.username,
        email: row.email || null,
        displayName: row.display_name || null,
        avatarUrl: row.avatar_url || null,
        authMethod: row.google_id ? 'google' : 'nickname',
        createdAt: row.created_at,
        profile: {
            coins: row.coins || 0,
            selectedBook: row.selected_vocabulary_book_id
                ? { id: row.selected_vocabulary_book_id, slug: row.book_slug, title: row.book_title }
                : null
        }
    };
}

function signToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

async function uniqueUsername(base) {
    let candidate = base.slice(0, 24);
    if (candidate.length < 3) candidate = ('user_' + candidate).slice(0, 24);

    const { rows } = await pool.query(`SELECT username FROM users WHERE username = $1`, [candidate]);
    if (rows.length === 0) return candidate;

    for (let i = 1; i < 1000; i++) {
        const suffix = String(i);
        const trimmed = candidate.slice(0, 24 - suffix.length) + suffix;
        const check = await pool.query(`SELECT username FROM users WHERE username = $1`, [trimmed]);
        if (check.rows.length === 0) return trimmed;
    }
    return 'user_' + Date.now().toString(36).slice(-8);
}

function usernameFromEmail(email, googleSub) {
    let base = (email?.split('@')[0] || 'user_' + googleSub.slice(0, 8))
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
    if (base.length < 3) base = 'user_' + googleSub.slice(0, 10).replace(/[^a-z0-9]/g, '');
    return base.slice(0, 24);
}

module.exports = { loadUserPayload, toPublicUser, signToken, uniqueUsername, usernameFromEmail };
