// API client for INKLUZIV backend - Blockchain Edition
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://inkluziv.onrender.com"

export class APIClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    // Get token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      // @ts-ignore
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API Error: ${response.status}`)
    }

    return response.json()
  }

  private async uploadRequest(endpoint: string, formData: FormData) {
    const url = `${this.baseURL}${endpoint}`
    const headers: Record<string, string> = {}

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API Error: ${response.status}`)
    }

    return response.json()
  }

  // Authentication methods
  async register(userData: {
    name: string
    email: string
    password: string
  }) {
    // First send verification OTP
    await this.request("/users/send-verification-otp", {
      method: "POST",
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        role: "USER"
      }),
    })

    // Note: In real implementation, you'd need to collect OTP from user
    // For demo purposes, we'll simulate the registration completion
    return { message: "Registration initiated. Please check your email for OTP." }
  }

  async completeRegistration(email: string, otp: string) {
    return this.request("/users/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        otp,
        role: "USER"
      }),
    })
  }

  async login(credentials: {
    email: string
    password: string
  }) {
    const response = await this.request("/users/login", {
      method: "POST",
      body: JSON.stringify({
        ...credentials,
        role: "USER"
      }),
    })

    if (response.token) {
      this.token = response.token
      localStorage.setItem("auth_token", response.token)
    }

    return response
  }

  async logout() {
    const response = await this.request("/users/logout", {
      method: "POST",
    })

    this.token = null
    localStorage.removeItem("auth_token")

    return response
  }

  async logoutAllDevices() {
    const response = await this.request("/users/logout-all-devices", {
      method: "POST",
    })

    this.token = null
    localStorage.removeItem("auth_token")

    return response
  }

  // Wallet methods
  async getWalletBalance() {
    return this.request("/transactions/balance")
  }

  async createWallet() {
    return this.request("/transactions/create-wallet", {
      method: "POST",
    })
  }

  async sendUSDT(data: {
    recipientAddress: string
    recipientName: string
    amountNaira: number
    description: string
  }) {
    return this.request("/transactions/send-usdt", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getTransactionHistory(page: number = 0, size: number = 20) {
    return this.request(`/transactions/history?page=${page}&size=${size}`)
  }

  // OTP methods
  async sendVerificationOTP(email: string) {
    return this.request("/users/send-verification-otp", {
      method: "POST",
      body: JSON.stringify({ email, role: "USER" }),
    })
  }

  async sendResetOTP(email: string) {
    return this.request("/users/send-reset-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  // Password methods
  async resetPassword(data: {
    email: string
    otp: string
    newPassword: string
  }) {
    return this.request("/users/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Profile methods
  async updateProfile(profileData: {
    firstName?: string
    lastName?: string
    email?: string
    phoneNumber?: string
    location?: string
  }) {
    return this.request("/users/update-profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  async getUserById(id: string) {
    return this.request(`/users/${id}`)
  }

  // File upload
  async uploadFile(file: File) {
    const formData = new FormData()
    formData.append("file", file)

    return this.uploadRequest("/users/upload", formData)
  }

  // Voice authentication methods
  async voiceSignup(data: {
    email: string
    role: string
    voiceSample: File
  }) {
    const formData = new FormData()
    formData.append("email", data.email)
    formData.append("role", data.role)
    formData.append("voiceSample", data.voiceSample)

    return this.uploadRequest("/users/voice-signup", formData)
  }

  async completeVoiceRegistration(data: {
    email: string
    otp: string
  }) {
    return this.request("/users/complete-voice-registration", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async voiceLogin(voiceSample: File, email: string) {
    const formData = new FormData()
    formData.append("voiceSample", voiceSample)
    formData.append("email", email)

    const response = await this.uploadRequest("/users/voice-login", formData)

    if (response.token) {
      this.token = response.token
      localStorage.setItem("auth_token", response.token)
    }

    return response
  }

  async enableVoiceAuth(voiceSample: File) {
    const formData = new FormData()
    formData.append("voiceSample", voiceSample)

    return this.uploadRequest("/users/enable-voice-auth", formData)
  }

  async disableVoiceAuth() {
    return this.request("/users/disable-voice-auth", {
      method: "POST",
    })
  }
}

export const apiClient = new APIClient()