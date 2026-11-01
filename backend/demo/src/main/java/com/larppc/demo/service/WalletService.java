package com.larppc.demo.service;

import com.larppc.demo.dto.WalletBalanceResponse;
import com.larppc.demo.dto.WalletTransactionResponse;
import com.larppc.demo.entity.*;
import com.larppc.demo.repository.UserRepository;
import com.larppc.demo.repository.WalletTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class WalletService {

    private final UserRepository userRepository;
    private final WalletTransactionRepository transactionRepository;

    public WalletService(UserRepository userRepository, WalletTransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public void debitForBooking(User user, Booking booking, BigDecimal amount) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Некорректная сумма списания");
        }

        BigDecimal balanceBefore = user.getBalance();

        if (balanceBefore == null || balanceBefore.compareTo(amount) < 0) {
            throw new IllegalStateException("Недостаточно средств на балансе");
        }

        BigDecimal balanceAfter = balanceBefore.subtract(amount);

        user.setBalance(balanceAfter);

        WalletTransaction transaction = new WalletTransaction();
        transaction.setUser(user);
        transaction.setBooking(booking);
        transaction.setType(WalletTransactionType.BOOKING_PAYMENT);
        transaction.setAmount(amount);
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(balanceAfter);
        transaction.setDescription("Оплата бронирования №" + booking.getId());

        transactionRepository.save(transaction);
    }

    @Transactional
    public void topUp(Long userId, BigDecimal amount) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Сумма пополнения должна быть больше нуля");
        }

        User user = userRepository.findByIdForUpdate(userId).orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));

        BigDecimal balanceBefore = user.getBalance();

        BigDecimal balanceAfter = balanceBefore.add(amount);

        user.setBalance(balanceAfter);

        WalletTransaction transaction = new WalletTransaction();
        transaction.setUser(user);
        transaction.setType(WalletTransactionType.TOP_UP);
        transaction.setAmount(amount);
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(balanceAfter);
        transaction.setDescription("Пополнение баланса администратором");

        transactionRepository.save(transaction);
    }

    @Transactional(readOnly = true)
    public WalletBalanceResponse getBalance(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));

        return new WalletBalanceResponse(user.getBalance());
    }

    @Transactional(readOnly = true)
    public List<WalletTransactionResponse> getTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(transaction -> new WalletTransactionResponse(
                        transaction.getId(),
                        transaction.getType(),
                        transaction.getAmount(),
                        transaction.getBalanceBefore(),
                        transaction.getBalanceAfter(),
                        transaction.getDescription(),
                        transaction.getCreatedAt(),
                        transaction.getBooking() != null ? transaction.getBooking().getId() : null
                )).toList();
    }
}