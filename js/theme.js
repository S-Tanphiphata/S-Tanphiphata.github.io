// Site-wide theme toggle (persists via localStorage)
(function () {
    const STORAGE_KEY = 'theme';

    function getTheme() {
        return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
    }

    function updateToggleUI(theme) {
        const btn = document.querySelector('.theme-toggle');
        if (!btn) return;

        const isDark = theme === 'dark';
        btn.setAttribute('aria-pressed', String(isDark));
        btn.setAttribute(
            'aria-label',
            isDark ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }

    function setTheme(theme) {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }

        localStorage.setItem(STORAGE_KEY, theme);
        updateToggleUI(theme);
    }

    function initThemeToggle() {
        const btn = document.querySelector('.theme-toggle');
        if (!btn) return;

        updateToggleUI(getTheme());

        btn.addEventListener('click', function () {
            setTheme(getTheme() === 'dark' ? 'light' : 'dark');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeToggle);
    } else {
        initThemeToggle();
    }
})();
