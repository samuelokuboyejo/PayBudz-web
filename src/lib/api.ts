import { CreateWalletDto, WalletCashoutDto } from "@/types/wallet"
import { getAuth } from "firebase/auth";
import axios, { type AxiosError } from "axios"

// const API_BASE_URL = "http://localhost:3001" 
const API_BASE_URL = "https://paybudz-api-staging.kochtech.xyz"

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use(async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) return null

    try {
        const { data } = await api.post(`/auth/refresh-auth?refreshToken=${refreshToken}`)
        localStorage.setItem("accessToken", data.idToken)
        localStorage.setItem("refreshToken", data.refreshToken)
        return data.idToken
    } catch (err) {
        console.error("Failed to refresh token", err)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        return null
    }
}


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const newToken = await refreshToken()
            if (newToken) {
                error.config.headers.Authorization = `Bearer ${newToken}`
                return api.request(error.config)
            }
        }
        return Promise.reject(error)
    },
)

export const authApi = {
    async signUpWithGoogle(idToken: string) {
        const response = await api.post("/auth/signup", { idToken })
        return response.data
    },

}


export const walletApi = {
    async createWallet(dto: CreateWalletDto) {
        const response = await api.post("/wallets", dto)
        return response.data
    },
    async fetchWalletById(walletId: string) {
        const response = await api.get(`/wallets/${walletId}`)
        return response.data
    },

    async activateWallet(walletId: string) {
        const response = await api.put(`/wallets/${walletId}/activate`)
        return response.data
    },

    async deactivateWallet(walletId: string) {
        const response = await api.put(`/wallets/${walletId}/deactivate`)
        return response.data
    },

    async getWalletBalance(walletId: string) {
        const response = await api.get(`/wallets/${walletId}/balance`)
        return response.data
    },

    async initiateTopUp(amount: number, currency: string) {
        const response = await api.post("/wallets/topup", { amount, currency })
        return response.data
    },

    async initiateCashout(payload: WalletCashoutDto) {
        const response = await api.post("/wallets/cashout", payload)
        return response.data
    },
}

export const transferApi ={
    async transferFunds(dto: {
        destinationUsername: string
        amount: number
        currency: string
        idempotencyKey?: string
    }) {
        const response = await api.post("/transfers", dto)
        return response.data
    },

}

export const userApi = {
    async getProfile() {
        const response = await api.get("/users/me")
        return response.data
    },

    async checkUsernameAvailability(username: string) {
        const response = await api.get("/users/username-availability", {
            params: { username },
        })
        return response.data
    },

    async updateUsername(userId: string, username: string) {
        const response = await api.patch(`/users/${userId}/username`, { username })
        return response.data
    },

    async getUserByWalletId(walletId: string) {
        const response = await api.get(`/users/${walletId}`)
        return response.data
    },
}

export const transactionApi = {
    async getTransactions(filters?: {
        status?: string
        currency?: string
        sort?: "ASC" | "DESC"
        page?: number
        limit?: number
    }) {
        const response = await api.get("/transactions/history", {
            params: filters,
        })
        return response.data
    },
}

export const adminUserApi = {
    async searchUser(query: string) {
        const response = await api.get("/admin/users/search", { params: { query } })
        return response.data
    },
    
    async deactivateWallet(userId: string) {
        const response = await api.patch(`/admin/users/${userId}/deactivate`)
        return response.data
    },

    async reactivateWallet(userId: string) {
        const response = await api.patch(`/admin/users/${userId}/reactivate`)
        return response.data
    },

    async getUserTransactions(
        userId: string,
        filters?: {
            status?: string
            currency?: string
            type?: "DEBIT" | "CREDIT"
            fromDate?: string
            toDate?: string
            sort?: "ASC" | "DESC"
            page?: number
            limit?: number
        },
    ) {
        const response = await api.get(`/admin/users/${userId}/transactions`, {
            params: filters,
        })
        return response.data
    },
}


export const adminAnalyticsApi = {

    async getAnalytics() {
        const response = await api.get("/admin/analytics")
        return response.data
    },

    async getTransactionVolume() {
        const response = await api.get("/admin/charts/transactions")
        return response.data
    },


    async getNewUsers() {
        const response = await api.get("/admin/charts/new-users")
        return response.data
    },


    async getTopUsers(limit = 10) {
        const response = await api.get("/admin/charts/top-users", {
            params: { limit },
        })
        return response.data
    },
}