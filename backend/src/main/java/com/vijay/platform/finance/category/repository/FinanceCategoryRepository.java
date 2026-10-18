package com.vijay.platform.finance.category.repository;

import com.vijay.platform.finance.category.entity.FinanceCategory;
import com.vijay.platform.finance.category.entity.FinanceCategoryType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FinanceCategoryRepository
        extends JpaRepository<FinanceCategory, Long> {

    List<FinanceCategory> findAllByUserIdAndActiveTrueOrderByNameAsc(
            Long userId
    );

    boolean existsByUserIdAndNameIgnoreCaseAndCategoryType(
            Long userId,
            String name,
            FinanceCategoryType categoryType
    );
}