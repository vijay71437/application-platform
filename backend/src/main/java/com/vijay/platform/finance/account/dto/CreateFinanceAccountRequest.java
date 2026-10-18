package com.vijay.platform.finance.account.dto;

import com.vijay.platform.finance.account.entity.FinanceAccountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateFinanceAccountRequest {

    @NotBlank(message = "Account name is required")
    @Size(max = 100, message = "Account name cannot exceed 100 characters")
    private String name;

    @NotNull(message = "Account type is required")
    private FinanceAccountType accountType;

    @Size(max = 150, message = "Institution name cannot exceed 150 characters")
    private String institutionName;

    @Pattern(
            regexp = "^[A-Z]{3}$",
            message = "Currency must be a three-letter uppercase code"
    )
    private String currency = "INR";

    @NotNull(message = "Opening balance is required")
    @DecimalMin(value = "0.0", message = "Opening balance cannot be negative")
    @Digits(integer = 15, fraction = 4, message = "Invalid opening balance precision")
    private BigDecimal openingBalance = BigDecimal.ZERO;

    @DecimalMin(value = "0.0", message = "Credit limit cannot be negative")
    @Digits(integer = 15, fraction = 4, message = "Invalid credit limit precision")
    private BigDecimal creditLimit;

    @Pattern(
            regexp = "^[0-9]{4}$",
            message = "Last four digits must contain exactly four digits"
    )
    private String lastFourDigits;
}