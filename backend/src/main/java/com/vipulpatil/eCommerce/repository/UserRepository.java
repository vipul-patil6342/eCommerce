package com.vipulpatil.eCommerce.repository;

import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.entity.type.AuthProviderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByProviderIdAndProviderType(String providerId, AuthProviderType providerType);

    @Query("""
            SELECT COUNT(u)
            FROM User u
            WHERE (:startDate IS NULL OR u.createdAt >= :startDate)
            """)
    Long countFromDate(LocalDateTime startDate);
}