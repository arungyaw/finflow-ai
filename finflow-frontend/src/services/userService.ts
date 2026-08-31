import { apiRequest } from "./api";
import type { CurrentUser } from "../types/user";

export function getCurrentUser() {
    return apiRequest<CurrentUser>("/api/users/me");
}