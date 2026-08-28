package com.finflow.beneficiary;

import com.finflow.beneficiary.dto.BeneficiaryResponse;
import com.finflow.beneficiary.dto.CreateBeneficiaryRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiaries")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    public BeneficiaryController(BeneficiaryService beneficiaryService) {
        this.beneficiaryService = beneficiaryService;
    }

    @PostMapping
    public ResponseEntity<BeneficiaryResponse> createBeneficiary(
            Authentication authentication,
            @Valid @RequestBody CreateBeneficiaryRequest request) {

        Beneficiary beneficiary = beneficiaryService.createBeneficiary(
                authentication.getName(),
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(beneficiary));
    }

    @GetMapping
    public ResponseEntity<List<BeneficiaryResponse>> getBeneficiaries(
            Authentication authentication) {

        List<BeneficiaryResponse> beneficiaries = beneficiaryService
                .getBeneficiaries(authentication.getName())
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(beneficiaries);
    }

    private BeneficiaryResponse toResponse(Beneficiary beneficiary) {
        return new BeneficiaryResponse(
                beneficiary.getId(),
                beneficiary.getName(),
                beneficiary.getAccountNumber(),
                beneficiary.getCreatedAt()
        );
    }

    @DeleteMapping("/{beneficiaryId}")
    public ResponseEntity<Void> deleteBeneficiary(
            @PathVariable Long beneficiaryId,
            Authentication authentication) {

        beneficiaryService.deleteBeneficiary(
                authentication.getName(),
                beneficiaryId
        );

        return ResponseEntity.noContent().build();
    }
}