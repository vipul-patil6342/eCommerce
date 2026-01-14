package com.vipulpatil.eCommerce.aspect;

import com.vipulpatil.eCommerce.annotation.RateLimit;
import com.vipulpatil.eCommerce.service.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Aspect
@Component
@RequiredArgsConstructor
public class RateLimitAspect {

    private final RateLimiterService rateLimiterService;
    private final HttpServletRequest request;

    @Around("@annotation(rateLimit)")
    public Object checkLimit(ProceedingJoinPoint joinPoint, RateLimit rateLimit) throws Throwable {
        String ip = request.getRemoteAddr();
        String key = joinPoint.getSignature().getName() + ":" + ip;

        if(rateLimiterService.isAllowed(key, rateLimit.limit(), rateLimit.window())){
            return joinPoint.proceed();
        }else{
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many requests!");
        }
    }
}
