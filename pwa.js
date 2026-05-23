/**
 * PWA install prompt + service worker (Android / iOS home screen)
 */
(function () {
    'use strict';

    let deferredInstall = null;

    function isStandalone() {
        return (
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true
        );
    }

    function isIos() {
        return /iphone|ipad|ipod/i.test(navigator.userAgent);
    }

    function registerSw() {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    function showInstallBar() {
        const bar = document.getElementById('pwaInstallBar');
        if (!bar || isStandalone()) return;

        if (deferredInstall) {
            bar.classList.remove('is-hidden');
            bar.classList.remove('is-ios-hint');
            return;
        }

        if (isIos()) {
            bar.classList.remove('is-hidden');
            bar.classList.add('is-ios-hint');
            const text = bar.querySelector('.pwa-install-text');
            if (text) {
                text.textContent =
                    'iPhone: Share tugmasi → Add to Home Screen — ilova sifatida ochiladi.';
            }
        }
    }

    function hideInstallBar() {
        document.getElementById('pwaInstallBar')?.classList.add('is-hidden');
    }

    function bindInstallUi() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredInstall = e;
            showInstallBar();
        });

        document.getElementById('pwaInstallBtn')?.addEventListener('click', async () => {
            if (!deferredInstall) return;
            deferredInstall.prompt();
            await deferredInstall.userChoice;
            deferredInstall = null;
            hideInstallBar();
        });

        document.getElementById('pwaInstallDismiss')?.addEventListener('click', hideInstallBar);

        window.addEventListener('appinstalled', hideInstallBar);
    }

    document.addEventListener('DOMContentLoaded', () => {
        registerSw();
        bindInstallUi();
        if (!isStandalone()) setTimeout(showInstallBar, 1200);
    });

    window.AppPWA = { isStandalone, isIos };
})();
