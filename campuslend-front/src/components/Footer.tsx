import { Link } from 'react-router-dom';
import { Smartphone, Heart, Shield, HelpCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="bg-primary p-2 rounded-lg">
                <Smartphone className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Campus<span className="text-primary">Lend</span></span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              The premier peer-to-peer lending platform exclusively for university students.
              Borrow what you need, share what you have, and build a sustainable campus.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">Explore Inventory</Link></li>
              <li><Link to="/dashboard" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">My Dashboard</Link></li>
              <li><Link to="/add" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">List an Item</Link></li>
              <li><Link to="/about" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Trust & Safety</h4>
            <ul className="space-y-3">
              <li><button type="button" className="flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 rounded-lg"><Shield className="h-4 w-4 mr-2" aria-hidden="true" /> Verification Process</button></li>
              <li><button type="button" className="flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 rounded-lg"><Heart className="h-4 w-4 mr-2" aria-hidden="true" /> Community Guidelines</button></li>
              <li><button type="button" className="flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 rounded-lg"><HelpCircle className="h-4 w-4 mr-2" aria-hidden="true" /> Support Center</button></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Legal</h4>
            <ul className="space-y-3">
              <li><button type="button" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 rounded-lg">Terms of Service</button></li>
              <li><button type="button" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 rounded-lg">Privacy Policy</button></li>
              <li><button type="button" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 rounded-lg">Cookie Policy</button></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400 font-medium">
            &copy; {currentYear} CampusLend. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-full">Heinrich Heine University</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
