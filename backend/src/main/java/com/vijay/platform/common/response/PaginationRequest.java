package com.vijay.platform.common.response;

import com.vijay.platform.common.exception.InvalidParameterException;
import lombok.Getter;
import org.springframework.data.domain.Sort;

@Getter
public class PaginationRequest {

    private final int page;
    private final int size;
    private final String sortBy;
    private final Sort.Direction sortDirection;

    public PaginationRequest(int page,int size,String sortBy,String sortDirection){
        if (page < 0) {
            throw new InvalidParameterException(
                    "Page must be greater than or equal to 0"
            );
        }
        if (size < 1 ) {
            throw new InvalidParameterException(
                    "Size must be greater than or equal to 1"
            );
        }

        if (sortBy == null || sortBy.isBlank()) {
            throw new InvalidParameterException(
                    "Sort field is required"
            );
        }
        try {
            this.sortDirection =
                    Sort.Direction.fromString(sortDirection);
        } catch (IllegalArgumentException ex) {
            throw new InvalidParameterException(
                    "Sort direction must be 'asc' or 'desc'"
            );
        }

        this.page=page;
        this.size=size;
        this.sortBy=sortBy;
    }
}
