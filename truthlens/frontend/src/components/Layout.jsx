import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WavyBackground from './visuals/WavyBackground';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <WavyBackground />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'glass text-text-primary border border-white/10 rounded-2xl shadow-2xl',
          duration: 4000,
          style: {
            background: 'rgba(22, 22, 42, 0.8)',
            backdropFilter: 'blur(16px)',
          }
        }}
      />
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
