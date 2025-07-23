// Auth protection utilities
import { getLocalStorage } from './utils.mjs';
import { isTokenValid } from './auth.mjs';

// Redirect if user is already logged in (for login/signup pages)
export function redirectIfLoggedIn(redirectTo = '/') {
    const token = getLocalStorage('so_token');
    if (token && isTokenValid(token)) {
        window.location.href = redirectTo;
    }
}

// Redirect if user is not logged in (for protected pages)
export function requireAuth(redirectTo = '/login/index.html') {
    const token = getLocalStorage('so_token');
    if (!token || !isTokenValid(token)) {
        const currentPath = window.location.pathname;
        window.location.href = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
    }
}

// Get current user info from token
export function getCurrentUser() {
    const token = getLocalStorage('so_token');
    if (token && isTokenValid(token)) {
        try {
            // Dynamically import jwtDecode to avoid bundling issues
            import('https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/build/esm/index.js')
                .then(module => {
                    const { jwtDecode } = module;
                    return jwtDecode(token);
                })
                .catch(() => null);
        } catch (e) {
            return null;
        }
    }
    return null;
}
