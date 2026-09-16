package com.vijay.platform.user.specification;

import com.vijay.platform.user.entity.User;
import org.springframework.data.jpa.domain.Specification;

public final class UserSpecification {
    private UserSpecification(){

    }
    public static Specification<User> isEnabled(){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("enabled")));
    }

    public static Specification<User> search(String search){
        return (root,query,criteriaBuilder)-> {
            String pattern="%"+search.toLowerCase()+"%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get("username")),
                            pattern
                    ),
                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get("email")),
                            pattern
                    ),
                   criteriaBuilder.like(
                            criteriaBuilder.lower(
                                   root.get("lastName")),
                            pattern
                   )
               );
        };
    }
}
