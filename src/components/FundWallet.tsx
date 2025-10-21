/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, CreditCard } from "lucide-react"
import { toast } from "sonner"
import { walletApi } from "@/lib/api" 

interface FundWalletProps {
  onBack: () => void
}

export const FundWallet = ({ onBack }: FundWalletProps) => {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const quickAmounts = [1000, 5000, 10000, 20000]

  const handleTopUp = async () => {
    try {
      if (!amount || parseFloat(amount) <= 0) {
        toast.error("Please enter a valid amount")
        return
      }

      setLoading(true)
      const response = await walletApi.initiateTopUp(parseFloat(amount), "NGN")

      if (response?.paymentLink) {
        toast.success("Redirecting to payment page...")
        window.location.href = response.paymentLink
      } else {
        toast.error("Unable to get payment link")
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to initiate top-up")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-border">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-xl font-semibold">Fund Wallet</h1>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <Card className="p-6 shadow-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Enter Amount</h2>
            <p className="text-muted-foreground">
              Choose or enter the amount you want to fund
            </p>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-4">
                ₦{amount ? parseFloat(amount).toLocaleString() : "0.00"}
              </div>
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
              onClick={handleTopUp}
              disabled={!amount || parseFloat(amount) <= 0 || loading}
              size="lg"
              className="w-full"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              {loading ? "Processing..." : `Fund ₦${amount || "0.00"}`}
            </Button>
          </div>
        </Card>

        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            🔒 You’ll be redirected to a secure Paystack page to complete your payment.
          </p>
        </div>
      </div>
    </div>
  )
}
