
package com.vijay.platform.finance.transaction.repository;

import com.vijay.platform.finance.transaction.dto.FinanceTransactionFilterRequest;
import com.vijay.platform.finance.transaction.entity.FinanceTransaction;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class FinanceTransactionSpecification {

    private FinanceTransactionSpecification() {
    }

    public static Specification<FinanceTransaction> withFilters(
            Long userId,
            FinanceTransactionFilterRequest filter
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always restrict results to the authenticated owner.
            predicates.add(
                    criteriaBuilder.equal(root.get("user").get("id"), userId)
            );

            if (filter.startDate() != null) {
                predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(
                                root.get("transactionDate"),
                                filter.startDate()
                        )
                );
            }

            if (filter.endDate() != null) {
                predicates.add(
                        criteriaBuilder.lessThanOrEqualTo(
                                root.get("transactionDate"),
                                filter.endDate()
                        )
                );
            }

            if (filter.accountId() != null) {
                predicates.add(
                        criteriaBuilder.equal(
                                root.get("account").get("id"),
                                filter.accountId()
                        )
                );
            }

            if (filter.categoryId() != null) {
                predicates.add(
                        criteriaBuilder.equal(
                                root.get("category").get("id"),
                                filter.categoryId()
                        )
                );
            }

            if (filter.transactionType() != null) {
                predicates.add(
                        criteriaBuilder.equal(
                                root.get("transactionType"),
                                filter.transactionType()
                        )
                );
            }

            query.orderBy(
                    criteriaBuilder.desc(root.get("transactionDate")),
                    criteriaBuilder.desc(root.get("id"))
            );

            return criteriaBuilder.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}
