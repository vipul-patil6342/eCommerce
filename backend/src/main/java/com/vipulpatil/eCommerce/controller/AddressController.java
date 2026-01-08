package com.vipulpatil.eCommerce.controller;

import com.vipulpatil.eCommerce.dto.AddressRequestDto;
import com.vipulpatil.eCommerce.dto.AddressResponseDto;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/address")
public class AddressController {

    private final AddressService addressService;

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping
    public ResponseEntity<AddressResponseDto> createAddress(
            @Valid @RequestBody AddressRequestDto request,
            @AuthenticationPrincipal User user
    ) {
        AddressResponseDto address =
                addressService.createAddress(user.getId(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(address);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/my-addresses")
    public ResponseEntity<List<AddressResponseDto>> getAllAddresses(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                addressService.getAllAddresses(user.getId())
        );
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/{addressId}")
    public ResponseEntity<AddressResponseDto> getAddressById(
            @PathVariable Long addressId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                addressService.getAddressById(addressId, user.getId())
        );
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @DeleteMapping("/{addressId}")
    public ResponseEntity<String> deleteAddress(
            @PathVariable Long addressId,
            @AuthenticationPrincipal User user
    ) {
        addressService.deleteAddress(addressId, user.getId());
        return ResponseEntity.ok("Address deleted successfully");
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{addressId}")
    public ResponseEntity<AddressResponseDto> updateAddress(
            @PathVariable Long addressId,
            @RequestBody AddressRequestDto request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                addressService.updateAddress(addressId, user.getId(), request)
        );
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/default")
    public ResponseEntity<AddressResponseDto> getDefaultAddress(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                addressService.getDefaultAddress(user.getId())
        );
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{addressId}/set-default")
    public ResponseEntity<AddressResponseDto> setDefaultAddress(
            @PathVariable Long addressId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                addressService.setDefaultAddress(addressId, user.getId())
        );
    }
}
