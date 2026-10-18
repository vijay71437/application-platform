package com.vijay.platform.finance.category.service;

import com.vijay.platform.finance.category.dto.CreateFinanceCategoryRequest;
import com.vijay.platform.finance.category.dto.FinanceCategoryResponse;
import com.vijay.platform.finance.category.entity.FinanceCategory;
import com.vijay.platform.finance.category.repository.FinanceCategoryRepository;
import com.vijay.platform.user.entity.User;
import com.vijay.platform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.vijay.platform.finance.category.exception.DuplicateFinanceCategoryException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FinanceCategoryService {

    private final FinanceCategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional
    public FinanceCategoryResponse createCategory(
            String username,
            CreateFinanceCategoryRequest request) {

        User user = getUser(username);
        String name = request.getName().trim();

        if (categoryRepository.existsByUserIdAndNameIgnoreCaseAndCategoryType(
                user.getId(), name, request.getCategoryType())) {
            throw new DuplicateFinanceCategoryException();
        }

        FinanceCategory category = new FinanceCategory();
        category.setUser(user);
        category.setName(name);
        category.setCategoryType(request.getCategoryType());
        category.setDescription(normalizeOptional(request.getDescription()));

        return toResponse(categoryRepository.save(category));
    }

    public List<FinanceCategoryResponse> getMyCategories(String username) {
        User user = getUser(username);

        return categoryRepository
                .findAllByUserIdAndActiveTrueOrderByNameAsc(user.getId())
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
        return value == null || value.isBlank() ? null : value.trim();
    }

    private FinanceCategoryResponse toResponse(FinanceCategory category) {
        return new FinanceCategoryResponse(
                category.getId(),
                category.getName(),
                category.getCategoryType(),
                category.getDescription(),
                category.isActive(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}