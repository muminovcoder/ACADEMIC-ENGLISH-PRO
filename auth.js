/**
 * Nickname entry, profile, vocabulary book selection
 */
(function () {
    'use strict';

    const TOKEN_KEY = 'av_token';
    const DEFAULT_API = 'http://localhost:3000';

    let currentUser = null;
    let onReadyCallback = null;
    let apiBase = '';
    let serverOnline = false;

    const $ = (id) => document.getElementById(id);

    function resolveApiBase() {
        const meta = document.querySelector('meta[name="api-base"]');
        if (meta?.content?.trim()) {
            return meta.content.trim().replace(/\/$/, '');
        }
        if (window.location.protocol === 'file:') {
            return DEFAULT_API;
        }
        if (
            window.location.port &&
            window.location.port !== '3000' &&
            window.location.hostname === 'localhost'
        ) {
            return DEFAULT_API;
        }
        return '';
    }

    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    function setToken(token) {
        if (token) localStorage.setItem(TOKEN_KEY, token);
        else localStorage.removeItem(TOKEN_KEY);
    }

    function networkErrorMessage() {
        return (
            "Serverga ulanib bo'lmadi (Failed to fetch). " +
            'Terminalda loyiha papkasida `npm install` keyin `npm start` ishga tushiring, ' +
            "so'ng brauzerda http://localhost:3000 oching. " +
            "index.html faylini to'g'ridan-to'g'ri ochmang."
        );
    }

    async function fetchPublic(path) {
        let res;
        try {
            res = await fetch(apiBase + '/api' + path, { method: 'GET' });
        } catch {
            throw new Error(networkErrorMessage());
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Request failed');
        return data;
    }

    async function api(path, options = {}) {
        const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
        const token = getToken();
        if (token) headers.Authorization = 'Bearer ' + token;

        let res;
        try {
            res = await fetch(apiBase + '/api' + path, { ...options, headers });
        } catch {
            throw new Error(networkErrorMessage());
        }

        let data = {};
        try {
            data = await res.json();
        } catch {
            data = {};
        }

        if (!res.ok) {
            const err = new Error(data.error || 'Request failed');
            err.status = res.status;
            throw err;
        }
        return data;
    }

    async function checkServer() {
        apiBase = resolveApiBase();
        try {
            const res = await fetch(apiBase + '/api/health', { method: 'GET' });
            serverOnline = res.ok;
            return res.ok ? await fetch(apiBase + '/api/config').then((r) => r.json()) : {};
        } catch {
            serverOnline = false;
            return {};
        }
    }

    function showServerBanner(show) {
        const el = $('serverBanner');
        if (!el) return;
        el.classList.toggle('is-hidden', !show);
    }

    function mergeUser(base, patch) {
        if (!patch) return base;
        return {
            ...base,
            ...patch,
            profile: {
                ...(base.profile || {}),
                ...(patch.profile || {}),
                coins:
                    patch.profile?.coins !== undefined
                        ? patch.profile.coins
                        : base.profile?.coins ?? 0,
                selectedBook:
                    patch.profile?.selectedBook !== undefined
                        ? patch.profile.selectedBook
                        : base.profile?.selectedBook
            }
        };
    }

    function updateCurrentUser(patch) {
        if (!currentUser) return currentUser;
        currentUser = mergeUser(currentUser, patch);
        updateProfileBar();
        return currentUser;
    }

    async function refreshCurrentUser() {
        if (!getToken()) return null;
        try {
            const data = await api('/auth/me');
            currentUser = data.user;
            updateProfileBar();
            return currentUser;
        } catch {
            return currentUser;
        }
    }

    function showAuthError(msg) {
        const el = $('authError');
        if (!el) return;
        el.textContent = msg || '';
        el.classList.toggle('is-visible', Boolean(msg));
    }

    function hideAppViews() {
        $('vocabView')?.classList.remove('is-active');
        $('grammarView')?.classList.remove('is-active');
        $('gameView')?.classList.remove('is-active');
        $('gameView')?.classList.add('is-hidden');
        $('progressView')?.classList.remove('is-active');
        $('progressView')?.classList.add('is-hidden');
        $('joinGameBanner')?.classList.add('is-hidden');
    }

    function showAuthView() {
        $('authView')?.classList.remove('is-hidden');
        $('homeView')?.classList.add('is-hidden');
        hideAppViews();
        window.GameModule?.reset?.();
    }

    function updateProfileBar() {
        const bar = $('profileBar');
        if (!bar || !currentUser) return;
        bar.classList.remove('is-hidden');

        const avatarEl = $('profileAvatar');
        const name = currentUser.displayName || currentUser.username;
        const initial = (name || '?').charAt(0).toUpperCase();

        if (currentUser.avatarUrl && avatarEl) {
            avatarEl.innerHTML = `<img src="${escapeAttr(currentUser.avatarUrl)}" alt="" width="44" height="44">`;
            avatarEl.classList.add('has-image');
        } else if (avatarEl) {
            avatarEl.textContent = initial;
            avatarEl.classList.remove('has-image');
        }

        $('profileName').textContent = '@' + currentUser.username;
        $('profileMeta') && ($('profileMeta').textContent = '');

        const book = currentUser.profile?.selectedBook;
        $('profileBook').textContent = book ? book.title : 'No vocabulary book selected yet';

        const coins = currentUser.profile?.coins || 0;
        const coinsEl = $('profileCoins');
        if (coinsEl) {
            coinsEl.textContent = `💰 Coins: ${coins}`;
        }
    }

    function showAppHome() {
        $('authView')?.classList.add('is-hidden');
        $('homeView')?.classList.remove('is-hidden');
        hideAppViews();
        showServerBanner(false);
        updateProfileBar();
        window.AppPresence?.onLogin?.();
        if (window.GameModule?.init) window.GameModule.init();
        if (window.GameModule?.onLogin) window.GameModule.onLogin();
        if (onReadyCallback) onReadyCallback(currentUser);
    }

    function applySession(data) {
        setToken(data.token);
        currentUser = data.user;
        showAppHome();
        return currentUser;
    }

    async function tryRestoreSession() {
        const token = getToken();
        if (!token) {
            showAuthView();
            return false;
        }
        try {
            const data = await api('/auth/me');
            currentUser = data.user;
            showAppHome();
            return true;
        } catch {
            setToken(null);
            currentUser = null;
            showAuthView();
            return false;
        }
    }

    async function joinWithNickname(username) {
        return applySession(
            await api('/auth/join', {
                method: 'POST',
                body: JSON.stringify({ username })
            })
        );
    }

    function logout() {
        window.GameModule?.onLogout?.();
        window.AppPresence?.onLogout?.();
        setToken(null);
        currentUser = null;
        $('profileBar')?.classList.add('is-hidden');
        showAuthView();
        $('authForm')?.reset();
        showAuthError('');
        $('authUsername')?.focus();
        if (!serverOnline) showServerBanner(true);
    }

    function openBookModal(books) {
        return new Promise((resolve, reject) => {
            const modal = $('bookModal');
            const list = $('bookModalList');
            if (!modal || !list) {
                reject(new Error('Book modal not found'));
                return;
            }

            list.innerHTML = books
                .map(
                    (b) => `
                <label class="book-option">
                    <input type="radio" name="vocabBook" value="${b.id}" data-slug="${escapeAttr(b.slug)}">
                    <span class="book-option-inner">
                        <span class="book-option-title">${escapeHtml(b.title)}</span>
                        <span class="book-option-desc">${escapeHtml(b.description || '')}</span>
                    </span>
                </label>`
                )
                .join('');

            const first = list.querySelector('input[type="radio"]');
            if (first) first.checked = true;

            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');

            const onConfirm = async () => {
                const selected = list.querySelector('input[name="vocabBook"]:checked');
                const modalErr = $('bookModalError');
                if (!selected) {
                    modalErr.textContent = 'Please select a vocabulary book.';
                    modalErr.classList.add('is-visible');
                    return;
                }
                modalErr.textContent = '';
                modalErr.classList.remove('is-visible');
                $('bookModalConfirm').disabled = true;
                try {
                    const data = await api('/books/select', {
                        method: 'POST',
                        body: JSON.stringify({
                            bookId: Number(selected.value),
                            bookSlug: selected.dataset.slug
                        })
                    });
                    currentUser = mergeUser(currentUser, data.user);
                    updateProfileBar();
                    closeModal();
                    resolve(currentUser.profile.selectedBook);
                } catch (err) {
                    modalErr.textContent = err.message;
                    modalErr.classList.add('is-visible');
                } finally {
                    $('bookModalConfirm').disabled = false;
                }
            };

            const closeModal = () => {
                modal.classList.remove('is-open');
                modal.setAttribute('aria-hidden', 'true');
            };

            const onCancel = () => {
                closeModal();
                reject(new Error('cancelled'));
            };

            $('bookModalConfirm').addEventListener('click', onConfirm, { once: true });
            $('bookModalCancel')?.addEventListener('click', onCancel, { once: true });
        });
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escapeAttr(s) {
        return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    }

    async function ensureVocabularyBook() {
        if (currentUser?.profile?.selectedBook) {
            return currentUser.profile.selectedBook;
        }
        const { books } = await api('/books');
        if (!books?.length) {
            throw new Error('No vocabulary books available.');
        }
        return openBookModal(books);
    }

    function normalizeUsername(raw) {
        return String(raw || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '');
    }

    function bindAuthUi() {
        $('authForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            showAuthError('');

            if (!serverOnline) {
                await checkServer();
                if (!serverOnline) {
                    showAuthError(networkErrorMessage());
                    return;
                }
            }

            const username = normalizeUsername($('authUsername').value);

            if (username.length < 3 || username.length > 24) {
                showAuthError('Nickname: 3–24 belgi, faqat harf, raqam va pastki chiziq.');
                return;
            }
            if (!/^[a-z0-9_]{3,24}$/.test(username)) {
                showAuthError('Nickname: 3–24 belgi, faqat harf, raqam va pastki chiziq.');
                return;
            }

            $('authUsername').value = username;
            $('authSubmit').disabled = true;
            try {
                await joinWithNickname(username);
            } catch (err) {
                showAuthError(err.message || 'Xatolik yuz berdi. Qayta urinib ko‘ring.');
            } finally {
                $('authSubmit').disabled = false;
            }
        });

        $('btnLogout')?.addEventListener('click', logout);
    }

    async function init(onReady) {
        onReadyCallback = onReady;
        bindAuthUi();

        await checkServer();
        if (!serverOnline) {
            showServerBanner(true);
            showAuthView();
            return;
        }

        await tryRestoreSession();
    }

    window.AppAuth = {
        init,
        api,
        fetchPublic,
        getApiBase: () => apiBase,
        getUser: () => currentUser,
        updateCurrentUser,
        refreshCurrentUser,
        ensureVocabularyBook,
        logout,
        isLoggedIn: () => Boolean(currentUser && getToken()),
        isServerOnline: () => serverOnline
    };
})();
