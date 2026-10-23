import { useState } from 'react';
import BorrowerDashboard from '../components/dashboard/BorrowerDashboard';
import LenderDashboard from '../components/dashboard/LenderDashboard';
import { SwitchCamera } from 'lucide-react';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<'borrower' | 'lender'>('borrower');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
              <button
                onClick={() => setActiveTab('borrower')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${activeTab === 'borrower'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Borrowing
              </button>
              <button
                onClick={() => setActiveTab('lender')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${activeTab === 'lender'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Lending
              </button>
            </div>

            <div className="hidden sm:flex items-center text-sm font-medium text-muted bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
              <SwitchCamera className="h-4 w-4 mr-2 text-primary" />
              Switch modes to manage all activity
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {activeTab === 'borrower' ? <BorrowerDashboard /> : <LenderDashboard />}
      </div>
    </div>
  );
};

export default DashboardPage;

