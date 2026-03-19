/**
 * Application configuration
 */
const getApiUrl = () => {
    // 1. If we are on the production live domain, ALWAYS force the production backend
    // because Dockerfile might have incorrectly baked 'localhost:5001' into VITE_API_URL
    if (window.location.hostname === 'yasith-1-dev-docorizer-production.up.railway.app') {
        return 'https://dev-doc-backend-production.up.railway.app/api';
    }

    // 2. Otherwise use the env variable if provided AND valid for the current environment
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // 3. Fallback to localhost
    return 'http://localhost:5001/api';
};

export const CONFIG = {
    API_BASE_URL: getApiUrl(),
    APP_NAME: 'DevDoc',
    VERSION: '1.0.0',
    AUTH_TOKEN_KEY: 'auth_token',
    AUTH_USER_KEY: 'auth_user',
};
