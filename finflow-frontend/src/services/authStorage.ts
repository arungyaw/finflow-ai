const ACCESS_TOKEN_KEY = "access_token";

export function saveAccessToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function isAuthenticated() {
    return Boolean(getAccessToken());
}

