package com.finflow.beneficiary;

import com.finflow.account.AccountRepository;
import com.finflow.beneficiary.dto.CreateBeneficiaryRequest;
import com.finflow.exception.ResourceNotFoundException;
import com.finflow.exception.DuplicateBeneficiaryException;
import com.finflow.user.User;
import com.finflow.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public BeneficiaryService(
            BeneficiaryRepository beneficiaryRepository,
            UserRepository userRepository,
            AccountRepository accountRepository) {

        this.beneficiaryRepository = beneficiaryRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }

    public Beneficiary createBeneficiary(
            String userEmail,
            CreateBeneficiaryRequest request) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        accountRepository.findByAccountNumber(request.accountNumber())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Destination account not found"
                        ));

        if (beneficiaryRepository.existsByUserAndAccountNumber(
                user,
                request.accountNumber())) {

            throw new DuplicateBeneficiaryException(
                    "Beneficiary already exists"
            );
        }

        Beneficiary beneficiary = new Beneficiary(
                request.name().trim(),
                request.accountNumber().trim(),
                user
        );

        return beneficiaryRepository.save(beneficiary);
    }

    public List<Beneficiary> getBeneficiaries(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return beneficiaryRepository
                .findByUserOrderByCreatedAtDesc(user);
    }

    public void deleteBeneficiary(
            String userEmail,
            Long beneficiaryId) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Beneficiary beneficiary = beneficiaryRepository
                .findByIdAndUser(beneficiaryId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Beneficiary not found"));

        beneficiaryRepository.delete(beneficiary);
    }
}