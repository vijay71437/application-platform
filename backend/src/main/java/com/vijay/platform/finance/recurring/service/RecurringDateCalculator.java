
package com.vijay.platform.finance.recurring.service;

import com.vijay.platform.finance.recurring.entity.RecurringFrequency;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Objects;

public final class RecurringDateCalculator {

    private RecurringDateCalculator() {
        // Utility class; prevent instantiation.
    }

    public static LocalDate calculateNextOccurrence(
            LocalDate currentOccurrence,
            LocalDate startDate,
            RecurringFrequency frequency
    ) {
        Objects.requireNonNull(currentOccurrence, "Current occurrence is required");
        Objects.requireNonNull(startDate, "Start date is required");
        Objects.requireNonNull(frequency, "Frequency is required");

        if (currentOccurrence.isBefore(startDate)) {
            throw new IllegalArgumentException(
                    "Current occurrence cannot be before the start date"
            );
        }

        return switch (frequency) {
            case DAILY -> currentOccurrence.plusDays(1);

            case WEEKLY -> currentOccurrence.plusWeeks(1);

            case MONTHLY -> {
                YearMonth nextMonth = YearMonth.from(currentOccurrence)
                        .plusMonths(1);

                int day = Math.min(
                        startDate.getDayOfMonth(),
                        nextMonth.lengthOfMonth()
                );

                yield nextMonth.atDay(day);
            }

            case YEARLY -> {
                int nextYear = currentOccurrence.getYear() + 1;
                YearMonth targetMonth = YearMonth.of(
                        nextYear,
                        startDate.getMonth()
                );

                int day = Math.min(
                        startDate.getDayOfMonth(),
                        targetMonth.lengthOfMonth()
                );

                yield targetMonth.atDay(day);
            }
        };
    }

    public static boolean hasEnded(
            LocalDate nextOccurrence,
            LocalDate endDate
    ) {
        return endDate != null && nextOccurrence.isAfter(endDate);
    }
}
