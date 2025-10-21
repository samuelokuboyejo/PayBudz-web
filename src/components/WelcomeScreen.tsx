import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-fintech.jpg";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Hero Image */}
        <div className="text-center">
          <img 
            src={heroImage} 
            alt="PayFlow - Social Payments Made Simple" 
            className="w-32 h-32 mx-auto rounded-3xl shadow-glow mb-6"
          />
        </div>

        {/* Welcome Card */}
        <Card className="p-8 bg-gradient-card border-0 shadow-elevated">
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome to PayBudz
              </h1>
              <p className="text-muted-foreground text-lg">
                Send money instantly to friends and family with just their username
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={onGetStarted}
                variant="hero" 
                size="lg" 
                className="w-full"
              >
                Get Started
              </Button>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex-1 h-px bg-border"></div>
                <span>Secure • Fast • Simple</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-accent text-xl">💳</span>
                </div>
                <p className="text-xs text-muted-foreground">Easy Funding</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-accent text-xl">⚡</span>
                </div>
                <p className="text-xs text-muted-foreground">Instant Send</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-accent text-xl">🔒</span>
                </div>
                <p className="text-xs text-muted-foreground">Secure</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};