'use strict';

const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (_req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, slug, title, description
             FROM vocabulary_books
             ORDER BY title ASC`
        );
        return res.json({ books: rows });
    } catch (err) {
        console.error('books list', err);
        return res.status(500).json({ error: 'Could not load vocabulary books.' });
    }
});

router.post('/select', requireAuth, async (req, res) => {
    try {
        const bookId = req.body.bookId;
        const bookSlug = req.body.bookSlug;

        let book;
        if (bookId) {
            const { rows } = await pool.query(
                `SELECT id, slug, title FROM vocabulary_books WHERE id = $1`,
                [bookId]
            );
            book = rows[0];
        } else if (bookSlug) {
            const { rows } = await pool.query(
                `SELECT id, slug, title FROM vocabulary_books WHERE slug = $1`,
                [bookSlug]
            );
            book = rows[0];
        }

        if (!book) {
            return res.status(400).json({ error: 'Please choose a valid vocabulary book.' });
        }

        await pool.query(
            `UPDATE profiles
             SET selected_vocabulary_book_id = $1, updated_at = NOW()
             WHERE user_id = $2`,
            [book.id, req.user.id]
        );

        return res.json({
            user: {
                profile: {
                    selectedBook: { id: book.id, slug: book.slug, title: book.title }
                }
            }
        });
    } catch (err) {
        console.error('books select', err);
        return res.status(500).json({ error: 'Could not save book choice.' });
    }
});

module.exports = router;
