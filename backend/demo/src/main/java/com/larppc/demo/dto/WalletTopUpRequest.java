package com.larppc.demo.dto;

import java.math.BigDecimal;

public record WalletTopUpRequest(Long userId, BigDecimal amount) {
}