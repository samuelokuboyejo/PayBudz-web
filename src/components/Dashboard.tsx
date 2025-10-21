/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Plus, Send, User, Settings, Eye, EyeOff } from "lucide-react"

import { api, userApi, walletApi } from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface DashboardProps {
  onSendMoney: () => void
  onFundWallet: () => void
  onWithdraw: () => void
  onProfile: () => void
}

export const Dashboard = ({ onSendMoney, onFundWallet, onProfile, onWithdraw }: DashboardProps) => {
  const [user, setUser] = useState<{ id: string; firstName: string; lastName: string; email: string; wallets?: Record<string, string> } | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showBalance, setShowBalance] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await userApi.getProfile()
        setUser(userData)

        const walletId = userData.wallets?.NGN
        if (walletId) {
          const balanceData = await walletApi.getWalletBalance(walletId)
          setBalance(balanceData.availableBalance)
        }

        const txResponse = await api.get("/transactions/history", {
          params: { currency: "NGN", sort: "DESC", limit: 5 },
        })
        const transactions = txResponse.data.items || txResponse.data

        const enrichedTransactions = await Promise.all(
          transactions.map(async (tx: any) => {
            try {
              const relatedUser = await userApi.getUserByWalletId(tx.destinationWalletId)
              return {
                ...tx,
                username: relatedUser.username,
              }
            } catch (err) {
              console.warn(`Could not fetch user for wallet ${tx.destinationWalletId}`)
              return { ...tx, username: "Unknown" }
            }
          })
        )

        setTransactions(enrichedTransactions)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        Loading dashboard...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-destructive">
        Could not load user data.
      </div>
    )
  }

  const displayName = `${user.firstName} ${user.lastName}`

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "SUCCESSFUL":
      case "SUCCESS":
        return "bg-green-100 text-green-700 border border-green-200"
      case "FAILED":
        return "bg-red-100 text-red-700 border border-red-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-primary p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary-glow text-primary-foreground">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-primary-foreground font-medium">Hi, {user.firstName}</p>
              <p className="text-primary-foreground/80 text-sm">Welcome back!</p>
            </div>
          </div>
          <Button
            onClick={onProfile}
            variant="glass"
            size="icon"
            className="text-primary-foreground"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-md border border-border/40 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="p-6 flex flex-col items-center text-center space-y-5">
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground text-sm tracking-wide">Current Balance</p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <p className="text-4xl font-bold text-foreground mt-1">
                {showBalance
                  ? balance !== null && !isNaN(Number(balance))
                    ? `₦${Number(balance).toLocaleString()}`
                    : "₦0.00"
                  : "••••••"}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={onFundWallet}
                variant="outline"
                size="sm"
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl border-border/60 
        text-foreground/90 bg-gradient-to-r from-background to-muted/40 
        hover:from-muted/60 hover:to-muted transition-all duration-300 shadow-sm hover:shadow-md
        min-w-[120px]"
              >
                <Plus className="h-4 w-4" />
                <span>Add Money</span>
              </Button>

              <Button
                onClick={onSendMoney}
                size="sm"
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r 
        from-primary/90 to-primary text-primary-foreground shadow-md 
        hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-300
        min-w-[120px]"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </Button>

              <Button
                onClick={onWithdraw}
                size="sm"
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl 
        bg-gradient-to-r from-indigo-500/90 to-indigo-600 text-white shadow-md 
        hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] 
        transition-all duration-300 min-w-[120px]"
              >
                <ArrowUpRight className="h-4 w-4" />
                <span>Withdraw</span>
              </Button>
            </div>
          </div>
        </Card>


      </div>

      <div className="p-6 -mt-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <Button variant="link" size="sm">
              View All
            </Button>
          </div>

          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent transactions.</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx: any) => (
                <Card
                  key={tx.id}
                  className="p-4 shadow-card hover:shadow-elevated transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                          tx.type === "CREDIT"
                            ? "bg-accent-light"
                            : "bg-destructive/10"
                        )}
                      >
                        {tx.type === "CREDIT" ? (
                          <ArrowDownLeft className="h-5 w-5 text-accent" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className="font-medium text-foreground truncate max-w-[200px]"
                          title={tx.username}
                        >
                          {tx.type === "CREDIT"
                            ? `From @${tx.username || "Unknown"}`
                            : `To @${tx.username || "Unknown"}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {tx.createdAt
                            ? new Date(tx.createdAt).toLocaleString()
                            : "Unknown date"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "font-semibold",
                          tx.type === "CREDIT" ? "text-accent" : "text-foreground"
                        )}
                      >
                        {tx.type === "CREDIT" ? "+" : "-"}₦
                        {Number(tx.amount ?? 0).toLocaleString()}
                      </p>
                      <Badge
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 mt-1",
                          getStatusColor(tx.status)
                        )}
                      >
                        {tx.status || "PENDING"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
