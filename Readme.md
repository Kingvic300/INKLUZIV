#    INKLUZIV APP

## Overview

This Spring Boot application provides a comprehensive set of APIs for user management, including registration, login, profile updates, password management, and advanced voice-based authentication features. It integrates with an external Voice Embedding Flask API for processing and comparing voice samples, enabling secure and convenient voice-driven user interactions.

## Features

*   **User Registration & Authentication**: Secure user registration, login, and session management.
*   **OTP Verification**: Email/SMS OTP (One-Time Password) for user verification and password resets.
*   **Profile Management**: APIs for updating user profiles.
*   **Password Management**: Functionality for resetting and changing passwords.
*   **File Upload**: Generic file upload capability.
*   **Voice-based Signup & Login**: Allows users to register and log in using their voice.
*   **Voice Authentication Enable/Disable**: Users can enable or disable voice authentication for their accounts.
*   **Session Management**: Logout from current or all devices.

## Setup and Installation

### Prerequisites

*   Java Development Kit (JDK) 17 or higher.
*   Maven or Gradle (for dependency management).
*   A running instance of the [Voice Embedding API](README.md) (refer to its README for setup instructions).
*   A database (e.g., PostgreSQL, MySQL, H2) configured for Spring Boot.

### Clone the Repository

Assuming this `UserController` is part of a larger Spring Boot project, you would clone the entire project:

```bash
git clone <repository_url>
cd <repository_name>
```

### Project Structure

This `UserController` is typically part of a Spring Boot application. The full project would include:

*   `pom.xml` or `build.gradle`: Project dependencies and build configuration.
*   `application.properties` or `application.yml`: Application configuration, including database connection details and external API URLs.
*   `UserService`: The service layer responsible for business logic and interacting with repositories and external APIs.
*   `db` and `embedding_service` (or similar): Modules for database interaction and voice embedding logic, potentially integrating with the Flask API.

### Configuration

Update your `application.properties` (or `application.yml`) with database connection details and the URL of the Voice Embedding Flask API:

```properties
# Database Configuration (Example for H2 - adjust for your DB)
spring.datasource.url=jdbc:h2:mem:mydb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true

# Voice Embedding Flask API URL
voice.embedding.api.url=http://localhost:5000
```

### Build the Application

Using Maven:

```bash
mvn clean install
```

Using Gradle:

```bash
gradle clean build
```

### Running the Application

After building, you can run the Spring Boot application:

```bash
java -jar target/<your-app-name>.jar
```

Or, if using Maven:

```bash
mvn spring-boot:run
```

The application will typically run on `http://localhost:8080` by default.

## API Endpoints (from UserController)

This section details the API endpoints exposed by the `UserController`.

### 1. `POST /users/send-verification-otp`

Sends a verification OTP to the user (e.g., email or phone).

*   **Request Type**: `POST`
*   **Content-Type**: `application/json`
*   **Request Body**: `CreateUserRequest` (e.g., `{"email": "user@example.com"}`)
*   **Response**: `OTPResponse`

### 2. `POST /users/register`

Registers a new user.

*   **Request Type**: `POST`
*   **Content-Type**: `application/json`
*   **Request Body**: `RegisterUserRequest`
*   **Response**: `CreatedUserResponse`

### 3. `POST /users/upload`

Uploads a file.

*   **Request Type**: `POST`
*   **Content-Type**: `multipart/form-data`
*   **Parameters**:
    *   `file`: The file to upload.
*   **Response**: `UploadResponse`

### 4. `POST /users/login`

Authenticates a user.

*   **Request Type**: `POST`
*   **Content-Type**: `application/json`
*   **Request Body**: `LoginRequest`
*   **Response**: `LoginResponse`

### 5. `PUT /users/update-profile`

Updates the authenticated user's profile.

*   **Request Type**: `PUT`
*   **Content-Type**: `application/json`
*   **Request Body**: `UpdateUserProfileRequest`
*   **Response**: `UpdateUserProfileResponse`

### 6. `POST /users/reset-password`

Resets a user's password after verification.

*   **Request Type**: `POST`
*   **Content-Type**: `application/json`
*   **Request Body**: `ChangePasswordRequest`
*   **Response**: `ResetPasswordResponse`

### 7. `POST /users/send-reset-otp`

Sends an OTP for password reset.

*   **Request Type**: `POST`
*   **Content-Type**: `application/json`
*   **Request Body**: `ResetPasswordRequest`
*   **Response**: `ResetPasswordResponse`

### 8. `GET /users/{id}`

Retrieves user details by ID.

*   **Request Type**: `GET`
*   **Parameters**:
    *   `id`: The ID of the user.
*   **Response**: `FoundResponse`

### 9. `POST /users/voice-signup`

Initiates voice-based user registration by uploading a voice sample.

*   **Request Type**: `POST`
*   **Content-Type**: `multipart/form-data`
*   **Request Body**: `VoiceSignupRequest` (includes voice sample as `MultipartFile`)
*   **Response**: `VoiceRegistrationResponse`

### 10. `POST /users/complete-voice-registration`

Completes the voice-based user registration.

*   **Request Type**: `POST`
*   **Content-Type**: `application/json`
*   **Request Body**: `CompleteVoiceRegistrationRequest`
*   **Response**: `CreatedUserResponse`

### 11. `POST /users/voice-login`

Authenticates a user using a voice sample.

*   **Request Type**: `POST`
*   **Content-Type**: `multipart/form-data`
*   **Request Body**: `VoiceLoginRequest` (includes voice sample as `MultipartFile`)
*   **Response**: `LoginResponse`

### 12. `POST /users/enable-voice-auth`

Enables voice authentication for the authenticated user.

*   **Request Type**: `POST`
*   **Content-Type**: `multipart/form-data`
*   **Parameters**:
    *   `voiceSample`: The voice sample to register for authentication.
*   **Response**: `VoiceAuthResponse`

### 13. `POST /users/disable-voice-auth`

Disables voice authentication for the authenticated user.

*   **Request Type**: `POST`
*   **Response**: `VoiceAuthResponse`

### 14. `POST /users/logout`

Logs out the current user session.

*   **Request Type**: `POST`
*   **Response**: `LogoutResponse`

### 15. `POST /users/logout-all-devices`

Logs out the user from all devices.

*   **Request Type**: `POST`
*   **Response**: `LogoutResponse`




## Integration with Voice Embedding Flask API

This Spring Boot application leverages an external Flask API for its voice-related functionalities, specifically for extracting and comparing voice embeddings. The integration points are primarily within the `UserService` (not provided in the `UserController` snippet, but implied) which would make HTTP calls to the Flask API.

### How it Works

1.  **Voice Sample Submission**: When a user performs actions like `voice-signup`, `voice-login`, or `enable-voice-auth`, a voice sample (`MultipartFile`) is sent to this Spring Boot application.
2.  **Forwarding to Flask API**: The `UserService` (or a dedicated client within the Java application) takes this voice sample and forwards it to the Flask API's `/extract-embedding` endpoint. This involves constructing a `multipart/form-data` request similar to the `curl` example in the [Flask API README](README.md).
3.  **Embedding Storage/Retrieval**: The Flask API processes the audio, extracts features, generates an embedding, and returns a `file_id` for the stored embedding. The Java application then uses this `file_id` to reference the voice embedding for future operations.
4.  **Voice Comparison**: For voice login or authentication, the Java application would send two embeddings (either newly extracted or retrieved from its own database using the `file_id` from the Flask API) to the Flask API's `/compare-voices` endpoint. The Flask API returns a similarity score, which the Java application uses to determine authentication success.

### Configuration for Flask API

As mentioned in the [Setup and Installation](#setup-and-installation) section, the URL for the Voice Embedding Flask API must be configured in `application.properties` (or `application.yml`):

```properties
voice.embedding.api.url=http://localhost:5000
```

This property allows the Java application to know where to send its requests for voice embedding operations.

### Example Interaction Flow (Conceptual)

Let's consider the `voiceSignup` endpoint:

1.  User calls `POST /users/voice-signup` with their voice sample.
2.  `UserController` calls `userService.voiceSignup(request)`.
3.  `UserService`:
    a.  Receives the `MultipartFile` voice sample.
    b.  Makes an HTTP POST request to `http://localhost:5000/extract-embedding` with the voice sample.
    c.  Receives a `file_id` and embedding from the Flask API.
    d.  Stores this `file_id` (and potentially other user-related data) in its own database, associating it with the user.
    e.  Returns a `VoiceRegistrationResponse` to the `UserController`.

Similarly, for `voiceLogin`:

1.  User calls `POST /users/voice-login` with their voice sample.
2.  `UserController` calls `userService.voiceLogin(request)`.
3.  `UserService`:
    a.  Receives the `MultipartFile` voice sample.
    b.  Makes an HTTP POST request to `http://localhost:5000/extract-embedding` to get a new embedding for the login attempt.
    c.  Retrieves the stored voice embedding (using the `file_id`) for the user from its own database.
    d.  Makes an HTTP POST request to `http://localhost:5000/compare-voices` with the newly extracted embedding and the stored embedding.
    e.  Receives a similarity score from the Flask API.
    f.  Based on the similarity score, determines if the voice login is successful and returns a `LoginResponse`.

This modular approach allows the voice embedding logic to be decoupled and managed by a specialized service (the Flask API), while the Spring Boot application focuses on user management and orchestrating the overall authentication flow.

## Contributing

Feel free to fork the repository, submit pull requests, or open issues for bugs and feature requests.

## License

This project is open-source and available under the [MIT License](LICENSE).


