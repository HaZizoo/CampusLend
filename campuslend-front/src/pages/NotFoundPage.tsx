import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <Compass className="h-10 w-10 text-primary" aria-hidden="true" />
        </div>
        <h1 className="text-8xl font-extrabold text-primary mb-4 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
