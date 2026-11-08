package com.larppc.demo.entity;

public enum WalletTransactionType {
    TOP_UP,           // пополнение баланса
    BOOKING_PAYMENT,  // оплата бронирования
    REFUND,           // возврат средств
    ADMIN_ADJUSTMENT  // ручная корректировка администратором
}