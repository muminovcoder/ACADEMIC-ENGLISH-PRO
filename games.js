'use strict';

const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { loadUserPayload, toPublicUser } = require('../lib/userHelpers');
const {
    isRealUserSql,
    realPvpSessionSql,
    pvpWinsSql,
    pvpGamesPlayedSql
} = require('../lib/realUsers');

const router = express.Router();

const ROBOT_REWARDS = 2;
const MULTIPLAYER_WINNER_COINS = 5;
const MULTIPLAYER_LOSER_COINS = 1;

router.post('/play-robot', requireAuth, async (req, res) => {
    try {
        const { difficulty } = req.body;
        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            return res.status(400).json({ error: 'Invalid difficulty' });
        }

        const user = await loadUserPayload(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const session = await pool.query(
            `INSERT INTO game_sessions (player1_id, game_type, status)
             VALUES ($1, 'robot', 'active')
             RETURNING id`,
            [req.user.id]
        );

        return res.json({
            sessionId: session.rows[0].id,
            difficulty,
            startTime: new Date(),
            initialCoins: user.coins
        });
    } catch (err) {
        console.error('play-robot', err);
        return res.status(500).json({ error: 'Could not start robot game' });
    }
});

router.post('/complete-robot', requireAuth, async (req, res) => {
    try {
        const { sessionId, correctCount } = req.body;
        if (typeof correctCount !== 'number' || correctCount < 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const coins = correctCount * ROBOT_REWARDS;
        const sessionIdNum = Number(sessionId);

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            await client.query(
                `UPDATE profiles SET coins = COALESCE(coins, 0) + $1, updated_at = NOW() WHERE user_id = $2`,
                [coins, req.user.id]
            );

            if (Number.isInteger(sessionIdNum) && sessionIdNum > 0) {
                await client.query(
                    `UPDATE game_sessions SET status = 'completed', completed_at = NOW()
                     WHERE id = $1 AND player1_id = $2`,
                    [sessionIdNum, req.user.id]
                );
            }

            await client.query('COMMIT');

            const user = await loadUserPayload(req.user.id);
            return res.json({
                coinsEarned: coins,
                newTotalCoins: user.coins,
                message: `Great! You earned ${coins} coins!`
            });
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('complete-robot', err);
        return res.status(500).json({ error: 'Could not complete robot game' });
    }
});

router.post('/invite-player', requireAuth, async (req, res) => {
    try {
        const { toUserId } = req.body;
        if (!toUserId) return res.status(400).json({ error: 'Target user ID required' });

        if (toUserId === req.user.id) {
            return res.status(400).json({ error: 'Cannot invite yourself' });
        }

        const targetUser = await pool.query(
            `SELECT id FROM users WHERE id = $1`,
            [toUserId]
        );
        if (targetUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const invitation = await pool.query(
            `INSERT INTO game_invitations (from_user_id, to_user_id, status)
             VALUES ($1, $2, 'pending')
             RETURNING id, created_at`,
            [req.user.id, toUserId]
        );

        return res.status(201).json({
            invitationId: invitation.rows[0].id,
            message: 'Invitation sent'
        });
    } catch (err) {
        console.error('invite-player', err);
        return res.status(500).json({ error: 'Could not send invitation' });
    }
});

router.get('/pending-invitations', requireAuth, async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT gi.id, gi.from_user_id, gi.created_at,
                    u.username, u.display_name, u.avatar_url
             FROM game_invitations gi
             JOIN users u ON u.id = gi.from_user_id
             WHERE gi.to_user_id = $1 AND gi.status = 'pending'
             ORDER BY gi.created_at DESC
             LIMIT 50`,
            [req.user.id]
        );

        return res.json({
            invitations: rows.map(row => ({
                id: row.id,
                fromUserId: row.from_user_id,
                fromUsername: row.username,
                fromDisplayName: row.display_name,
                fromAvatarUrl: row.avatar_url,
                createdAt: row.created_at
            }))
        });
    } catch (err) {
        console.error('pending-invitations', err);
        return res.status(500).json({ error: 'Could not fetch invitations' });
    }
});

router.post('/accept-invitation', requireAuth, async (req, res) => {
    try {
        const { invitationId } = req.body;
        if (!invitationId) return res.status(400).json({ error: 'Invitation ID required' });

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const inv = await client.query(
                `SELECT from_user_id, to_user_id, game_session_id FROM game_invitations
                 WHERE id = $1 AND to_user_id = $2 AND status = 'pending'`,
                [invitationId, req.user.id]
            );

            if (inv.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'Invitation not found or already responded' });
            }

            const { from_user_id } = inv.rows[0];

            const session = await client.query(
                `INSERT INTO game_sessions (player1_id, player2_id, game_type, status)
                 VALUES ($1, $2, 'pvp', 'active')
                 RETURNING id`,
                [from_user_id, req.user.id]
            );

            await client.query(
                `UPDATE game_invitations SET status = 'accepted', responded_at = NOW(), game_session_id = $1
                 WHERE id = $2`,
                [session.rows[0].id, invitationId]
            );

            await client.query('COMMIT');

            return res.json({
                gameSessionId: session.rows[0].id,
                opponent: from_user_id,
                message: 'Game started!'
            });
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('accept-invitation', err);
        return res.status(500).json({ error: 'Could not accept invitation' });
    }
});

router.post('/submit-pvp-score', requireAuth, async (req, res) => {
    try {
        const sessionId = Number(req.body.sessionId);
        const correctCount = Number(req.body.correctCount);
        if (!Number.isInteger(sessionId) || sessionId <= 0) {
            return res.status(400).json({ error: 'Session ID required' });
        }
        if (!Number.isInteger(correctCount) || correctCount < 0 || correctCount > 20) {
            return res.status(400).json({ error: 'Invalid score' });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const session = await client.query(
                `SELECT id, player1_id, player2_id, player1_score, player2_score, status, winner_id
                 FROM game_sessions WHERE id = $1 FOR UPDATE`,
                [sessionId]
            );

            if (session.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'Game session not found' });
            }

            const row = session.rows[0];
            const isPlayer1 = req.user.id === row.player1_id;
            const isPlayer2 = req.user.id === row.player2_id;

            if (row.status === 'completed') {
                await client.query('COMMIT');
                const user = await loadUserPayload(req.user.id);
                const won = row.winner_id === req.user.id;
                const draw = row.winner_id === null;
                return res.json({
                    waiting: false,
                    won: draw ? null : won,
                    draw,
                    player1Score: row.player1_score,
                    player2Score: row.player2_score,
                    coinsEarned: 0,
                    newTotalCoins: user.coins
                });
            }

            if (row.status !== 'active') {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: 'Game already finished' });
            }

            if (!isPlayer1 && !isPlayer2) {
                await client.query('ROLLBACK');
                return res.status(403).json({ error: 'Not a player in this game' });
            }

            if (isPlayer1) {
                await client.query(
                    `UPDATE game_sessions SET player1_score = $1 WHERE id = $2`,
                    [correctCount, sessionId]
                );
                row.player1_score = correctCount;
            } else {
                await client.query(
                    `UPDATE game_sessions SET player2_score = $1 WHERE id = $2`,
                    [correctCount, sessionId]
                );
                row.player2_score = correctCount;
            }

            const p1 = isPlayer1 ? correctCount : row.player1_score;
            const p2 = isPlayer2 ? correctCount : row.player2_score;

            let result = { waiting: true };

            if (p1 !== null && p2 !== null) {
                let winnerId;
                if (p1 > p2) winnerId = row.player1_id;
                else if (p2 > p1) winnerId = row.player2_id;
                else winnerId = null;

                if (winnerId) {
                    const loserId = winnerId === row.player1_id ? row.player2_id : row.player1_id;
                    await client.query(
                        `UPDATE profiles SET coins = COALESCE(coins, 0) + $1, updated_at = NOW() WHERE user_id = $2`,
                        [MULTIPLAYER_WINNER_COINS, winnerId]
                    );
                    await client.query(
                        `UPDATE profiles SET coins = COALESCE(coins, 0) + $1, updated_at = NOW() WHERE user_id = $2`,
                        [MULTIPLAYER_LOSER_COINS, loserId]
                    );
                }

                await client.query(
                    `UPDATE game_sessions
                     SET status = 'completed', winner_id = $1, completed_at = NOW()
                     WHERE id = $2`,
                    [winnerId, sessionId]
                );

                const user = await loadUserPayload(req.user.id);
                const won = winnerId === req.user.id;
                const draw = winnerId === null;
                result = {
                    waiting: false,
                    won: draw ? null : won,
                    draw,
                    player1Score: p1,
                    player2Score: p2,
                    coinsEarned: draw ? 0 : won ? MULTIPLAYER_WINNER_COINS : MULTIPLAYER_LOSER_COINS,
                    newTotalCoins: user.coins
                };
            }

            await client.query('COMMIT');
            return res.json(result);
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('submit-pvp-score', err);
        return res.status(500).json({ error: 'Could not submit score' });
    }
});

router.post('/complete-pvp', requireAuth, async (req, res) => {
    try {
        const { sessionId, won } = req.body;
        if (!sessionId || typeof won !== 'boolean') {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const session = await client.query(
                `SELECT player1_id, player2_id FROM game_sessions WHERE id = $1`,
                [sessionId]
            );

            if (session.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'Game session not found' });
            }

            const { player1_id, player2_id } = session.rows[0];
            const isPlayer1 = req.user.id === player1_id;
            const opponentId = isPlayer1 ? player2_id : player1_id;

            const winnerId = won ? req.user.id : opponentId;
            const loser = won ? opponentId : req.user.id;

            await client.query(
                `UPDATE profiles SET coins = coins + $1 WHERE user_id = $2`,
                [MULTIPLAYER_WINNER_COINS, winnerId]
            );

            await client.query(
                `UPDATE profiles SET coins = coins + $1 WHERE user_id = $2`,
                [MULTIPLAYER_LOSER_COINS, loser]
            );

            await client.query(
                `UPDATE game_sessions SET status = 'completed', winner_id = $1, completed_at = NOW()
                 WHERE id = $2`,
                [winnerId, sessionId]
            );

            await client.query('COMMIT');

            const user = await loadUserPayload(req.user.id);
            const coinsEarned = won ? MULTIPLAYER_WINNER_COINS : MULTIPLAYER_LOSER_COINS;

            return res.json({
                coinsEarned,
                newTotalCoins: user.coins,
                message: won
                    ? `You won! Earned ${MULTIPLAYER_WINNER_COINS} coins!`
                    : `Good try! You earned ${MULTIPLAYER_LOSER_COINS} coin.`
            });
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('complete-pvp', err);
        return res.status(500).json({ error: 'Could not complete game' });
    }
});

const ONLINE_WINDOW_SEC = 60;

router.get('/online-users', requireAuth, async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT up.user_id, up.username
             FROM user_presence up
             JOIN users u ON u.id = up.user_id
             WHERE up.last_seen > NOW() - ($2::int * INTERVAL '1 second')
               AND up.user_id != $1
               AND ${isRealUserSql('u')}
             LIMIT 50`,
            [req.user.id, ONLINE_WINDOW_SEC]
        );

        return res.json({
            onlineUsers: rows.map(r => ({ id: r.user_id, username: r.username }))
        });
    } catch (err) {
        console.error('online-users', err);
        return res.status(500).json({ error: 'Could not fetch online users' });
    }
});

/** Host broadcasts "join game" — first online player to accept wins the match */
router.post('/find-match', requireAuth, async (req, res) => {
    try {
        await pool.query(
            `UPDATE game_match_requests SET status = 'cancelled'
             WHERE host_user_id = $1 AND status = 'open'`,
            [req.user.id]
        );

        const { rows } = await pool.query(
            `INSERT INTO game_match_requests (host_user_id, status)
             VALUES ($1, 'open')
             RETURNING id, created_at`,
            [req.user.id]
        );

        return res.status(201).json({
            matchRequestId: rows[0].id,
            message: 'Join game invitation sent to online players'
        });
    } catch (err) {
        console.error('find-match', err);
        return res.status(500).json({ error: 'Could not start match search' });
    }
});

router.get('/open-matches', requireAuth, async (req, res) => {
    try {
        await pool.query(
            `UPDATE game_match_requests SET status = 'cancelled'
             WHERE status = 'open'
               AND created_at < NOW() - INTERVAL '3 minutes'`
        );

        const { rows } = await pool.query(
            `SELECT gmr.id, gmr.host_user_id, gmr.created_at,
                    u.username, u.display_name
             FROM game_match_requests gmr
             JOIN users u ON u.id = gmr.host_user_id
             WHERE gmr.status = 'open'
               AND gmr.host_user_id != $1
               AND ${isRealUserSql('u')}
               AND gmr.created_at > NOW() - INTERVAL '3 minutes'
             ORDER BY gmr.created_at DESC
             LIMIT 20`,
            [req.user.id]
        );

        return res.json({
            matches: rows.map((r) => ({
                id: r.id,
                hostUserId: r.host_user_id,
                hostUsername: r.username,
                hostDisplayName: r.display_name,
                createdAt: r.created_at
            }))
        });
    } catch (err) {
        console.error('open-matches', err);
        return res.status(500).json({ error: 'Could not load match invitations' });
    }
});

router.get('/match-status/:matchRequestId', requireAuth, async (req, res) => {
    try {
        const matchId = Number(req.params.matchRequestId);
        if (!Number.isInteger(matchId) || matchId <= 0) {
            return res.status(400).json({ error: 'Invalid match request' });
        }

        const { rows } = await pool.query(
            `SELECT gmr.id, gmr.status, gmr.host_user_id, gmr.opponent_user_id, gmr.game_session_id,
                    opp.username AS opponent_username
             FROM game_match_requests gmr
             LEFT JOIN users opp ON opp.id = gmr.opponent_user_id
             WHERE gmr.id = $1 AND gmr.host_user_id = $2`,
            [matchId, req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Match request not found' });
        }

        const row = rows[0];
        return res.json({
            status: row.status,
            gameSessionId: row.game_session_id,
            opponentUsername: row.opponent_username
        });
    } catch (err) {
        console.error('match-status', err);
        return res.status(500).json({ error: 'Could not load match status' });
    }
});

router.post('/accept-match', requireAuth, async (req, res) => {
    try {
        const matchRequestId = Number(req.body.matchRequestId);
        if (!Number.isInteger(matchRequestId) || matchRequestId <= 0) {
            return res.status(400).json({ error: 'Match request ID required' });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const match = await client.query(
                `SELECT id, host_user_id, status FROM game_match_requests
                 WHERE id = $1 FOR UPDATE`,
                [matchRequestId]
            );

            if (match.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'Match invitation not found' });
            }

            const row = match.rows[0];
            if (row.status !== 'open') {
                await client.query('ROLLBACK');
                return res.status(409).json({ error: 'This game was already taken by another player' });
            }
            if (row.host_user_id === req.user.id) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: 'You cannot join your own game' });
            }

            const session = await client.query(
                `INSERT INTO game_sessions (player1_id, player2_id, game_type, status)
                 VALUES ($1, $2, 'pvp', 'active')
                 RETURNING id`,
                [row.host_user_id, req.user.id]
            );

            await client.query(
                `UPDATE game_match_requests
                 SET status = 'matched', opponent_user_id = $1, game_session_id = $2, matched_at = NOW()
                 WHERE id = $3`,
                [req.user.id, session.rows[0].id, matchRequestId]
            );

            await client.query('COMMIT');

            return res.json({
                gameSessionId: session.rows[0].id,
                hostUserId: row.host_user_id,
                message: 'Game started!'
            });
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('accept-match', err);
        return res.status(500).json({ error: 'Could not join game' });
    }
});

router.post('/cancel-match', requireAuth, async (req, res) => {
    try {
        const matchRequestId = Number(req.body.matchRequestId);
        if (!Number.isInteger(matchRequestId) || matchRequestId <= 0) {
            return res.status(400).json({ error: 'Match request ID required' });
        }

        await pool.query(
            `UPDATE game_match_requests SET status = 'cancelled'
             WHERE id = $1 AND host_user_id = $2 AND status = 'open'`,
            [matchRequestId, req.user.id]
        );

        return res.json({ ok: true });
    } catch (err) {
        console.error('cancel-match', err);
        return res.status(500).json({ error: 'Could not cancel match' });
    }
});

router.get('/leaderboard', requireAuth, async (req, res) => {
    try {
        const sort = req.query.sort === 'wins' ? 'wins' : 'coins';
        const limit = Math.min(50, Math.max(5, Number(req.query.limit) || 25));

        const orderBy =
            sort === 'wins'
                ? 'pvp_wins DESC, coins DESC, u.username ASC'
                : 'coins DESC, pvp_wins DESC, u.username ASC';

        const { rows } = await pool.query(
            `SELECT
                u.id,
                u.username,
                u.display_name,
                u.avatar_url,
                COALESCE(p.coins, 0) AS coins,
                ${pvpWinsSql('u')} AS pvp_wins,
                ${pvpGamesPlayedSql('u')} AS games_played
             FROM users u
             INNER JOIN profiles p ON p.user_id = u.id
             WHERE ${isRealUserSql('u')}
               AND ${realPvpSessionSql('u')}
             ORDER BY ${orderBy}
             LIMIT $1`,
            [limit]
        );

        const leaders = rows.map((r, i) => ({
            rank: i + 1,
            userId: r.id,
            username: r.username,
            displayName: r.display_name,
            avatarUrl: r.avatar_url,
            coins: r.coins,
            pvpWins: r.pvp_wins,
            gamesPlayed: r.games_played,
            isYou: r.id === req.user.id
        }));

        let myRank = leaders.find((l) => l.isYou) || null;

        if (!myRank) {
            const mine = await pool.query(
                `SELECT
                    u.id,
                    u.username,
                    u.display_name,
                    u.avatar_url,
                    COALESCE(p.coins, 0) AS coins,
                    ${pvpWinsSql('u')} AS pvp_wins,
                    ${pvpGamesPlayedSql('u')} AS games_played
                 FROM users u
                 INNER JOIN profiles p ON p.user_id = u.id
                 WHERE u.id = $1`,
                [req.user.id]
            );

            if (mine.rows.length > 0) {
                const m = mine.rows[0];
                const hasRealPvp = await pool.query(
                    `SELECT 1 FROM users u WHERE u.id = $1 AND ${realPvpSessionSql('u')}`,
                    [req.user.id]
                );

                if (hasRealPvp.rows.length) {
                let rankRes;

                if (sort === 'wins') {
                    rankRes = await pool.query(
                        `SELECT COUNT(*)::int + 1 AS rank
                         FROM users u
                         INNER JOIN profiles p ON p.user_id = u.id
                         WHERE ${isRealUserSql('u')}
                           AND ${realPvpSessionSql('u')}
                           AND u.id != $1
                           AND ${pvpWinsSql('u')} > $2`,
                        [req.user.id, m.pvp_wins]
                    );
                } else {
                    rankRes = await pool.query(
                        `SELECT COUNT(*)::int + 1 AS rank
                         FROM users u
                         INNER JOIN profiles p ON p.user_id = u.id
                         WHERE ${isRealUserSql('u')}
                           AND ${realPvpSessionSql('u')}
                           AND u.id != $1
                           AND COALESCE(p.coins, 0) > $2`,
                        [req.user.id, m.coins]
                    );
                }

                myRank = {
                    rank: rankRes.rows[0]?.rank ?? null,
                    userId: m.id,
                    username: m.username,
                    displayName: m.display_name,
                    avatarUrl: m.avatar_url,
                    coins: m.coins,
                    pvpWins: m.pvp_wins,
                    gamesPlayed: m.games_played,
                    isYou: true
                };
                }
            }
        }

        return res.json({ sort, leaders, myRank });
    } catch (err) {
        console.error('leaderboard', err);
        return res.status(500).json({ error: 'Could not load leaderboard' });
    }
});

module.exports = router;
