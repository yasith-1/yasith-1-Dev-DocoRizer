/**
 * Application configuration
 */
export const CONFIG = {
    API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    APP_NAME: 'DevDoc',
    VERSION: '1.0.0',
    AUTH_TOKEN_KEY: 'auth_token',
    AUTH_USER_KEY: 'auth_user',
};
