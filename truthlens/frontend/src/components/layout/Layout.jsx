import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ minHeight: '100vh', paddingTop: '56px' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
