package com.vijay.platform.finance.account.repository;

import com.vijay.platform.finance.account.entity.FinanceAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FinanceAccountRepository
        extends JpaRepository<FinanceAccount, Long> {

    List<FinanceAccount> findAllByUserIdAndActiveTrueOrderByCreatedAtDesc(
            Long userId
    );
}