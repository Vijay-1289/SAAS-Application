
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const menuItems = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg"></div>
              <span className="text-xl font-semibold">AImagine</span>
            </Link>
          </div>

          {isMobile ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-primary/10"
            >
              <Menu className="h-6 w-6" />
            </button>
          ) : (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                <Button variant="default" size="sm" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isOpen && (
        <div className="md:hidden glass-card animate-fade-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-primary/10 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2">
              <Button className="w-full" variant="default" size="sm" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
