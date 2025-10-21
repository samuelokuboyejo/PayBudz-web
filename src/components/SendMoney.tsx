/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Send, User } from "lucide-react"
import { useState } from "react"
import { transferApi } from "@/lib/api"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { SupportedCurrencies } from "@/types/wallet"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2 } from "lucide-react"


export const SendMoney = ({ onBack }: { onBack: () => void }) => {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"recipient" | "amount" | "confirm">("recipient")

  const quickAmounts = [1000, 5000, 10000, 20000]

  const handleNext = () => {
    if (step === "recipient" && recipient) {
      setStep("amount")
    } else if (step === "amount" && amount) {
      setStep("confirm")
    }
  }

  const [showSuccess, setShowSuccess] = useState(false)
  const [lastTransfer, setLastTransfer] = useState<{ amount: number; recipient: string } | null>(null)

  const handleSend = async () => {
    setLoading(true)
    try {
      const payload = {
        destinationUsername: recipient.startsWith("@")
          ? recipient.substring(1)
          : recipient,
        amount: parseFloat(amount),
        currency: SupportedCurrencies.NGN,
        idempotencyKey: uuidv4(),
      }

      const response = await transferApi.transferFunds(payload)

      // ✅ Save details before resetting
      setLastTransfer({
        amount: parseFloat(amount),
        recipient: recipient.startsWith("@") ? recipient : `@${recipient}`,
      })

      // ✅ Show success popup
      setShowSuccess(true)

      console.log("Transfer Response:", response)

      // ✅ Reset input fields AFTER popup shows
      setRecipient("")
      setAmount("")
      setNote("")
      setStep("recipient")
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || "Transfer failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-border">
        <Button
          onClick={step === "recipient" ? onBack : () => setStep(step === "confirm" ? "amount" : "recipient")}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-xl font-semibold">Send Money</h1>
      </div>

      <div className="flex-1 p-6">
        {step === "recipient" && (
          <div className="space-y-6">
            <Card className="p-6 shadow-elevated">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Who are you sending to?</h2>
                <p className="text-muted-foreground">Enter their username (with or without @)</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Username</Label>
                  <Input
                    id="recipient"
                    type="text"
                    placeholder="@username"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="h-12 text-center text-lg"
                    autoFocus
                  />
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!recipient}
                  variant="default"
                  size="lg"
                  className="w-full"
                >
                  Continue
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === "amount" && (
          <div className="space-y-6">
            <Card className="p-6 shadow-elevated">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">How much?</h2>
                <p className="text-muted-foreground">Sending to {recipient}</p>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-4">
                    ₦{amount || "0"}
                  </div>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-16 text-center text-2xl border-2"
                    step="100"
                    min="100"
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

                <div>
                  <Label htmlFor="note">Add a note (optional)</Label>
                  <Input
                    id="note"
                    type="text"
                    placeholder="What's this for?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="h-12"
                  />
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!amount || parseFloat(amount) <= 0}
                  variant="default"
                  size="lg"
                  className="w-full"
                >
                  Continue
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-6">
            <Card className="p-6 shadow-elevated">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Confirm Transfer</h2>
                <p className="text-muted-foreground">Review your details before sending</p>
              </div>

              <div className="space-y-6">
                <div className="text-center p-6 bg-accent-light rounded-lg">
                  <div className="text-4xl font-bold mb-2">
                    ₦{parseFloat(amount).toLocaleString()}
                  </div>
                  <p className="font-medium">to {recipient}</p>
                  {note && <p className="text-sm text-muted-foreground mt-2">"{note}"</p>}
                </div>

                <div className="space-y-3 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">₦{parseFloat(amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-medium">₦0</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">₦{parseFloat(amount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSend}
                  variant="success"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  <Send className="h-5 w-5 mr-2" />
                  {loading ? "Sending..." : "Send Money"}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
      <AnimatePresence>
        {showSuccess && lastTransfer && (
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
              <h2 className="text-2xl font-semibold mb-2">Transfer Successful 🎉</h2>
              <p className="text-muted-foreground mb-4">
                You’ve sent{" "}
                <span className="font-semibold text-green-600">
                  ₦{lastTransfer.amount.toLocaleString()}
                </span>{" "}
                to{" "}
                <span className="font-semibold">{lastTransfer.recipient}</span>
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
