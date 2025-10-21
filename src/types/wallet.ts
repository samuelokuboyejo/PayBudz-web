export enum SupportedCurrencies {
    NGN = "NGN",
    USD = "USD",
    EUR = "EUR",
}

export interface CreateWalletDto {
    currency: SupportedCurrencies
}

export interface WalletCashoutDto {
    amount: number
    currency: SupportedCurrencies
    bankAccountNumber: string
    bankCode: string
}

export interface TopUpDto {
    amount: number
    currency: SupportedCurrencies
}
