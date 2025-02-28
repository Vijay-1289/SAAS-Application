
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Activity,
  CreditCard,
  Image,
  Settings,
  User,
  Wand2,
  Eraser,
  XCircle,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserCredits {
  credits_balance: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number>(0);
  const [processingFeature, setProcessingFeature] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
      } else {
        setUser(user);
        await fetchUserCredits(user.id);
      }
    } catch (error) {
      toast.error("Error checking authentication status");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCredits = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_balance')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      setCredits(data?.credits_balance || 0);
    } catch (error: any) {
      console.error("Error fetching credits:", error);
      toast.error("Error fetching credit balance");
    }
  };

  const handleFeatureUse = async (featureName: string, creditCost: number, redirectPath?: string) => {
    try {
      setProcessingFeature(featureName);
      
      if (credits < creditCost) {
        toast.error("Insufficient credits! Please upgrade your plan.");
        return;
      }

      // Begin transaction
      const { data: updatedCredits, error: updateError } = await supabase
        .from('user_credits')
        .update({ credits_balance: credits - creditCost })
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

      if (updateError) throw updateError;

      // Log transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          credits_spent: creditCost,
          feature_used: featureName,
        });

      if (transactionError) throw transactionError;

      setCredits(credits - creditCost);
      toast.success(`${featureName} activated! ${creditCost} credits used`);
      
      // If a redirect path is provided, navigate to that page
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        // For features without dedicated pages, simulate success
        setTimeout(() => {
          toast.success(`${featureName} completed successfully!`);
          setProcessingFeature(null);
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error processing request:", error);
      toast.error("Error processing request");
      setProcessingFeature(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const features = [
    {
      title: "AI Image Generation",
      icon: Image,
      description: "Generate stunning images using AI",
      color: "bg-purple-500",
      credits: 10,
      action: () => handleFeatureUse("AI Image Generation", 10, "/ai-image-generation"),
    },
    {
      title: "AI Image Enhancer",
      icon: Wand2,
      description: "Enhance images to their best quality",
      color: "bg-blue-500",
      credits: 10,
      action: () => handleFeatureUse("AI Image Enhancer", 10),
    },
    {
      title: "AI Watermark Remover",
      icon: Eraser,
      description: "Remove watermarks from images",
      color: "bg-green-500",
      credits: 20,
      action: () => handleFeatureUse("AI Watermark Remover", 20),
    },
  ];

  const userMenuItems = [
    { title: "Account Settings", icon: Settings, color: "text-gray-600" },
    { title: "Analytics", icon: Activity, color: "text-blue-600" },
    { title: "Billing", icon: CreditCard, color: "text-green-600" },
    { title: "Sign Out", icon: XCircle, color: "text-red-600", action: handleSignOut },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      {/* Top Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold">Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">
                Credits: <span className="text-primary">{credits}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => navigate("/pricing")}
              >
                <ShoppingCart className="w-4 h-4" />
                Buy Credits
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    {user?.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {userMenuItems.map((item, index) => (
                    <div key={item.title}>
                      {index > 0 && <DropdownMenuSeparator />}
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={item.action}
                      >
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span>{item.title}</span>
                      </DropdownMenuItem>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="p-6 glass-card hover-card animate-fade-up"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${feature.color}`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Cost: {feature.credits} credits
                    </span>
                    <Button
                      variant="outline"
                      onClick={feature.action}
                      disabled={processingFeature === feature.title || credits < feature.credits}
                    >
                      {processingFeature === feature.title ? (
                        <>
                          <span className="animate-spin mr-2">⚙️</span>
                          Processing...
                        </>
                      ) : (
                        "Use Feature"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
