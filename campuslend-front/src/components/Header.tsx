import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/about', label: 'About' },
    { to: '/add', label: 'List an Item' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Smartphone className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Campus<span className="text-primary">Lend</span>
              </h1>
              <p className="text-xs text-muted hidden sm:block font-medium">
                University Rental Network
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100" aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${isActive(to)
                  ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200/50'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-100/50'
                  }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors bg-gray-50 border border-gray-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-2 border-t border-gray-100 pt-4 space-y-2 animate-slide-up" aria-label="Mobile navigation">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${isActive(to)
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
