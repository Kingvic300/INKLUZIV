package com.inkluziv.service;

import com.inkluziv.data.model.Transaction;
import com.inkluziv.data.model.User;
import com.inkluziv.data.model.Wallet;
import com.inkluziv.data.repository.TransactionRepository;
import com.inkluziv.data.repository.UserRepository;
import com.inkluziv.data.repository.WalletRepository;
import com.inkluziv.dto.request.SendUSDTRequest;
import com.inkluziv.dto.response.SendUSDTResponse;
import com.inkluziv.dto.response.TransactionHistoryResponse;
import com.inkluziv.dto.response.WalletBalanceResponse;
import com.inkluziv.exception.InsufficientBalanceException;
import com.inkluziv.exception.InvalidAddressException;
import com.inkluziv.exception.UserNotFoundException;
import com.inkluziv.exception.WalletNotFoundException;
import com.inkluziv.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final CurrencyExchangeService currencyExchangeService;
    private final BlockchainService blockchainService;
    private final JwtUtil jwtUtil;

    @Override
    public SendUSDTResponse sendUSDT(SendUSDTRequest request) {
        String userEmail = getCurrentUserEmail();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new WalletNotFoundException("Wallet not found"));

        // Validate recipient address
        if (!blockchainService.isValidAddress(request.getRecipientAddress())) {
            throw new InvalidAddressException("Invalid recipient address");
        }

        // Convert Naira to USDT
        BigDecimal exchangeRate = currencyExchangeService.getNairaToUSDTRate();
        BigDecimal usdtAmount = currencyExchangeService.convertNairaToUSDT(request.getAmountNaira());

        // Check sufficient balance
        if (wallet.getBalanceUSDT().compareTo(usdtAmount) < 0) {
            throw new InsufficientBalanceException("Insufficient USDT balance");
        }

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setUserId(user.getId());
        transaction.setRecipientAddress(request.getRecipientAddress());
        transaction.setRecipientName(request.getRecipientName());
        transaction.setAmountNaira(request.getAmountNaira());
        transaction.setAmountUSDT(usdtAmount);
        transaction.setExchangeRate(exchangeRate);
        transaction.setStatus("PENDING");
        transaction.setType("SEND");
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setDescription(request.getDescription());

        transaction = transactionRepository.save(transaction);

        try {
            // Send USDT transaction
            String txHash = blockchainService.sendUSDT(
                    wallet.getWalletAddress(),
                    request.getRecipientAddress(),
                    usdtAmount,
                    wallet.getPrivateKey()
            );

            // Update transaction with hash and status
            transaction.setTransactionHash(txHash);
            transaction.setStatus("COMPLETED");
            transaction.setCompletedAt(LocalDateTime.now());

            // Update wallet balance
            wallet.setBalanceUSDT(wallet.getBalanceUSDT().subtract(usdtAmount));
            wallet.setBalanceNaira(currencyExchangeService.convertUSDTToNaira(wallet.getBalanceUSDT()));
            wallet.setUpdatedAt(LocalDateTime.now());

            walletRepository.save(wallet);
            transactionRepository.save(transaction);

            return new SendUSDTResponse(
                    "Transaction completed successfully",
                    txHash,
                    request.getAmountNaira(),
                    usdtAmount,
                    exchangeRate,
                    "COMPLETED",
                    transaction.getId()
            );

        } catch (Exception e) {
            // Update transaction status to failed
            transaction.setStatus("FAILED");
            transactionRepository.save(transaction);

            log.error("USDT transaction failed for user {}: {}", userEmail, e.getMessage());
            throw new RuntimeException("Transaction failed: " + e.getMessage());
        }
    }

    @Override
    public TransactionHistoryResponse getTransactionHistory(int page, int size) {
        String userEmail = getCurrentUserEmail();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Transaction> transactionPage = transactionRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        return new TransactionHistoryResponse(
                "Transaction history retrieved successfully",
                transactionPage.getContent(),
                transactionPage.getTotalPages(),
                transactionPage.getTotalElements(),
                page
        );
    }

    @Override
    public WalletBalanceResponse getWalletBalance() {
        String userEmail = getCurrentUserEmail();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new WalletNotFoundException("Wallet not found"));

        // Update balance from blockchain
        BigDecimal blockchainBalance = blockchainService.getUSDTBalance(wallet.getWalletAddress());
        wallet.setBalanceUSDT(blockchainBalance);
        wallet.setBalanceNaira(currencyExchangeService.convertUSDTToNaira(blockchainBalance));
        wallet.setUpdatedAt(LocalDateTime.now());

        walletRepository.save(wallet);

        return new WalletBalanceResponse(
                "Balance retrieved successfully",
                wallet.getBalanceNaira(),
                wallet.getBalanceUSDT(),
                wallet.getWalletAddress(),
                currencyExchangeService.getNairaToUSDTRate()
        );
    }

    @Override
    public WalletBalanceResponse createWallet() {
        String userEmail = getCurrentUserEmail();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Check if wallet already exists
        Optional<Wallet> existingWallet = walletRepository.findByUserId(user.getId());
        if (existingWallet.isPresent()) {
            Wallet wallet = existingWallet.get();
            return new WalletBalanceResponse(
                    "Wallet already exists",
                    wallet.getBalanceNaira(),
                    wallet.getBalanceUSDT(),
                    wallet.getWalletAddress(),
                    currencyExchangeService.getNairaToUSDTRate()
            );
        }

        // Create new wallet
        Wallet wallet = new Wallet();
        wallet.setUserId(user.getId());
        wallet.setWalletAddress(blockchainService.generateWalletAddress());
        wallet.setPrivateKey("encrypted_private_key_" + UUID.randomUUID()); // Mock encrypted key
        wallet.setBalanceUSDT(new BigDecimal("1000.00")); // Demo balance
        wallet.setBalanceNaira(currencyExchangeService.convertUSDTToNaira(wallet.getBalanceUSDT()));
        wallet.setCreatedAt(LocalDateTime.now());
        wallet.setUpdatedAt(LocalDateTime.now());
        wallet.setActive(true);

        wallet = walletRepository.save(wallet);

        return new WalletBalanceResponse(
                "Wallet created successfully",
                wallet.getBalanceNaira(),
                wallet.getBalanceUSDT(),
                wallet.getWalletAddress(),
                currencyExchangeService.getNairaToUSDTRate()
        );
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        return authentication.getName();
    }
}