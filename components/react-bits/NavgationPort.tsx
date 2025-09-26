import { useState, useEffect } from 'react';
import { Menu, X, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'About', sectionId: 'about-me' },
    { label: 'Work', sectionId: 'achievements' },
    { label: 'Contact', sectionId: 'contact' },
  ];

  return (
    <>
      {/* Pill-shaped Navigation Bar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className={cn(
          "px-6 py-3 rounded-full border border-white/20 transition-all duration-500 backdrop-blur-sm",
          isScrolled 
            ? "bg-black/80 shadow-2xl shadow-portfolio-accent/20" 
            : "bg-black/40"
        )}>
          <div className="flex items-center justify-between min-w-[300px] md:min-w-[400px]">
            {/* Logo Section */}
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center space-x-2 group"
            >
              <div className="p-2 rounded-lg bg-portfolio-accent/20 group-hover:bg-portfolio-accent/30 transition-all duration-300">
                <Code className="w-4 h-4 text-portfolio-accent" />
              </div>
              <span className="text-white font-semibold group-hover:text-portfolio-accent transition-colors duration-300">
                John Doe
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.sectionId}
                  onClick={() => scrollToSection(item.sectionId)}
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 nav-btn-enhanced"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-40 md:hidden transition-all duration-300",
        isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={cn(
          "absolute top-20 left-1/2 transform -translate-x-1/2 w-80 bg-black/90 rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-300",
          isMobileMenuOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}>
          <div className="p-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => scrollToSection(item.sectionId)}
                className="w-full text-left py-3 px-4 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;