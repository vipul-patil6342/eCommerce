package com.vipulpatil.eCommerce.controller;

import com.vipulpatil.eCommerce.dto.DashboardOverviewResponseDto;
import com.vipulpatil.eCommerce.dto.DashboardResponseDto;
import com.vipulpatil.eCommerce.dto.ProductCategoryCountResponseDto;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.entity.type.DashboardRange;
import com.vipulpatil.eCommerce.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardOverviewResponseDto> getSummary(
            @AuthenticationPrincipal User user,
            @RequestParam(name = "range", defaultValue = "WEEK")DashboardRange range
            ){
        if(user == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(dashboardService.getDashboardData(range));
    }

    @GetMapping("/category-product-count")
    public ResponseEntity<List<ProductCategoryCountResponseDto>> getProductCountByCategory(
            @AuthenticationPrincipal User user
    ){
        if(user == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(dashboardService.getProductCountByCategory());
    }
}
