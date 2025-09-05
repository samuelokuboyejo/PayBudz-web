import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send, User } from "lucide-react";
import { useState } from "react";

interface SendMoneyProps {
  onBack: () => void;
  onSend: (recipient: string, amount: number, note: string) => void;
}

export const SendMoney = ({ onBack, onSend }: SendMoneyProps) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<"recipient" | "amount" | "confirm">("recipient");

  const handleNext = () => {
    if (step === "recipient" && recipient) {
      setStep("amount");
    } else if (step === "amount" && amount) {
      setStep("confirm");
    }
  };

  const handleSend = () => {
    onSend(recipient, parseFloat(amount), note);
  };

  const quickAmounts = [10, 25, 50, 100];

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
                <h2 className="text-2xl font-bold text-foreground mb-2">Who are you sending to?</h2>
                <p className="text-muted-foreground">Enter their username or email</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Username or Email</Label>
                  <Input
                    id="recipient"
                    type="text"
                    placeholder="@username or email@example.com"
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

            {/* Recent Recipients */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent</h3>
              <div className="space-y-2">
                {["@sarah_m", "@mike.johnson", "@alexk"].map((user) => (
                  <Card 
                    key={user}
                    className="p-4 cursor-pointer hover:shadow-elevated transition-all duration-300"
                    onClick={() => setRecipient(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{user}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === "amount" && (
          <div className="space-y-6">
            <Card className="p-6 shadow-elevated">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">How much?</h2>
                <p className="text-muted-foreground">Sending to {recipient}</p>
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
                <h2 className="text-2xl font-bold text-foreground mb-2">Confirm Payment</h2>
                <p className="text-muted-foreground">Review your payment details</p>
              </div>

              <div className="space-y-6">
                <div className="text-center p-6 bg-accent-light rounded-lg">
                  <div className="text-4xl font-bold text-accent mb-2">
                    ${parseFloat(amount).toFixed(2)}
                  </div>
                  <p className="text-accent font-medium">to {recipient}</p>
                  {note && <p className="text-sm text-muted-foreground mt-2">"{note}"</p>}
                </div>

                <div className="space-y-3 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">${parseFloat(amount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSend}
                  variant="success" 
                  size="lg"
                  className="w-full"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Money
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};