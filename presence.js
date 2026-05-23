/**
 * Online users counter + heartbeat
 */
(function () {
    'use strict';

    const HEARTBEAT_MS = 25000;
    const POLL_MS = 12000;

    let heartbeatTimer = null;
    let pollTimer = null;
    let lastCount = null;

    function widgets() {
        return document.querySelectorAll('[data-online-widget]');
    }

    function renderCount(count, loading) {
        widgets().forEach((el) => {
            const num = el.querySelector('[data-online-count]');
            const label = el.querySelector('[data-online-label]');
            if (num) {
                if (loading) {
                    num.textContent = '—';
                    el.classList.add('is-loading');
                } else {
                    num.textContent = String(count);
                    el.classList.remove('is-loading');
                    if (lastCount !== null && count !== lastCount) {
                        el.classList.remove('is-pulse');
                        void el.offsetWidth;
                        el.classList.add('is-pulse');
                    }
                }
            }
            if (label) {
                label.textContent =
                    count === 1 ? 'learner online now' : 'learners online now';
            }
            el.setAttribute(
                'aria-label',
                loading ? 'Loading online count' : count + ' learners online'
            );
        });
        lastCount = count;
    }

    async function fetchOnline() {
        if (!window.AppAuth?.fetchPublic) return;
        try {
            const data = await window.AppAuth.fetchPublic('/presence/online');
            renderCount(data.online ?? 0, false);
        } catch {
            if (lastCount !== null) renderCount(lastCount, false);
        }
    }

    async function sendHeartbeat() {
        if (!window.AppAuth?.isLoggedIn?.()) return;
        try {
            const data = await window.AppAuth.api('/presence/heartbeat', { method: 'POST' });
            if (typeof data.online === 'number') renderCount(data.online, false);
        } catch {
            /* ignore */
        }
    }

    async function goOffline() {
        if (!window.AppAuth?.isLoggedIn?.()) return;
        try {
            await window.AppAuth.api('/presence/offline', { method: 'POST' });
        } catch {
            /* ignore */
        }
    }

    function startPolling() {
        fetchOnline();
        clearInterval(pollTimer);
        pollTimer = setInterval(fetchOnline, POLL_MS);
    }

    function startHeartbeat() {
        sendHeartbeat();
        clearInterval(heartbeatTimer);
        heartbeatTimer = setInterval(() => {
            if (document.visibilityState === 'visible') sendHeartbeat();
        }, HEARTBEAT_MS);
    }

    function stopHeartbeat() {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
    }

    function onLogin() {
        startPolling();
        startHeartbeat();
    }

    function onLogout() {
        goOffline();
        stopHeartbeat();
        startPolling();
    }

    function init() {
        renderCount(0, true);
        startPolling();
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && window.AppAuth?.isLoggedIn?.()) {
                sendHeartbeat();
                fetchOnline();
            }
        });
        window.addEventListener('pagehide', () => {
            if (window.AppAuth?.isLoggedIn?.()) goOffline();
        });
    }

    document.addEventListener('DOMContentLoaded', init);

    window.AppPresence = { refresh: fetchOnline, onLogin, onLogout };
})();
