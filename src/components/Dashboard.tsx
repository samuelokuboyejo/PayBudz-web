import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Plus, Send, User, Settings } from "lucide-react";
import { useState } from "react";

interface DashboardProps {
  user: { name: string; email: string };
  onSendMoney: () => void;
  onFundWallet: () => void;
  onProfile: () => void;
}

export const Dashboard = ({ user, onSendMoney, onFundWallet, onProfile }: DashboardProps) => {
  const [balance] = useState(1250.50);
  
  const recentTransactions = [
    { id: 1, type: "received", amount: 50.00, from: "Sarah M.", time: "2 mins ago" },
    { id: 2, type: "sent", amount: 25.00, to: "Mike Johnson", time: "1 hour ago" },
    { id: 3, type: "received", amount: 100.00, from: "Alex K.", time: "3 hours ago" },
    { id: 4, type: "sent", amount: 75.50, to: "Emma Wilson", time: "Yesterday" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary-glow text-primary-foreground">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-primary-foreground font-medium">Hi, {user.name.split(' ')[0]}</p>
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

        {/* Balance Card */}
        <Card className="bg-card/90 backdrop-blur-sm border-0 shadow-elevated">
          <div className="p-6 text-center">
            <p className="text-muted-foreground text-sm mb-2">Current Balance</p>
            <p className="text-4xl font-bold text-foreground mb-4">
              ${balance.toFixed(2)}
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={onFundWallet}
                variant="outline" 
                size="sm"
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Money
              </Button>
              <Button 
                onClick={onSendMoney}
                variant="default" 
                size="sm"
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Money
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="p-6 -mt-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-light rounded-full flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-foreground">Quick Send</p>
                <p className="text-xs text-muted-foreground">Send to contacts</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Request</p>
                <p className="text-xs text-muted-foreground">Ask for money</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <Button variant="link" size="sm">View All</Button>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'received' 
                        ? 'bg-accent-light' 
                        : 'bg-destructive/10'
                    }`}>
                      {transaction.type === 'received' ? (
                        <ArrowDownLeft className="h-5 w-5 text-accent" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {transaction.type === 'received' 
                          ? `From ${transaction.from}` 
                          : `To ${transaction.to}`
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">{transaction.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'received' 
                        ? 'text-accent' 
                        : 'text-foreground'
                    }`}>
                      {transaction.type === 'received' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                    <Badge variant={transaction.type === 'received' ? 'default' : 'secondary'} className="text-xs">
                      {transaction.type === 'received' ? 'Received' : 'Sent'}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};