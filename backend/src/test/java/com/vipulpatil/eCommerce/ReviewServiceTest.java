package com.vipulpatil.eCommerce;

import com.vipulpatil.eCommerce.dto.ReviewRequestDto;
import com.vipulpatil.eCommerce.dto.ReviewResponseDto;
import com.vipulpatil.eCommerce.entity.Product;
import com.vipulpatil.eCommerce.entity.Review;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.entity.type.RoleType;
import com.vipulpatil.eCommerce.repository.ProductRepository;
import com.vipulpatil.eCommerce.repository.ReviewRepository;
import com.vipulpatil.eCommerce.repository.UserRepository;
import com.vipulpatil.eCommerce.service.ReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class ReviewServiceTest {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    private User user;
    private User newUser;
    private User admin;
    private Product product;
    private Review review;

    @BeforeEach
    void setUp(){
        reviewRepository.deleteAll();
        productRepository.deleteAll();
        userRepository.deleteAll();

        user = User.builder()
                .name("vipul")
                .username("vipul@gmail.com")
                .password("1234")
                .roles(Collections.singleton(RoleType.USER))
                .build();
        user = userRepository.saveAndFlush(user);

        newUser = User.builder()
                .name("Ravi")
                .username("ravi@123")
                .password("123")
                .roles(Collections.singleton(RoleType.USER))
                .build();

        newUser = userRepository.saveAndFlush(newUser);

        admin = userRepository.save(
                User.builder()
                        .name("admin")
                        .username("admin@test.com")
                        .password("password")
                        .roles(Set.of(RoleType.ADMIN))
                        .build()
        );

        product = Product.builder()
                .name("MacBook Pro")
                .brand("Apple")
                .description("Premium laptop")
                .category("Electronics")
                .price(BigDecimal.valueOf(150000.0))
                .stock(10)
                .averageRating(0.0)
                .reviewCount(0)
                .build();

        product = productRepository.saveAndFlush(product);

//        reviewService.addReview(product.getId(), newUser, new ReviewRequestDto() {{
//            setRating(3);
//            setComment("ok");
//        }});

        review = reviewRepository.save(
                Review.builder()
                        .rating(5)
                        .comment("Excellent product")
                        .user(user)
                        .product(product)
                        .build()
        );
    }

    @Test
    void addReview_shouldSaveReviewAndUpdateProductRating(){
        ReviewRequestDto requestDto = new ReviewRequestDto();
        requestDto.setRating(5);
        requestDto.setComment("Excellent");

        var response = reviewService.addReview(product.getId(), newUser, requestDto);

        assertNotNull(response);
        assertEquals(5, response.getRating());

        Product updatedProduct = productRepository.findById(product.getId()).orElseThrow();

        assertEquals(5.0, updatedProduct.getAverageRating());
        assertEquals(2, updatedProduct.getReviewCount());

        assertEquals(2, reviewRepository.countByProductId(product.getId()));
    }

    @Test
    void addReview_shouldFail_whenUserAlreadyReviewed() {
        ReviewRequestDto requestDto = new ReviewRequestDto();
        requestDto.setRating(4);
        requestDto.setComment("good");

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> reviewService.addReview(product.getId(), user, requestDto)
        );

        assertEquals("You have already reviewed this product", ex.getMessage());

    }

    @Test
    void updateReview_shouldUpdateReview(){
        ReviewRequestDto requestDto = new ReviewRequestDto();
        requestDto.setRating(5);
        requestDto.setComment("nice");

        ReviewResponseDto response =
                reviewService.updateReview(review.getId(), user, requestDto);

        assertEquals(5, response.getRating());
        assertEquals("nice", response.getComment());

        Review updated =
                reviewRepository.findById(review.getId()).orElseThrow();

        assertEquals(5, updated.getRating());
        assertEquals("nice", updated.getComment());
    }

    @Test
    void getReviews_shouldGetReviews(){
        List<ReviewResponseDto> result = reviewService.getReviews(product.getId());
        assertEquals(1,result.size());
    }

    @Test
    void deleteReview_shouldDeleteWhenUserIsOwner(){
        reviewService.deleteReview(review.getId(),user);

        Optional<Review> deleteReview = reviewRepository.findById(review.getId());
        assertTrue(deleteReview.isEmpty());
    }

    @Test
    void deleteReview_shouldDelete_whenAdmin() {

        reviewService.deleteReview(review.getId(), admin);
        assertFalse(reviewRepository.findById(review.getId()).isPresent());
    }

    @Test
    void deleteReview_shouldFail_whenNotOwner() {

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> reviewService.deleteReview(review.getId(), newUser)
        );

        assertEquals("Unauthorized or review not found", ex.getMessage());
    }

    @Test
    void deleteReview_shouldUpdateProductRating() {

        Review review2 = reviewRepository.save(
                Review.builder()
                        .user(newUser)
                        .product(product)
                        .rating(3)
                        .comment("Okay")
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build()
        );

        reviewService.deleteReview(review.getId(), admin);

        Product updated =
                productRepository.findById(product.getId()).get();

        assertEquals(3.0, updated.getAverageRating());
        assertEquals(1, updated.getReviewCount());
    }

    @Test
    void updateReview_shouldUpdate_whenOwner() {

        ReviewRequestDto request = new ReviewRequestDto();
        request.setRating(4);
        request.setComment("Excellent product");

        ReviewResponseDto response =
                reviewService.updateReview(review.getId(), user, request);

        assertEquals(4, response.getRating());
        assertEquals("Excellent product", response.getComment());

        Review updated =
                reviewRepository.findById(review.getId()).get();

        assertEquals(4, updated.getRating());
        assertEquals("Excellent product", updated.getComment());
    }

    @Test
    void updateReview_shouldRecalculateProductRating() {

        Review review2 = reviewRepository.save(
                Review.builder()
                        .user(newUser)
                        .product(product)
                        .rating(3)
                        .comment("Average")
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build()
        );

        ReviewRequestDto request = new ReviewRequestDto();
        request.setRating(1);
        request.setComment("Changed mind");

        reviewService.updateReview(review.getId(), user, request);

        Product updatedProduct =
                productRepository.findById(product.getId()).get();

        assertEquals(2.0, updatedProduct.getAverageRating());
        assertEquals(2, updatedProduct.getReviewCount());
    }

    @Test
    void updateReview_shouldFail_whenNotOwner() {

        ReviewRequestDto request = new ReviewRequestDto();
        request.setRating(2);
        request.setComment("Bad");

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> reviewService.updateReview(review.getId(), newUser, request)
        );

        assertEquals("Unauthorized or review not found", ex.getMessage());
    }

}