'use strict';

/**
 * Remove automated test accounts (smoke_, dbg_, etc.) from the database.
 * Run: node scripts/cleanup-test-users.js
 */

require('dotenv').config();
const { pool } = require('../server/db');

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('Missing DATABASE_URL in .env');
        process.exit(1);
    }

    const { rows } = await pool.query(
        `DELETE FROM users
         WHERE username ~ '^(smoke_|dbg_|smk_|regtest|testuser|newuser)'
         RETURNING id, username`
    );

    console.log(`Removed ${rows.length} test account(s).`);
    for (const r of rows) {
        console.log(`  - ${r.username} (#${r.id})`);
    }

    await pool.end();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
