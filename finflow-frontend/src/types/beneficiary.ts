export type Beneficiary = {
    id: number;
    name: string;
    accountNumber: string;
    createdAt: string;
};

export type CreateBeneficiaryRequest = {
    name: string;
    accountNumber: string;
};

export type BeneficiaryTransferRequest = {
    beneficiaryId: number;
    amount: number;
    description: string;
};