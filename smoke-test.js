'use strict';

const BASE = process.env.API_BASE || 'http://localhost:3000';

async function req(path, options = {}) {
    const res = await fetch(BASE + '/api' + path, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    const body = await res.json().catch(() => ({}));
    return { status: res.status, body };
}

async function main() {
    const errors = [];

    const health = await req('/health');
    if (!health.body.ok) errors.push('health failed');

    const user = ('smoke_' + Date.now().toString(36)).slice(0, 24);
    const join = await req('/auth/join', {
        method: 'POST',
        body: JSON.stringify({ username: user })
    });
    if (join.status !== 201 && join.status !== 200) {
        console.error('FAILED:\njoin: ' + join.status + ' ' + (join.body.error || ''));
        process.exit(1);
    }
    const token = join.body.token;
    if (!token) {
        console.error('FAILED:\njoin missing token');
        process.exit(1);
    }

    const auth = { Authorization: 'Bearer ' + token };

    const me = await req('/auth/me', { headers: auth });
    if (me.status !== 200 || me.body.user?.profile?.coins === undefined) {
        errors.push('me missing coins');
    }

    const books = await req('/books', { headers: auth });
    if (!books.body.books?.length) errors.push('books empty');

    const bookId = books.body.books[0]?.id;
    if (!bookId) errors.push('books: no book id');
    const select = await req('/books/select', {
        method: 'POST',
        headers: auth,
        body: JSON.stringify({ bookId: Number(bookId) })
    });
    if (select.status !== 200 || !select.body.user?.profile?.selectedBook) {
        errors.push('books/select: ' + select.status + ' ' + (select.body.error || '') + ' bookId=' + bookId);
    }

    const robot = await req('/games/play-robot', {
        method: 'POST',
        headers: auth,
        body: JSON.stringify({ difficulty: 'easy' })
    });
    if (robot.status !== 200) errors.push('play-robot');

    const done = await req('/games/complete-robot', {
        method: 'POST',
        headers: auth,
        body: JSON.stringify({ sessionId: robot.body.sessionId, correctCount: 3 })
    });
    if (done.status !== 200 || done.body.coinsEarned !== 6) {
        errors.push('complete-robot: ' + done.status + ' coins=' + done.body.coinsEarned);
    }

    const match = await req('/games/find-match', { method: 'POST', headers: auth });
    if (match.status !== 201) errors.push('find-match');

    const open = await req('/games/open-matches', { headers: auth });
    if (open.status !== 200) errors.push('open-matches');

    const lb = await req('/games/leaderboard', { headers: auth });
    if (lb.status !== 200 || !Array.isArray(lb.body.leaders)) errors.push('leaderboard');

    if (match.body.matchRequestId) {
        await req('/games/cancel-match', {
            method: 'POST',
            headers: auth,
            body: JSON.stringify({ matchRequestId: match.body.matchRequestId })
        });
    }

    if (errors.length) {
        console.error('FAILED:\n' + errors.join('\n'));
        process.exit(1);
    }
    console.log('All smoke tests passed');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
