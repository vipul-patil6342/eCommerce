package com.vipulpatil.eCommerce.service;

import com.vipulpatil.eCommerce.dto.AddressRequestDto;
import com.vipulpatil.eCommerce.dto.AddressResponseDto;
import com.vipulpatil.eCommerce.entity.Address;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.repository.AddressRepository;
import com.vipulpatil.eCommerce.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public AddressResponseDto createAddress(Long userId, AddressRequestDto request){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(request.isDefaultAddress()){
            addressRepository.findByUserIdAndDefaultAddressTrue(userId)
                    .ifPresent(addr -> {
                        addr.setDefaultAddress(false);
                        addressRepository.save(addr);
                    });

        }

        Address address = Address.builder()
                .user(user)
                .phone(request.getPhone())
                .state(request.getState())
                .city(request.getCity())
                .pincode(request.getPincode())
                .street(request.getStreet())
                .house(request.getHouse())
                .defaultAddress(request.isDefaultAddress())
                .build();

        Address saved = addressRepository.save(address);
        return modelMapper.map(saved,AddressResponseDto.class);
    }

    public List<AddressResponseDto> getAllAddresses(Long id) {
        return addressRepository.findAllByUserIdOrderByDefault(id)
                .stream()
                .map(address -> modelMapper.map(address, AddressResponseDto.class))
                .collect(Collectors.toList());
        
    }

    public void deleteAddress(Long addressId, Long userId) {
        Address address = addressRepository.findByIdAndUserId(addressId,userId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        addressRepository.delete(address);

    }

    public AddressResponseDto updateAddress(Long addressId, Long userId, AddressRequestDto request) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if(request.isDefaultAddress() && !address.isDefaultAddress()){
            addressRepository.findByUserIdAndDefaultAddressTrue(userId)
                    .ifPresent(addr -> {
                        addr.setDefaultAddress(false);
                        addressRepository.save(addr);
                    });
        }

        address.setPhone(request.getPhone());
        address.setState(request.getState());
        address.setCity(request.getCity());
        address.setPincode(request.getPincode());
        address.setStreet(request.getStreet());
        address.setHouse(request.getHouse());

        Address updated = addressRepository.save(address);
        return modelMapper.map(updated , AddressResponseDto.class);
    }

    public AddressResponseDto getAddressById(Long addressId, Long userId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        return modelMapper.map(address, AddressResponseDto.class);
    }

    public AddressResponseDto getDefaultAddress(Long userId) {
        Address address = addressRepository.findByUserIdAndDefaultAddressTrue(userId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        return modelMapper.map(address , AddressResponseDto.class);
    }

    public AddressResponseDto setDefaultAddress(Long addressId, Long userId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new RuntimeException("Address Not Found"));

        addressRepository.findByUserIdAndDefaultAddressTrue(userId)
                        .ifPresent(addr -> {
                            addr.setDefaultAddress(false);
                            addressRepository.save(addr);
                        });

        address.setDefaultAddress(true);

        Address saved = addressRepository.save(address);

        return modelMapper.map(saved , AddressResponseDto.class);
    }
}
