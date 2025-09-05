import { useState } from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import { AuthScreen } from "./AuthScreen";
import { Dashboard } from "./Dashboard";
import { SendMoney } from "./SendMoney";
import { FundWallet } from "./FundWallet";
import { UserProfile } from "./UserProfile";
import { useToast } from "@/hooks/use-toast";

type Screen = "welcome" | "auth" | "dashboard" | "send-money" | "fund-wallet" | "profile";

export const PaymentApp = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const { toast } = useToast();

  const handleSignIn = (userData: { name: string; email: string }) => {
    setUser(userData);
    setCurrentScreen("dashboard");
    toast({
      title: "Welcome back!",
      description: `Signed in as ${userData.name}`,
    });
  };

  const handleSendMoney = (recipient: string, amount: number, note: string) => {
    toast({
      title: "Money sent successfully!",
      description: `$${amount.toFixed(2)} sent to ${recipient}`,
    });
    setCurrentScreen("dashboard");
  };

  const handleFundWallet = (amount: number, method: string) => {
    toast({
      title: "Wallet funded!",
      description: `$${amount.toFixed(2)} added to your wallet`,
    });
    setCurrentScreen("dashboard");
  };

  const handleUpdateProfile = (userData: { name: string; email: string; username: string }) => {
    setUser({ name: userData.name, email: userData.email });
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleSignOut = () => {
    setUser(null);
    setCurrentScreen("welcome");
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  if (currentScreen === "welcome") {
    return <WelcomeScreen onGetStarted={() => setCurrentScreen("auth")} />;
  }

  if (currentScreen === "auth") {
    return <AuthScreen onBack={() => setCurrentScreen("welcome")} onSignIn={handleSignIn} />;
  }

  if (!user) return null;

  if (currentScreen === "send-money") {
    return <SendMoney onBack={() => setCurrentScreen("dashboard")} onSend={handleSendMoney} />;
  }

  if (currentScreen === "fund-wallet") {
    return <FundWallet onBack={() => setCurrentScreen("dashboard")} onFund={handleFundWallet} />;
  }

  if (currentScreen === "profile") {
    return (
      <UserProfile 
        user={user}
        onBack={() => setCurrentScreen("dashboard")}
        onUpdateProfile={handleUpdateProfile}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      onSendMoney={() => setCurrentScreen("send-money")}
      onFundWallet={() => setCurrentScreen("fund-wallet")}
      onProfile={() => setCurrentScreen("profile")}
    />
  );
};