package com.inkluziv.service;

import com.inkluziv.dto.request.*;
import com.inkluziv.dto.response.*;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    OTPResponse sendVerificationOTP(CreateUserRequest request);

    CreatedUserResponse register(RegisterUserRequest request);

    UploadResponse uploadFile(MultipartFile file);

    LoginResponse login(LoginRequest loginRequest);

    UpdateUserProfileResponse updateProfile(UpdateUserProfileRequest updateUserProfileRequest);

    ResetPasswordResponse resetPassword(ChangePasswordRequest changePasswordRequest);

    ResetPasswordResponse sendResetOtp(ResetPasswordRequest resetPasswordRequest);

    FoundResponse findUserById(Long id);

    VoiceRegistrationResponse voiceSignup(VoiceSignupRequest request);

    CreatedUserResponse completeVoiceRegistration(CompleteVoiceRegistrationRequest request);

    LoginResponse voiceLogin(VoiceLoginRequest request);

    LogoutResponse logout();

    LogoutResponse logoutFromAllDevices();

    VoiceAuthResponse enableVoiceAuthentication(EnableVoiceAuthRequest request);

    VoiceAuthResponse disableVoiceAuthentication();
}
