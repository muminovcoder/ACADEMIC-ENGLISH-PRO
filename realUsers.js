'use strict';

const TEST_USERNAME_RE = '^(smoke_|dbg_|smk_|regtest|testuser|newuser)';

/** SQL: true when `alias` is a real learner (not automated / test accounts). */
function isRealUserSql(alias = 'u') {
    return `${alias}.username !~ '${TEST_USERNAME_RE}'`;
}

/** Completed PvP where both players are real accounts. */
function realPvpSessionSql(userAlias = 'u') {
    return `EXISTS (
        SELECT 1
        FROM game_sessions gs
        INNER JOIN users p1 ON p1.id = gs.player1_id
        INNER JOIN users p2 ON p2.id = gs.player2_id
        WHERE gs.game_type = 'pvp'
          AND gs.status = 'completed'
          AND gs.player2_id IS NOT NULL
          AND (${userAlias}.id = gs.player1_id OR ${userAlias}.id = gs.player2_id)
          AND p1.username !~ '${TEST_USERNAME_RE}'
          AND p2.username !~ '${TEST_USERNAME_RE}'
    )`;
}

/** PvP wins vs another real player only. */
function pvpWinsSql(userAlias = 'u') {
    return `COALESCE((
        SELECT COUNT(*)::int
        FROM game_sessions gs
        INNER JOIN users opp ON opp.id = CASE
            WHEN gs.player1_id = ${userAlias}.id THEN gs.player2_id
            ELSE gs.player1_id
        END
        WHERE gs.game_type = 'pvp'
          AND gs.status = 'completed'
          AND gs.winner_id = ${userAlias}.id
          AND gs.player2_id IS NOT NULL
          AND opp.username !~ '${TEST_USERNAME_RE}'
          AND ${isRealUserSql(userAlias)}
    ), 0)`;
}

/** Completed real PvP games played (not robot). */
function pvpGamesPlayedSql(userAlias = 'u') {
    return `COALESCE((
        SELECT COUNT(*)::int
        FROM game_sessions gs
        INNER JOIN users p1 ON p1.id = gs.player1_id
        INNER JOIN users p2 ON p2.id = gs.player2_id
        WHERE gs.game_type = 'pvp'
          AND gs.status = 'completed'
          AND gs.player2_id IS NOT NULL
          AND (${userAlias}.id = gs.player1_id OR ${userAlias}.id = gs.player2_id)
          AND p1.username !~ '${TEST_USERNAME_RE}'
          AND p2.username !~ '${TEST_USERNAME_RE}'
    ), 0)`;
}

module.exports = {
    TEST_USERNAME_RE,
    isRealUserSql,
    realPvpSessionSql,
    pvpWinsSql,
    pvpGamesPlayedSql
};
