(() => {
    const root = document.documentElement;
    const toggle = document.querySelector('[data-theme-toggle]');

    if (!root || !toggle) {
        return;
    }

    document.body.classList.add('js-enabled');

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('site-theme');
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    const iconEl = toggle.querySelector('.theme-toggle__icon');
    const labelEl = toggle.querySelector('.theme-toggle__label');

    const applyTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('site-theme', theme);

        const isDark = theme === 'dark';
        toggle.setAttribute('aria-pressed', String(isDark));

        if (iconEl && labelEl) {
            iconEl.textContent = isDark ? '☀️' : '🌙';
            labelEl.textContent = isDark ? 'Light mode' : 'Dark mode';
        }
    };

    applyTheme(initialTheme);

    toggle.addEventListener('click', () => {
        const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });
})();
