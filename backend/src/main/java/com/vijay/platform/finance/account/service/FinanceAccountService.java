package com.vijay.platform.finance.account.service;

import com.vijay.platform.finance.account.dto.CreateFinanceAccountRequest;
import com.vijay.platform.finance.account.dto.FinanceAccountResponse;
import com.vijay.platform.finance.account.entity.FinanceAccount;
import com.vijay.platform.finance.account.repository.FinanceAccountRepository;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FinanceAccountService {

    private final FinanceAccountRepository accountRepository;
    private final UserRepository userRepository;

    @Transactional
    public FinanceAccountResponse createAccount(
            String username,
            CreateFinanceAccountRequest request) {

        User user = getUser(username);

        FinanceAccount account = new FinanceAccount();
        account.setUser(user);
        account.setName(request.getName().trim());
        account.setAccountType(request.getAccountType());
        account.setInstitutionName(normalizeOptional(request.getInstitutionName()));
        account.setCurrency(
                request.getCurrency() == null
                        ? "INR"
                        : request.getCurrency().trim().toUpperCase(Locale.ROOT)
        );
        account.setOpeningBalance(request.getOpeningBalance());
        account.setCreditLimit(request.getCreditLimit());
        account.setLastFourDigits(request.getLastFourDigits());

        FinanceAccount savedAccount = accountRepository.save(account);

        return toResponse(savedAccount);
    }

    public List<FinanceAccountResponse> getMyAccounts(String username) {
        User user = getUser(username);

        return accountRepository
                .findAllByUserIdAndActiveTrueOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Authenticated user could not be found"
                        )
                );
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private FinanceAccountResponse toResponse(FinanceAccount account) {
        return new FinanceAccountResponse(
                account.getId(),
                account.getName(),
                account.getAccountType(),
                account.getInstitutionName(),
                account.getCurrency(),
                account.getOpeningBalance(),
                account.getCreditLimit(),
                account.getLastFourDigits(),
                account.isActive(),
                account.getCreatedAt(),
                account.getUpdatedAt()
        );
    }
}