/**

 * Vocabulary Game — Robot & real-player matchmaking

 */

(function () {

    'use strict';



    if (!window.AppAuth) {

        console.error('AppAuth not loaded. Load auth.js before game.js.');

        return;

    }



    const $ = (id) => document.getElementById(id);

    const ROBOT_ROUNDS = 10;

    const PVP_ROUNDS = 5;

    const MATCH_POLL_MS = 2000;

    const INVITE_POLL_MS = 4000;



    let gameWords = [];

    let currentWordIndex = 0;

    let correctCount = 0;

    let robotDifficulty = 'easy';

    let gameSessionId = null;

    let matchRequestId = null;

    let matchPollTimer = null;

    let invitePollTimer = null;

    let pendingMatchInvite = null;

    let pvpSessionId = null;

    let pvpOpponentName = '';

    let isInActiveGame = false;



    function getVocabData() {

        if (typeof VOCAB_DATA !== 'undefined' && Array.isArray(VOCAB_DATA)) return VOCAB_DATA;

        if (Array.isArray(window.VOCAB_DATA)) return window.VOCAB_DATA;

        return [];

    }



    function getWordsByDifficulty(difficulty) {

        const allWords = getVocabData();

        if (!allWords.length) return [];

        const unitCount = allWords.length;

        switch (difficulty) {

            case 'easy':

                return allWords.filter((_, i) => i < unitCount * 0.3);

            case 'medium':

                return allWords.filter((_, i) => i >= unitCount * 0.3 && i < unitCount * 0.7);

            case 'hard':

                return allWords.filter((_, i) => i >= unitCount * 0.7);

            default:

                return allWords;

        }

    }



    function getRandomWords(wordList, count) {

        const shuffled = [...wordList].sort(() => Math.random() - 0.5);

        return shuffled.slice(0, Math.min(count, shuffled.length));

    }



    function seededWords(sessionId, count) {

        const all = getVocabData();

        if (!all.length) return [];

        const seed = sessionId % 9973;

        const sorted = [...all].sort((a, b) => {

            const ha = (a.w.charCodeAt(0) + seed) % 1000;

            const hb = (b.w.charCodeAt(0) + seed) % 1000;

            return ha - hb || a.w.localeCompare(b.w);

        });

        return sorted.slice(0, count);

    }



    function updateUserCoins(newTotal) {

        if (typeof newTotal !== 'number') return;

        window.AppAuth.updateCurrentUser?.({ profile: { coins: newTotal } });

    }



    function showEl(el, visible) {

        if (!el) return;

        el.classList.toggle('is-hidden', !visible);

    }



    let leaderboardSort = 'coins';

    function showGameModeSelect() {

        showEl($('gameModeSelect'), true);

        showEl($('robotGame'), false);

        showEl($('multiplayerGame'), false);

        showEl($('gameLeaderboard'), false);

    }



    function hideGameModeSelect() {

        showEl($('gameModeSelect'), false);

    }



    function openRobotSetup() {

        hideGameModeSelect();

        showEl($('robotGame'), true);

        showEl(document.querySelector('.robot-game-section'), true);

        showEl($('robotGameActive'), false);

        showEl($('robotGameOver'), false);

    }



    async function startRobotGame() {

        const difficultyInput = document.querySelector('input[name="difficulty"]:checked');

        if (difficultyInput) robotDifficulty = difficultyInput.value;



        const wordList = getWordsByDifficulty(robotDifficulty);

        if (!wordList.length) {

            alert('Vocabulary data not loaded. Refresh the page.');

            return;

        }



        const startBtn = $('btnStartRobotGame');

        if (startBtn) startBtn.disabled = true;



        try {

            const start = await window.AppAuth.api('/games/play-robot', {

                method: 'POST',

                body: JSON.stringify({ difficulty: robotDifficulty })

            });

            gameSessionId = start.sessionId;

        } catch (err) {

            alert(err.message || 'Could not start game.');

            if (startBtn) startBtn.disabled = false;

            return;

        } finally {

            if (startBtn) startBtn.disabled = false;

        }



        gameWords = getRandomWords(wordList, ROBOT_ROUNDS);

        currentWordIndex = 0;

        correctCount = 0;

        isInActiveGame = true;



        hideGameModeSelect();

        showEl($('robotGame'), true);

        showEl(document.querySelector('.robot-game-section'), false);

        showEl($('robotGameActive'), true);

        showEl($('robotGameOver'), false);

        showNextRobotWord();

    }



    function showNextRobotWord() {

        if (currentWordIndex >= gameWords.length) {

            endRobotGame();

            return;

        }



        const word = gameWords[currentWordIndex];

        const defEl = $('robotWordDefinition');

        const exEl = $('robotWordExample');

        if (defEl) defEl.textContent = `Definition: ${word.def}`;

        if (exEl) exEl.textContent = word.ex ? `Example: ${word.ex}` : '';



        const input = $('robotAnswerInput');

        if (input) {

            input.value = '';

            input.focus();

        }

        const feedback = $('robotFeedback');

        if (feedback) {

            feedback.textContent = '';

            feedback.classList.remove('feedback-correct', 'feedback-wrong');

        }



        const scoreEl = $('robotScore');

        const coinsEl = $('robotCoins');

        if (scoreEl) scoreEl.textContent = `Score: ${correctCount}/${gameWords.length}`;

        if (coinsEl) coinsEl.textContent = `Coins: ${correctCount * 2}`;

    }



    function checkRobotAnswer() {

        const input = ($('robotAnswerInput')?.value || '').trim().toLowerCase();

        const word = gameWords[currentWordIndex];

        const isCorrect = input === word.w.toLowerCase();

        const feedback = $('robotFeedback');

        if (!feedback) return;



        if (isCorrect) {

            correctCount++;

            feedback.textContent = `✓ Correct! +2 coins — "${word.w}"`;

            feedback.classList.add('feedback-correct');

            feedback.classList.remove('feedback-wrong');

        } else {

            feedback.textContent = `✗ Wrong. Answer: "${word.w}"`;

            feedback.classList.add('feedback-wrong');

            feedback.classList.remove('feedback-correct');

        }



        currentWordIndex++;

        setTimeout(showNextRobotWord, 1500);

    }



    async function endRobotGame() {

        showEl($('robotGameActive'), false);

        showEl($('robotGameOver'), true);



        const coinsEarned = correctCount * 2;

        const finalScore = $('robotFinalScore');

        const totalCoins = $('robotTotalCoins');

        if (finalScore) {

            finalScore.textContent = `You got ${correctCount} out of ${gameWords.length} correct!`;

        }

        if (totalCoins) totalCoins.textContent = `Total coins earned: ${coinsEarned}`;



        try {

            const response = await window.AppAuth.api('/games/complete-robot', {

                method: 'POST',

                body: JSON.stringify({ sessionId: gameSessionId, correctCount })

            });

            if (totalCoins) {

                totalCoins.textContent = `You earned ${response.coinsEarned} coins! Total: ${response.newTotalCoins}`;

            }

            updateUserCoins(response.newTotalCoins);

        } catch (err) {

            console.error('complete-robot', err);

        }

        gameSessionId = null;

        isInActiveGame = false;

    }



    function quitRobotGame() {

        showEl($('robotGame'), false);

        gameSessionId = null;

        isInActiveGame = false;

        showGameModeSelect();

    }



    function playAgain() {

        showEl(document.querySelector('.robot-game-section'), true);

        showEl($('robotGameActive'), false);

        showEl($('robotGameOver'), false);

        gameSessionId = null;

    }



    function openMultiplayerLobby() {

        hideGameModeSelect();

        showEl($('multiplayerGame'), true);

        showEl($('mpWaitingRoom'), true);

        showEl($('mpGameActive'), false);

        showEl($('mpGameOver'), false);



        const status = $('mpWaitingStatus');

        if (status) status.textContent = '';

        const cancelBtn = $('btnCancelMatch');

        if (cancelBtn) cancelBtn.disabled = true;



        window.AppAuth.api('/games/online-users')

            .then((r) => {

                const n = (r.onlineUsers || []).length;

                const el = $('mpOnlineCount');

                if (el) el.textContent = n ? `${n} learner(s) online now` : 'No other players online right now';

            })

            .catch(() => {});

    }



    async function findOpponent() {

        const status = $('mpWaitingStatus');

        const findBtn = $('btnFindOpponent');

        const cancelBtn = $('btnCancelMatch');



        if (findBtn) findBtn.disabled = true;

        if (status) status.textContent = 'Sending Join game to online players…';



        try {

            const res = await window.AppAuth.api('/games/find-match', { method: 'POST' });

            matchRequestId = res.matchRequestId;

            if (cancelBtn) cancelBtn.disabled = false;

            if (status) status.textContent = 'Waiting for a player to accept…';

            startMatchPolling();

        } catch (err) {

            if (status) status.textContent = err.message || 'Could not send invitation';

        } finally {

            if (findBtn) findBtn.disabled = false;

        }

    }



    function startMatchPolling() {

        stopMatchPolling();

        matchPollTimer = setInterval(pollMatchStatus, MATCH_POLL_MS);

        pollMatchStatus();

    }



    function stopMatchPolling() {

        if (matchPollTimer) {

            clearInterval(matchPollTimer);

            matchPollTimer = null;

        }

    }



    async function pollMatchStatus() {

        if (!matchRequestId) return;

        try {

            const res = await window.AppAuth.api(`/games/match-status/${matchRequestId}`);

            if (res.status === 'matched' && res.gameSessionId) {

                stopMatchPolling();

                matchRequestId = null;

                const cancelBtn = $('btnCancelMatch');

                if (cancelBtn) cancelBtn.disabled = true;

                startPvpGame(res.gameSessionId, res.opponentUsername || 'Player');

            } else if (res.status === 'cancelled') {

                stopMatchPolling();

                matchRequestId = null;

                const status = $('mpWaitingStatus');

                if (status) status.textContent = 'Match cancelled.';

            }

        } catch {

            /* retry */

        }

    }



    async function cancelMatch() {

        if (!matchRequestId) return;

        try {

            await window.AppAuth.api('/games/cancel-match', {

                method: 'POST',

                body: JSON.stringify({ matchRequestId })

            });

        } catch {

            /* ignore */

        }

        stopMatchPolling();

        matchRequestId = null;

        const cancelBtn = $('btnCancelMatch');

        if (cancelBtn) cancelBtn.disabled = true;

        const status = $('mpWaitingStatus');

        if (status) status.textContent = 'Cancelled.';

    }



    function startPvpGame(sessionId, opponentName) {

        pvpSessionId = sessionId;

        pvpOpponentName = opponentName;

        isInActiveGame = true;

        hideJoinBanner();

        gameWords = seededWords(sessionId, PVP_ROUNDS);

        currentWordIndex = 0;

        correctCount = 0;



        showEl($('mpWaitingRoom'), false);

        showEl($('mpGameActive'), true);

        showEl($('mpGameOver'), false);



        const opp = $('mpOpponent');

        if (opp) opp.textContent = `vs. @${opponentName}`;

        showNextPvpWord();

    }



    function showNextPvpWord() {

        if (currentWordIndex >= gameWords.length) {

            endPvpGame();

            return;

        }



        const word = gameWords[currentWordIndex];

        const defEl = $('mpWordDefinition');

        if (defEl) defEl.textContent = `Definition: ${word.def}`;



        const input = $('mpAnswerInput');

        if (input) {

            input.value = '';

            input.focus();

        }

        const feedback = $('mpFeedback');

        if (feedback) {

            feedback.textContent = '';

            feedback.classList.remove('feedback-correct', 'feedback-wrong');

        }



        const scoreEl = $('mpScore');

        if (scoreEl) scoreEl.textContent = `Your score: ${correctCount}/${gameWords.length}`;

    }



    function checkPvpAnswer() {

        const input = ($('mpAnswerInput')?.value || '').trim().toLowerCase();

        const word = gameWords[currentWordIndex];

        const isCorrect = input === word.w.toLowerCase();

        const feedback = $('mpFeedback');

        if (!feedback) return;



        if (isCorrect) {

            correctCount++;

            feedback.textContent = `✓ Correct! "${word.w}"`;

            feedback.classList.add('feedback-correct');

            feedback.classList.remove('feedback-wrong');

        } else {

            feedback.textContent = `✗ Wrong. Answer: "${word.w}"`;

            feedback.classList.add('feedback-wrong');

            feedback.classList.remove('feedback-correct');

        }



        currentWordIndex++;

        setTimeout(showNextPvpWord, 1500);

    }



    async function endPvpGame() {

        showEl($('mpGameActive'), false);

        showEl($('mpGameOver'), true);



        const title = $('mpResultTitle');

        const msg = $('mpResultMessage');

        const coins = $('mpResultCoins');



        if (title) title.textContent = 'Submitting score…';

        if (msg) msg.textContent = 'Waiting for opponent…';

        if (coins) coins.textContent = '';



        try {

            const res = await window.AppAuth.api('/games/submit-pvp-score', {

                method: 'POST',

                body: JSON.stringify({ sessionId: pvpSessionId, correctCount })

            });



            if (res.waiting) {

                if (title) title.textContent = 'Score submitted';

                if (msg) msg.textContent = `You: ${correctCount}/${gameWords.length}. Waiting for @${pvpOpponentName}…`;

                pollPvpResult();

                return;

            }



            showPvpResult(res);

        } catch (err) {

            if (title) title.textContent = 'Error';

            if (msg) msg.textContent = err.message || 'Could not submit score';

        }

    }



    function pollPvpResult() {

        let attempts = 0;

        const timer = setInterval(async () => {

            attempts++;

            if (attempts > 30) {

                clearInterval(timer);

                return;

            }

            try {

                const res = await window.AppAuth.api('/games/submit-pvp-score', {

                    method: 'POST',

                    body: JSON.stringify({ sessionId: pvpSessionId, correctCount })

                });

                if (!res.waiting) {

                    clearInterval(timer);

                    showPvpResult(res);

                }

            } catch {

                /* retry */

            }

        }, 2500);

    }



    function showPvpResult(res) {

        const title = $('mpResultTitle');

        const msg = $('mpResultMessage');

        const coinsEl = $('mpResultCoins');



        if (res.draw) {

            if (title) title.textContent = 'Draw!';

            if (msg) {

                msg.textContent = `Both scored ${res.player1Score} — ${res.player2Score}.`;

            }

        } else if (res.won) {

            if (title) title.textContent = 'You won! 🎉';

            if (msg) msg.textContent = `You beat @${pvpOpponentName}! (+5 coins)`;

        } else {

            if (title) title.textContent = 'You lost';

            if (msg) msg.textContent = `@${pvpOpponentName} won this round.`;

        }



        if (coinsEl && typeof res.coinsEarned === 'number' && res.coinsEarned > 0) {

            coinsEl.textContent = `+${res.coinsEarned} coins · Total: ${res.newTotalCoins}`;

        } else if (coinsEl && typeof res.newTotalCoins === 'number') {

            coinsEl.textContent = `Total: ${res.newTotalCoins} coins`;

        }

        if (typeof res.newTotalCoins === 'number') updateUserCoins(res.newTotalCoins);

        pvpSessionId = null;

        isInActiveGame = false;

    }



    function startInvitePolling() {

        if (invitePollTimer) return;

        invitePollTimer = setInterval(pollOpenMatches, INVITE_POLL_MS);

        pollOpenMatches();

    }



    function stopInvitePolling() {

        if (invitePollTimer) {

            clearInterval(invitePollTimer);

            invitePollTimer = null;

        }

    }



    async function pollOpenMatches() {

        if (!window.AppAuth?.isLoggedIn?.() || isInActiveGame || pvpSessionId) return;

        if ($('gameView')?.classList.contains('is-active') && matchRequestId) return;

        try {

            const { matches } = await window.AppAuth.api('/games/open-matches');

            if (!matches?.length) {

                hideJoinBanner();

                return;

            }

            const m = matches[0];

            pendingMatchInvite = m;

            showJoinBanner(m);

        } catch {

            /* ignore */

        }

    }



    function showJoinBanner(match) {

        const banner = $('joinGameBanner');

        const text = $('joinGameBannerText');

        if (!banner || !text) return;

        const label = match.hostDisplayName || match.hostUsername;

        text.textContent =
            `@${match.hostUsername} sizni Vocabulary Game ga taklif qilmoqda. Qabul qilsangiz, birga o‘ynaysiz.`;

        banner.classList.remove('is-hidden');

        banner.dataset.matchId = String(match.id);

    }



    function hideJoinBanner() {

        $('joinGameBanner')?.classList.add('is-hidden');

        pendingMatchInvite = null;

    }



    async function acceptJoinGame() {

        const match = pendingMatchInvite;

        if (!match) return;



        const acceptBtn = $('btnJoinGameAccept');

        if (acceptBtn) acceptBtn.disabled = true;



        try {

            const res = await window.AppAuth.api('/games/accept-match', {

                method: 'POST',

                body: JSON.stringify({ matchRequestId: match.id })

            });

            hideJoinBanner();

            openGame();

            startPvpGame(res.gameSessionId, match.hostUsername);

        } catch (err) {

            alert(err.message || 'Could not join game');

        } finally {

            if (acceptBtn) acceptBtn.disabled = false;

        }

    }



    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function rankMedal(rank) {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return String(rank);
    }

    function renderLeaderboardRow(entry, sort) {
        const name = escapeHtml(entry.displayName || entry.username);
        const stat =
            sort === 'wins'
                ? `<span class="lb-stat">${entry.pvpWins} wins</span>`
                : `<span class="lb-stat">💰 ${entry.coins}</span>`;
        const youClass = entry.isYou ? ' is-you' : '';
        const initial = (entry.username || '?').charAt(0).toUpperCase();
        const avatar = entry.avatarUrl
            ? `<img src="${escapeHtml(entry.avatarUrl)}" alt="" width="40" height="40" class="lb-avatar-img">`
            : `<span class="lb-avatar">${initial}</span>`;

        return `<li class="leaderboard-item${youClass}">
            <span class="lb-rank">${rankMedal(entry.rank)}</span>
            ${avatar}
            <div class="lb-info">
                <span class="lb-name">@${escapeHtml(entry.username)}${entry.isYou ? ' <em>(you)</em>' : ''}</span>
                <span class="lb-meta">${entry.gamesPlayed} games · 💰 ${entry.coins} · ⚔️ ${entry.pvpWins}</span>
            </div>
            ${stat}
        </li>`;
    }

    async function loadLeaderboard(sort) {
        leaderboardSort = sort || leaderboardSort;
        const list = $('leaderboardList');
        const status = $('leaderboardStatus');
        const myRankEl = $('leaderboardMyRank');

        if (!list) return;

        document.querySelectorAll('.leaderboard-tab').forEach((tab) => {
            const active = tab.dataset.sort === leaderboardSort;
            tab.classList.toggle('is-active', active);
            tab.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        if (status) status.textContent = 'Loading leaderboard…';
        list.innerHTML = '';
        myRankEl?.classList.add('is-hidden');

        try {
            const data = await window.AppAuth.api(
                '/games/leaderboard?sort=' + encodeURIComponent(leaderboardSort)
            );
            const leaders = data.leaders || [];

            if (!leaders.length) {
                if (status) {
                    status.textContent =
                        'Hali haqiqiy PvP o‘yinchilar yo‘q. Real o‘yinchi bilan o‘ynang — shundan keyin bu yerda chiqasiz.';
                }
                return;
            }

            if (status) {
                status.textContent =
                    leaderboardSort === 'wins'
                        ? `Top ${leaders.length} — PvP g‘alabalari bo‘yicha`
                        : `Top ${leaders.length} — tangalar bo‘yicha`;
            }

            list.innerHTML = leaders
                .map((e) => renderLeaderboardRow(e, leaderboardSort))
                .join('');

            if (data.myRank && !leaders.some((l) => l.isYou)) {
                myRankEl.innerHTML =
                    `<p class="lb-my-label">Sizning o‘rningiz:</p>${renderLeaderboardRow(data.myRank, leaderboardSort)}`;
                myRankEl.classList.remove('is-hidden');
            } else if (data.myRank?.isYou) {
                myRankEl.innerHTML = `<p class="lb-my-label">Sizning o‘rningiz: <strong>#${data.myRank.rank}</strong></p>`;
                myRankEl.classList.remove('is-hidden');
            }
        } catch (err) {
            if (status) status.textContent = err.message || 'Leaderboard yuklanmadi.';
        }
    }

    function openLeaderboard() {
        hideGameModeSelect();
        showEl($('gameLeaderboard'), true);
        loadLeaderboard(leaderboardSort);
        window.scrollTo(0, 0);
    }

    function initGameUI() {

        $('btnPlayRobot')?.addEventListener('click', openRobotSetup);

        $('btnPlayMultiplayer')?.addEventListener('click', openMultiplayerLobby);

        $('btnOpenLeaderboard')?.addEventListener('click', openLeaderboard);

        $('btnLeaderboardBack')?.addEventListener('click', () => {
            showEl($('gameLeaderboard'), false);
            showGameModeSelect();
        });

        document.querySelectorAll('.leaderboard-tab').forEach((tab) => {
            tab.addEventListener('click', () => loadLeaderboard(tab.dataset.sort));
        });



        $('btnStartRobotGame')?.addEventListener('click', startRobotGame);

        $('btnSubmitAnswer')?.addEventListener('click', checkRobotAnswer);

        $('robotAnswerInput')?.addEventListener('keypress', (e) => {

            if (e.key === 'Enter') checkRobotAnswer();

        });

        $('btnQuitRobot')?.addEventListener('click', quitRobotGame);

        $('btnPlayAgain')?.addEventListener('click', playAgain);

        $('btnBackToModes')?.addEventListener('click', () => {

            showEl($('robotGame'), false);

            showGameModeSelect();

        });



        $('btnFindOpponent')?.addEventListener('click', findOpponent);

        $('btnCancelMatch')?.addEventListener('click', cancelMatch);

        $('btnBackToModes2')?.addEventListener('click', () => {

            cancelMatch();

            showEl($('multiplayerGame'), false);

            showGameModeSelect();

        });

        $('btnMpSubmitAnswer')?.addEventListener('click', checkPvpAnswer);

        $('mpAnswerInput')?.addEventListener('keypress', (e) => {

            if (e.key === 'Enter') checkPvpAnswer();

        });

        $('btnPlayMultiplayerAgain')?.addEventListener('click', () => {

            showEl($('mpGameOver'), false);

            openMultiplayerLobby();

        });

        $('btnBackToHome')?.addEventListener('click', () => {

            reset();

            window.App?.goHome?.();

        });



        $('btnJoinGameAccept')?.addEventListener('click', acceptJoinGame);

        $('btnJoinGameDismiss')?.addEventListener('click', hideJoinBanner);

    }



    function openGame() {

        if (!window.AppAuth?.isLoggedIn()) return;



        $('homeView')?.classList.add('is-hidden');

        $('progressView')?.classList.remove('is-active');

        $('progressView')?.classList.add('is-hidden');

        $('vocabView')?.classList.remove('is-active');

        $('grammarView')?.classList.remove('is-active');

        $('gameView')?.classList.remove('is-hidden');

        $('gameView')?.classList.add('is-active');

        document.title = 'Vocabulary Game';



        showGameModeSelect();

        window.scrollTo(0, 0);

    }



    function onLogin() {

        startInvitePolling();

    }



    function onLogout() {

        stopInvitePolling();

        reset();

    }



    function resetGameUI() {

        stopMatchPolling();

        hideJoinBanner();

        cancelMatch().catch(() => {});

        matchRequestId = null;

        pvpSessionId = null;

        gameSessionId = null;

        isInActiveGame = false;

        showEl($('robotGame'), false);

        showEl($('multiplayerGame'), false);

        showEl($('robotGameActive'), false);

        showEl($('robotGameOver'), false);

        showEl($('mpGameActive'), false);

        showEl($('mpGameOver'), false);

        showEl($('gameModeSelect'), false);

        showEl($('gameLeaderboard'), false);

    }



    function reset() {

        resetGameUI();

        stopInvitePolling();

    }



    window.GameModule = {

        openGame,

        init: initGameUI,

        onLogin,

        onLogout,

        reset: resetGameUI

    };

})();


