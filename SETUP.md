# INKLUZIV Setup Guide

## Prerequisites

- Java 21 or higher
- Node.js 18 or higher
- MongoDB (local or cloud)
- Redis (optional, for session management)

## Backend Setup

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd inkluziv
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/inkluziv
   MONGODB_DATABASE=inkluziv
   
   # Redis (optional)
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=
   
   # JWT Secret (must be 256 bits for HS256)
   JWT_SECRET=YourSecretKeyHereMustBe256BitsLongForHS256AlgorithmToWorkProperly
   
   # Email Configuration
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   
   # Cloudinary (for file uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Voice ML Service (if using external voice processing)
   VOICE_ML_SERVICE_URL=http://localhost:5000
   
   # Currency Exchange API
   EXCHANGE_API_URL=https://api.exchangerate-api.com/v4/latest/USD
   ```

3. **Install dependencies and run:**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:3000`

## Features

### USDT Transaction System
- **Currency Display**: All amounts shown to users in Naira (₦)
- **Backend Processing**: Transactions executed in USDT with automatic conversion
- **Live Exchange Rates**: Real-time Naira ↔ USDT conversion
- **Transaction History**: Complete history with Naira amounts, USDT equivalents, and blockchain hashes
- **Wallet Management**: Automatic wallet creation and balance tracking

### Accessibility Features
- **Voice Control**: Complete voice navigation and commands
- **Text-to-Speech**: Real-time audio feedback
- **Live Captions**: Visual subtitles for all audio content
- **High Contrast**: Enhanced visual accessibility
- **Haptic Feedback**: Tactile responses for interactions

### Security
- **JWT Authentication**: Secure token-based authentication
- **Voice Authentication**: Biometric voice login (optional)
- **Encrypted Storage**: Secure wallet key management
- **Session Management**: Multi-device logout support

## API Endpoints

### User Management
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `POST /users/voice-login` - Voice-based login
- `POST /users/logout` - Logout current session
- `POST /users/logout-all-devices` - Logout all sessions

### Transaction Management
- `POST /transactions/send-usdt` - Send USDT transaction
- `GET /transactions/history` - Get transaction history
- `GET /transactions/balance` - Get wallet balance
- `POST /transactions/create-wallet` - Create new wallet

## Development Notes

### Currency Conversion
- Users interact with Naira amounts
- Backend converts to USDT for blockchain transactions
- Exchange rates fetched from external API with fallback
- All calculations maintain precision with BigDecimal

### Voice Commands
Available voice commands in the banking interface:
- "Check balance" - Display current balance
- "Send money" - Open send dialog
- "Show history" - View transaction history
- "Help" - List available commands

### Error Handling
- Insufficient balance validation
- Invalid address verification
- Network error recovery
- User-friendly error messages

## Production Deployment

1. **Backend**: Deploy Spring Boot application to your preferred cloud provider
2. **Frontend**: Deploy Next.js application to Vercel, Netlify, or similar
3. **Database**: Use MongoDB Atlas or similar cloud database
4. **Environment**: Update environment variables for production URLs

## Troubleshooting

### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running and accessible
2. **CORS Errors**: Check CORS configuration in `ApplicationConfiguration.java`
3. **JWT Errors**: Verify JWT secret is properly set and 256 bits long
4. **Voice Features**: Ensure HTTPS for voice recognition in production

### Logs
Check application logs for detailed error information:
```bash
./mvnw spring-boot:run --debug
```