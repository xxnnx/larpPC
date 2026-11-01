package com.larppc.demo.controller;

import com.larppc.demo.dto.WalletBalanceResponse;
import com.larppc.demo.dto.WalletTopUpRequest;
import com.larppc.demo.dto.WalletTransactionResponse;
import com.larppc.demo.entity.User;
import com.larppc.demo.service.WalletService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping
    public WalletBalanceResponse getBalance(@AuthenticationPrincipal User user) {
        return walletService.getBalance(user.getId());
    }

    @GetMapping("/transactions")
    public List<WalletTransactionResponse> getTransactions(@AuthenticationPrincipal User user) {
        return walletService.getTransactions(user.getId());
    }

    @PostMapping("/top-up")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> topUp(@RequestBody WalletTopUpRequest request) {
        walletService.topUp(request.userId(), request.amount());
        return ResponseEntity.ok().build();
    }
}