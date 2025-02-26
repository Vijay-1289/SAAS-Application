
import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/HeroSection";
import NavigationBar from "@/components/NavigationBar";
import PricingSection from "@/components/PricingSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>
    </div>
  );
};

export default Index;
