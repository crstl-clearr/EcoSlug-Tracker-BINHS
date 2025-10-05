// EcoSlug Tracker - Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme();
        this.systemPreference = this.getSystemPreference();
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Initialize theme on load
        this.applyTheme(this.currentTheme);
        
        // Listen for system theme changes
        this.mediaQuery.addEventListener('change', (e) => {
            this.systemPreference = e.matches ? 'dark' : 'light';
            if (this.currentTheme === 'system') {
                this.applyTheme('system');
            }
        });
    }

    // Get stored theme preference or default to 'system'
    getStoredTheme() {
        return localStorage.getItem('theme') || 'system';
    }

    // Get system color scheme preference
    getSystemPreference() {
        return this.mediaQuery.matches ? 'dark' : 'light';
    }

    // Apply theme to document
    applyTheme(theme) {
        const root = document.documentElement;
        
        // Remove existing theme attributes
        root.removeAttribute('data-theme');
        
        switch (theme) {
            case 'light':
                root.setAttribute('data-theme', 'light');
                break;
            case 'dark':
                root.setAttribute('data-theme', 'dark');
                break;
            case 'system':
                // Let CSS handle system preference via @media query
                // Don't set data-theme attribute, let :root handle it
                break;
            default:
                theme = 'system';
                break;
        }
        
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { 
                theme: theme,
                actualTheme: this.getActualTheme()
            }
        }));
    }

    // Get the actual theme being displayed (resolves 'system' to 'light' or 'dark')
    getActualTheme() {
        if (this.currentTheme === 'system') {
            return this.systemPreference;
        }
        return this.currentTheme;
    }

    // Set theme
    setTheme(theme) {
        if (['light', 'dark', 'system'].includes(theme)) {
            this.applyTheme(theme);
            return true;
        }
        return false;
    }

    // Get current theme setting
    getTheme() {
        return this.currentTheme;
    }

    // Get available themes
    getAvailableThemes() {
        return [
            { value: 'light', label: 'Light', icon: '☀️' },
            { value: 'dark', label: 'Dark', icon: '🌙' },
            { value: 'system', label: 'System', icon: '💻' }
        ];
    }

    // Toggle between light and dark (skip system for quick toggle)
    toggleTheme() {
        const actualTheme = this.getActualTheme();
        this.setTheme(actualTheme === 'light' ? 'dark' : 'light');
    }

    // Get theme display info
    getThemeInfo() {
        const themes = this.getAvailableThemes();
        const currentTheme = themes.find(t => t.value === this.currentTheme);
        const actualTheme = themes.find(t => t.value === this.getActualTheme());
        
        return {
            current: currentTheme,
            actual: actualTheme,
            isSystemControlled: this.currentTheme === 'system'
        };
    }
}

// Create global theme manager instance
const themeManager = new ThemeManager();

// Expose to global scope for use in other files
window.themeManager = themeManager;
