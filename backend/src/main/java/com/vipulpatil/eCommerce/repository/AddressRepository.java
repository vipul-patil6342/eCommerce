package com.vipulpatil.eCommerce.repository;

import com.vipulpatil.eCommerce.dto.AddressResponseDto;
import com.vipulpatil.eCommerce.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUserId(Long userId);

    Optional<Address> findByUserIdAndDefaultAddressTrue(Long userId);

    @Query("SELECT a FROM Address a WHERE a.user.id = ?1 ORDER BY a.defaultAddress DESC , a.createdAt")
    List<Address> findAllByUserIdOrderByDefault(Long userId);

    Optional<Address> findByIdAndUserId(Long addressId, Long userId);
}