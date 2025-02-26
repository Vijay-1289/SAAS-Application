
import { Card } from "@/components/ui/card";
import { Image, Wand2, Zap } from "lucide-react";

const features = [
  {
    title: "AI-Powered Enhancement",
    description:
      "Transform your images with state-of-the-art AI models for stunning results.",
    icon: Wand2,
  },
  {
    title: "Lightning Fast",
    description:
      "Process images in seconds with our optimized cloud infrastructure.",
    icon: Zap,
  },
  {
    title: "Smart Editing",
    description:
      "Intelligent tools that understand context and make perfect adjustments.",
    icon: Image,
  },
];

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Features that make us special
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the power of AI-driven image processing with our
            cutting-edge features.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="glass-card p-6 hover-card animate-fade-up"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
