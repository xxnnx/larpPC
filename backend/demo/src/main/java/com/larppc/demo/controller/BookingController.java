package com.larppc.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.larppc.demo.dto.BookingRequest;
import com.larppc.demo.dto.BookingResponse;
import com.larppc.demo.entity.User;
import com.larppc.demo.service.BookingService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {this.bookingService = bookingService; }

    @PostMapping
    public BookingResponse createBooking(@AuthenticationPrincipal User user, @RequestBody BookingRequest request) {
        return new BookingResponse(
            bookingService.createBooking(user.getId(), request.getComputerId(), request.getTariffId(), request.getStartTime(), request.getEndTime())
        );
    }

    @GetMapping("/my")
    public List<BookingResponse> getMyBookings(@AuthenticationPrincipal User user) {
        return bookingService.getUserBookings(user.getId()).stream().map(BookingResponse::new).toList();
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<BookingResponse> getAllBookings() {
        return bookingService.getAllBookings().stream().map(BookingResponse::new).toList();
    }

    @PatchMapping("/{id}/request-cancellation")
    public ResponseEntity<Void> requestCancellation(@AuthenticationPrincipal User user, @PathVariable Long id) {
        bookingService.requestCancellation(id, user.getId());
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/cancellation-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public List<BookingResponse> getCancellationRequests() {
        return bookingService.getCancellationRequests().stream().map(BookingResponse::new).toList();
    }

    @PatchMapping("/{id}/approve-cancellation")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> approveCancellation(@PathVariable Long id) {
        bookingService.approveCancellation(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/reject-cancellation")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> rejectCancellation(@PathVariable Long id) {
        bookingService.rejectCancellation(id);
        return ResponseEntity.noContent().build();
    }
}
