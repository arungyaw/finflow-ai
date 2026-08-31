import { apiRequest } from "./api";

import type {
    Beneficiary,
    BeneficiaryTransferRequest,
    CreateBeneficiaryRequest,
} from "../types/beneficiary";

export function getBeneficiaries() {
    return apiRequest<Beneficiary[]>("/api/beneficiaries");
}

export function createBeneficiary(request: CreateBeneficiaryRequest) {
    return apiRequest<Beneficiary>("/api/beneficiaries", {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export function deleteBeneficiary(beneficiaryId: number) {
    return apiRequest<void>(`/api/beneficiaries/${beneficiaryId}`, {
        method: "DELETE",
    });
}

export function transferToBeneficiary(
    accountId: number,
    request: BeneficiaryTransferRequest
) {
    return apiRequest<void>(
        `/api/accounts/${accountId}/transfer/beneficiary`,
        {
            method: "POST",
            body: JSON.stringify(request),
        }
    );
}