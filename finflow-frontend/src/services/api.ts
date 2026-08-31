import { getAccessToken, removeAccessToken } from "./authStorage";

const API_BASE_URL = "http://localhost:8080";

type ApiRequestOptions = RequestInit;

export async function apiRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
): Promise<T> {
    const token = getAccessToken();

    const headers = new Headers(options.headers);

    if (!headers.has("Content-Type") && options.body) {
        headers.set("Content-Type", "application/json");
    }

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const isAuthEndpoint =
        endpoint === "/api/users/login" ||
        endpoint === "/api/users/register";

    if (response.status === 401 && !isAuthEndpoint) {
        removeAccessToken();

        if (window.location.pathname !== "/login") {
            window.location.replace("/login");
        }

        throw new Error("Your session has expired. Please sign in again.");
    }

    if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;

        const responseText = await response.text();

        if (responseText) {
            try {
                const errorBody = JSON.parse(responseText);

                if (typeof errorBody === "string") {
                    errorMessage = errorBody;
                } else if (
                    errorBody &&
                    typeof errorBody === "object"
                ) {
                    if (
                        "message" in errorBody &&
                        typeof errorBody.message === "string"
                    ) {
                        errorMessage = errorBody.message;
                    } else if (
                        "error" in errorBody &&
                        typeof errorBody.error === "string"
                    ) {
                        errorMessage = errorBody.error;
                    }
                }
            } catch {
                errorMessage = responseText;
            }
        }

        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}