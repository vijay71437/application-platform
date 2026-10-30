
package com.vijay.platform.finance.recurring.repository;

import com.vijay.platform.finance.recurring.entity.RecurringTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RecurringTransactionRepository
        extends JpaRepository<RecurringTransaction, Long> {

    List<RecurringTransaction>
    findAllByUserIdAndActiveTrueOrderByNextOccurrenceDateAsc(Long userId);

    List<RecurringTransaction>
    findAllByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<RecurringTransaction> findByIdAndUserId(
            Long id,
            Long userId
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
       SELECT r
       FROM RecurringTransaction r
       WHERE r.user.id = :userId
         AND r.active = true
       ORDER BY r.nextOccurrenceDate ASC
       """)
    List<RecurringTransaction> findActiveSchedulesForUpdate(
            @Param("userId") Long userId
    );

}
