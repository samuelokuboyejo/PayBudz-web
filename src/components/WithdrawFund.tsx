/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Banknote, Wallet, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { walletApi } from "@/lib/api"
import { SupportedCurrencies } from "@/types/wallet"
import { motion, AnimatePresence } from "framer-motion"

export const WithdrawFunds = ({ onBack }: { onBack: () => void }) => {
    const [bankAccountNumber, setBankAccountNumber] = useState("")
    const [bankCode, setBankCode] = useState("")
    const [bankName, setBankName] = useState("")
    const [amount, setAmount] = useState("")
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<"bank" | "amount" | "confirm">("bank")
    const [showSuccess, setShowSuccess] = useState(false)
    const [lastWithdrawal, setLastWithdrawal] = useState({
        amount: 0,
        bankName: "",
        bankAccountNumber: ""
    })

    const bankList = [
        { name: "Access Bank", code: "044" },
        { name: "GTBank", code: "058" },
        { name: "First Bank", code: "011" },
        { name: "UBA", code: "033" },
        { name: "Zenith Bank", code: "057" },
        { name: "Fidelity Bank", code: "070" },
        { name: "Union Bank", code: "032" },
        { name: "Sterling Bank", code: "232" },
        { name: "Wema Bank", code: "035" },
        { name: "Polaris Bank", code: "076" },
        { name: "Opay", code: "999992" },
        { name: "PalmPay", code: "999991" },
        { name: "Moniepoint", code: "50515" },
    ]

    const quickAmounts = [5000, 10000, 20000, 50000]

    const handleNext = () => {
        if (step === "bank" && bankAccountNumber && bankCode) setStep("amount")
        else if (step === "amount" && amount) setStep("confirm")
    }

    const handleWithdraw = async () => {
        setLoading(true)
        try {
            const payload = {
                amount: parseFloat(amount),
                currency: SupportedCurrencies.NGN,
                bankAccountNumber,
                bankCode,
            }

            const response = await walletApi.initiateCashout(payload)
            console.log("Cashout Response:", response)

            setLastWithdrawal({
                amount: parseFloat(amount),
                bankName,
                bankAccountNumber
            })

            setShowSuccess(true)

            setBankAccountNumber("")
            setBankCode("")
            setBankName("")
            setAmount("")
            setStep("bank")
        } catch (err: any) {
            console.error(err)
            toast.error(err?.response?.data?.message || "Failed to initiate withdrawal ❌")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="flex items-center p-4 border-b border-border">
                <Button
                    onClick={step === "bank" ? onBack : () => setStep(step === "confirm" ? "amount" : "bank")}
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="ml-4 text-xl font-semibold">Withdraw Funds</h1>
            </div>

            <div className="flex-1 p-6">
                {step === "bank" && (
                    <Card className="p-6 shadow-md">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Banknote className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Where should we send the money?</h2>
                            <p className="text-muted-foreground">Enter your bank details</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="accountNumber">Bank Account Number</Label>
                                <Input
                                    id="accountNumber"
                                    type="text"
                                    placeholder="e.g. 0123456789"
                                    value={bankAccountNumber}
                                    onChange={(e) => setBankAccountNumber(e.target.value)}
                                    className="h-12 text-center text-lg"
                                />
                            </div>

                            <div>
                                <Label htmlFor="bankCode">Select Bank</Label>
                                <Select
                                    onValueChange={(value) => {
                                        const selected = bankList.find((b) => b.code === value)
                                        setBankCode(value)
                                        setBankName(selected?.name || "")
                                    }}
                                >
                                    <SelectTrigger className="h-12 text-lg text-center">
                                        <SelectValue placeholder="Select your bank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bankList.map((bank) => (
                                            <SelectItem key={bank.code} value={bank.code}>
                                                {bank.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={handleNext}
                                disabled={!bankAccountNumber || !bankCode}
                                size="lg"
                                className="w-full"
                            >
                                Continue
                            </Button>
                        </div>
                    </Card>
                )}

                {step === "amount" && (
                    <Card className="p-6 shadow-md">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold mb-2">How much do you want to withdraw?</h2>
                            <p className="text-muted-foreground">
                                {bankName} - {bankAccountNumber}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="text-5xl font-bold mb-4">₦{amount || "0.00"}</div>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="h-16 text-center text-2xl border-2"
                                    step="0.01"
                                    min="0.01"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                {quickAmounts.map((quickAmount) => (
                                    <Button
                                        key={quickAmount}
                                        onClick={() => setAmount(quickAmount.toString())}
                                        variant="outline"
                                        className="h-12"
                                    >
                                        ₦{quickAmount.toLocaleString()}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                onClick={handleNext}
                                disabled={!amount || parseFloat(amount) <= 0}
                                size="lg"
                                className="w-full"
                            >
                                Continue
                            </Button>
                        </div>
                    </Card>
                )}

                {step === "confirm" && (
                    <Card className="p-6 shadow-md">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold mb-2">Confirm Withdrawal</h2>
                            <p className="text-muted-foreground">Please review your withdrawal details</p>
                        </div>

                        <div className="space-y-6">
                            <div className="text-center p-6 bg-accent/10 rounded-lg">
                                <div className="text-4xl font-bold mb-2">
                                    ₦{parseFloat(amount).toLocaleString()}
                                </div>
                                <p className="font-medium">{bankName}</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Account: {bankAccountNumber}
                                </p>
                            </div>

                            <div className="space-y-3 p-4 bg-muted rounded-lg">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span className="font-medium">₦{parseFloat(amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fee</span>
                                    <span className="font-medium">₦0.00</span>
                                </div>
                                <div className="border-t border-border pt-2">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Total</span>
                                        <span className="font-semibold">₦{parseFloat(amount).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleWithdraw}
                                disabled={loading}
                                size="lg"
                                className="w-full"
                            >
                                {loading ? "Processing..." : (
                                    <>
                                        <Wallet className="h-5 w-5 mr-2" />
                                        Withdraw Funds
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>
                )}
            </div>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white dark:bg-neutral-900 rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-auto"
                        >
                            <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold mb-2">Your withdrawal has been initiated 🎉</h2>
                            <p className="text-muted-foreground mb-4">
                                Amount: <span className="font-semibold text-green-600">₦{lastWithdrawal.amount.toLocaleString()}</span><br />
                                Bank: <span className="font-semibold">{lastWithdrawal.bankName}</span><br />
                                Account: <span className="font-semibold">{lastWithdrawal.bankAccountNumber}</span>
                            </p>
                            <Button
                                variant="default"
                                className="w-full"
                                onClick={() => setShowSuccess(false)}
                            >
                                Done
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
