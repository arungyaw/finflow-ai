import { apiRequest } from "./api";

import type {
    Account,
    CreateAccountRequest,
    TransferRequest,
} from "../types/account";

export function getAccounts() {
    return apiRequest<Account[]>("/api/accounts");
}

export function createAccount(request: CreateAccountRequest) {
    return apiRequest<Account>("/api/accounts", {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export function depositToAccount(accountId: number, amount: number) {
    return apiRequest<void>(`/api/accounts/${accountId}/deposit`, {
        method: "POST",
        body: JSON.stringify({
            amount,
        }),
    });
}

export function withdrawFromAccount(
    accountId: number,
    amount: number,
    category: string
) {
    return apiRequest<void>(`/api/accounts/${accountId}/withdraw`, {
        method: "POST",
        body: JSON.stringify({
            amount,
            category,
        }),
    });
}

export function transferBetweenAccounts(
    accountId: number,
    request: TransferRequest
) {
    return apiRequest<void>(`/api/accounts/${accountId}/transfer`, {
        method: "POST",
        body: JSON.stringify(request),
    });
}