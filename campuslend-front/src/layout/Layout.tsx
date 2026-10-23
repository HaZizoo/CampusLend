import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col scroll-smooth">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-xl focus:shadow-lg focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-grow w-full" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
