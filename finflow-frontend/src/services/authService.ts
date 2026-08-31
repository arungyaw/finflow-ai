import { apiRequest } from "./api"

import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
} from "../types/auth";

export function login(request: LoginRequest) {
    return apiRequest<LoginResponse>("/api/users/login", {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export function register(request: RegisterRequest) {
    return apiRequest<void>("/api/users/register", {
        method: "POST",
        body: JSON.stringify(request),
    });
}