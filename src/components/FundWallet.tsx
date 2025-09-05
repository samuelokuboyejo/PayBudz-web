import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Plus } from "lucide-react";
import { useState } from "react";

interface FundWalletProps {
  onBack: () => void;
  onFund: (amount: number, method: string) => void;
}

export const FundWallet = ({ onBack, onFund }: FundWalletProps) => {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("card");

  const quickAmounts = [25, 50, 100, 200];

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: "💳", description: "Instant funding" },
    { id: "bank", name: "Bank Account", icon: "🏦", description: "1-3 business days" },
    { id: "apple", name: "Apple Pay", icon: "📱", description: "Instant funding" },
  ];

  const handleFund = () => {
    if (amount && parseFloat(amount) > 0) {
      onFund(parseFloat(amount), selectedMethod);
    }
  };

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
        <h1 className="ml-4 text-xl font-semibold">Add Money</h1>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Amount Section */}
        <Card className="p-6 shadow-elevated">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">How much to add?</h2>
            <p className="text-muted-foreground">Choose an amount to fund your wallet</p>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-foreground mb-4">
                ${amount || "0.00"}
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
                  ${quickAmount}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Payment Method Selection */}
        <Card className="p-6 shadow-elevated">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{method.name}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  {selectedMethod === method.id && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Card Details (if card selected) */}
        {selectedMethod === "card" && (
          <Card className="p-6 shadow-elevated">
            <h3 className="text-lg font-semibold mb-4">Card Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="h-12"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    className="h-12"
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Add Money Button */}
        <Button 
          onClick={handleFund}
          disabled={!amount || parseFloat(amount) <= 0}
          variant="success" 
          size="lg"
          className="w-full"
        >
          <CreditCard className="h-5 w-5 mr-2" />
          Add ${amount || "0.00"} to Wallet
        </Button>

        {/* Security Note */}
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            🔒 Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  );
};