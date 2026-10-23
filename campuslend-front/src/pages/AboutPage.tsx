import { Heart, ShieldCheck, Users, Leaf } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            About <span className="text-primary">CampusLend</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Fostering a sharing economy within campus communities — borrow what you need,
            share what you have, and build a sustainable campus together.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-2xl p-8 shadow-glass hover:shadow-glass-hover transition-all duration-300 hover:-translate-y-1">
            <div className="bg-primary/10 rounded-xl p-3 w-fit mb-4">
              <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h2>
            <p className="text-gray-500 leading-relaxed">
              Reduce waste and save money by enabling students to borrow and lend items
              within their university community.
            </p>
          </div>
          <div className="glass rounded-2xl p-8 shadow-glass hover:shadow-glass-hover transition-all duration-300 hover:-translate-y-1">
            <div className="bg-success/10 rounded-xl p-3 w-fit mb-4">
              <ShieldCheck className="h-6 w-6 text-success" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Trust & Safety</h2>
            <p className="text-gray-500 leading-relaxed">
              Every user is verified with their university email, ensuring a safe
              and trusted environment for all transactions.
            </p>
          </div>
          <div className="glass rounded-2xl p-8 shadow-glass hover:shadow-glass-hover transition-all duration-300 hover:-translate-y-1">
            <div className="bg-warning/10 rounded-xl p-3 w-fit mb-4">
              <Leaf className="h-6 w-6 text-warning" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sustainability</h2>
            <p className="text-gray-500 leading-relaxed">
              By sharing resources instead of buying new, we reduce environmental impact
              and build a greener campus.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="glass rounded-2xl p-8 shadow-glass">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Users className="h-7 w-7 mr-3 text-primary" aria-hidden="true" />
            How It Works
          </h2>
          <ol className="space-y-4">
            {[
              'List items you\'re willing to lend',
              'Browse available items from fellow students',
              'Request to borrow items through secure email',
              'Arrange pickup/delivery directly with the lender',
              'Return items on time to build trust in the community',
            ].map((step, index) => (
              <li key={index} className="flex items-start space-x-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <span className="text-gray-600 leading-relaxed pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
