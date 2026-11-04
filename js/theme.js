// Site-wide theme toggle (persists via localStorage)
(function () {
    const STORAGE_KEY = 'theme';

    // Saved choice wins; otherwise follow the OS setting
    function getTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
