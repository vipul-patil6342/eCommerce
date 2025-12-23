package com.vipulpatil.eCommerce.controller;

import com.vipulpatil.eCommerce.dto.AddressRequestDto;
import com.vipulpatil.eCommerce.dto.AddressResponseDto;
import com.vipulpatil.eCommerce.entity.Address;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/addresses")
public class AddressController {

    private final AddressService addressService;

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping
    public ResponseEntity<?> createAddress(@RequestBody AddressRequestDto request , Authentication authentication){
        User user = (User) authentication.getPrincipal();
        AddressResponseDto address = addressService.createAddress(user.getId(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(address);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/my-addresses")
    public ResponseEntity<List<AddressResponseDto>> getAllAddresses(Authentication authentication){
        User user = (User) authentication.getPrincipal();
        List<AddressResponseDto> addresses = addressService.getAllAddresses(user.getId());
        return ResponseEntity.ok(addresses);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/{addressId}")
    public ResponseEntity<AddressResponseDto> getAddressById(@PathVariable Long addressId , Authentication authentication){
        User user = (User) authentication.getPrincipal();
        AddressResponseDto address = addressService.getAddressById(addressId , user.getId());
        return ResponseEntity.ok(address);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @DeleteMapping("/{addressId}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long addressId , Authentication authentication){
        User user = (User) authentication.getPrincipal();
        addressService.deleteAddress(addressId,user.getId());
        return ResponseEntity.ok("Address deleted successfully");
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{addressId}")
    public ResponseEntity<AddressResponseDto> updateAddress(@PathVariable Long addressId , Authentication authentication, @RequestBody AddressRequestDto request){
        User user = (User) authentication.getPrincipal();
        AddressResponseDto address = addressService.updateAddress(addressId,user.getId(), request);
        return ResponseEntity.ok(address);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/default")
    public ResponseEntity<AddressResponseDto> getDefaultAddress(Authentication authentication){
        User user = (User) authentication.getPrincipal();
        AddressResponseDto address = addressService.getDefaultAddress(user.getId());
        return ResponseEntity.ok(address);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{addressId}/set-default")
    public ResponseEntity<AddressResponseDto> setDefaultAddress(@PathVariable Long addressId , Authentication authentication){
        User user = (User) authentication.getPrincipal();
        AddressResponseDto address = addressService.setDefaultAddress(addressId , user.getId());
        return ResponseEntity.ok(address);
    }
}
