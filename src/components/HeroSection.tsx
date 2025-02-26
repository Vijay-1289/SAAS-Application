
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 animate-fade-up">
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary animate-slide-up-fade">
            <Zap className="w-4 h-4 mr-2" />
            Powered by AI
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Transform Your Images with{" "}
            <span className="text-primary">AI Magic</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enhance, transform, and create stunning visuals with our AI-powered
            tools. Fast, easy, and simply magical.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto glass-button"
            >
              View Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl transform rotate-12" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl transform -rotate-12" />
      </div>
    </div>
  );
};

export default HeroSection;
