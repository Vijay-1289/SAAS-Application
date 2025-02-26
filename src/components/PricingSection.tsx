
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out our service",
    features: ["100 credits/month", "Basic AI features", "Email support"],
  },
  {
    name: "Pro",
    price: "$29",
    description: "Best for professionals",
    features: [
      "1000 credits/month",
      "Advanced AI features",
      "Priority support",
      "API access",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large scale needs",
    features: [
      "Unlimited credits",
      "Custom AI models",
      "24/7 support",
      "Dedicated account manager",
    ],
  },
];

const PricingSection = () => {
  return (
    <section
      id="pricing"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that best fits your needs. All plans include our core
            features.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`glass-card p-8 hover-card animate-fade-up relative ${
                plan.popular
                  ? "border-primary/50 shadow-lg shadow-primary/10"
                  : ""
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-x-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-x-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular ? "" : "bg-foreground/5 hover:bg-foreground/10"
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
