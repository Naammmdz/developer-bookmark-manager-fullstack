import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const LandingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 1, label: 'Features', href: '#features' },
    { id: 2, label: 'Pricing', href: '#pricing' },
    { id: 3, label: 'About', href: '#about' },
    { id: 4, label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full -translate-y-4 animate-fade-in border-b border-white/10 bg-background/80 backdrop-blur-md opacity-0">
        <div className="container flex h-14 items-center justify-between px-8">
          <Link className="text-md flex items-center font-bold text-white ml-80" to="/landing">
            Dev Bookmarks
          </Link>

          <div className="hidden md:flex ml-auto h-full items-center space-x-6">
            <Link className="mr-6 text-sm text-white/80 hover:text-white transition-colors" to="/">
              Dashboard
            </Link>
            <Link 
              to="/" 
              className="rounded-lg bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors"
            >
              Get Started
            </Link>
          </div>

          <button 
            className="md:hidden text-white/80 hover:text-white" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="fixed left-0 top-0 z-40 h-screen w-full overflow-auto bg-background/90 backdrop-blur-md md:hidden">
          <div className="container flex h-14 items-center justify-between px-6">
            <Link className="text-md flex items-center font-bold text-white" to="/landing">
              Dev Bookmarks
            </Link>
            <button 
              className="text-white/80 hover:text-white" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <ul className="flex flex-col space-y-4 px-6 py-8">
            {menuItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="block py-2 text-lg text-white/80 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-4">
              <Link 
                to="/" 
                className="block w-full rounded-lg bg-primary hover:bg-primary/90 px-4 py-3 text-center font-medium text-primary-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default LandingHeader;
