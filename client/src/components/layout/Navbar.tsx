import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogoClick = () => {
    // Logo just goes to home page relative to where you left off
    window.location.href = '/';
  };

  const handleServicesClick = () => {
    if (location !== '/') {
      // If not on home page, navigate to home first
      setLocation('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById('services');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If already on home page, scroll to services section
      const element = document.getElementById('services');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleWorkClick = () => {
    if (location !== '/') {
      // If not on home page, navigate to home first
      setLocation('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById('featured-case-study');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If already on home page, scroll to featured case study section
      const element = document.getElementById('featured-case-study');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAuditClick = () => {
    // Free audit always goes to top of audit page
    window.location.href = '/audit';
  };

  const handleContactClick = () => {
    if (location !== '/audit') {
      // If not on audit page, navigate to audit page first
      setLocation('/audit');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById('audit-form');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If already on audit page, scroll to audit form section
      const element = document.getElementById('audit-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100/30">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button onClick={handleLogoClick} className="flex items-center space-x-1">
          {/* ReachFlow Logo */}
          <img src="/assets/images/logo.png" alt="ReachFlow Logo" className="h-12 w-auto" />
        </button>
        
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={handleServicesClick}
            className="font-medium text-gray-700 hover:text-orange-600 transition-colors"
          >
            Services
          </button>
          <button 
            onClick={handleWorkClick}
            className="font-medium text-gray-700 hover:text-orange-600 transition-colors"
          >
            Our Work
          </button>
          <button 
            onClick={handleAuditClick}
            className="font-medium text-gray-700 hover:text-orange-600 transition-colors"
          >
            Free Audit
          </button>
          <button 
            onClick={handleContactClick}
            className="gradient-bg text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:brightness-110 transition-all"
          >
            Contact Us
          </button>
        </div>
        
        <div className="md:hidden">
          <button className="text-gray-700" onClick={toggleMobileMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <motion.div 
        id="mobileMenu" 
        className={cn("md:hidden bg-white w-full py-4 px-4 shadow-md", mobileMenuOpen ? "block" : "hidden")}
        initial="hidden"
        animate={mobileMenuOpen ? "visible" : "hidden"}
        variants={{
          visible: { opacity: 1, height: 'auto' },
          hidden: { opacity: 0, height: 0 }
        }}
      >
        <div className="flex flex-col space-y-4">
          <button 
            onClick={() => {
              handleServicesClick();
              setMobileMenuOpen(false);
            }} 
            className="font-medium text-gray-700 hover:text-orange-600 transition-colors text-left"
          >
            Services
          </button>
          <button 
            onClick={() => {
              handleWorkClick();
              setMobileMenuOpen(false);
            }} 
            className="font-medium text-gray-700 hover:text-orange-600 transition-colors text-left"
          >
            Our Work
          </button>
          <button 
            onClick={() => {
              handleAuditClick();
              setMobileMenuOpen(false);
            }}
            className="font-medium text-gray-700 hover:text-orange-600 transition-colors text-left"
          >
            Free Audit
          </button>
          <button 
            onClick={() => {
              handleContactClick();
              setMobileMenuOpen(false);
            }} 
            className="gradient-bg text-white px-4 py-2 rounded-lg font-medium text-center hover:shadow-lg hover:brightness-110 transition-all"
          >
            Contact Us
          </button>
        </div>
      </motion.div>
    </nav>
  );
}
