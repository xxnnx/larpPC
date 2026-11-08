package com.larppc.demo.repository;

import com.larppc.demo.entity.WalletTransaction;
import com.larppc.demo.entity.WalletTransactionType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WalletTransactionRepository
        extends JpaRepository<WalletTransaction, Long> {

    List<WalletTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<WalletTransaction> findByBooking_IdAndType(Long bookingId, WalletTransactionType type);

    boolean existsByBooking_IdAndType(Long bookingId, WalletTransactionType type);
}