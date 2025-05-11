import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/utils";
import { Link } from "wouter";
import { useRef, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function FeaturedCaseStudy() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  // Fallback to window size if hook fails
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  useEffect(() => {
    // Update window width on resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Animation variants
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeInOut" } 
    }
  };

  // Icons for bullet points
  const CheckIcon = () => (
    <svg className="w-5 h-5 text-orange-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  
  // Client project cards for showcase
  const caseStudyCards = [
    { 
      id: 1,
      title: "GREENHOMEPATH",
      rotate: -30, // Increased angle for more dramatic fan effect
      imageUrl: "/assets/images/content/GreenHomePath.png",
    },
    { 
      id: 2,
      title: "TRADINGIQ",
      rotate: 0, // Middle card stays straight
      imageUrl: "/assets/images/TradingIQ.png",
    },
    { 
      id: 3,
      title: "REAL ESTATE CAMPAIGN",
      rotate: 30, // Increased angle for more dramatic fan effect
      imageUrl: "/assets/images/content/GreenHomePath2.png",
    }
  ];

  return (
    <section id="featured-case-study" className="pt-20 pb-32 overflow-hidden relative" style={{ backgroundColor: '#FEFAF7' }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23f97316' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px'
      }}></div>
      
      {/* Bottom gradient for visual polish */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariant}
        >
          <p className="text-gray-500 text-sm uppercase tracking-wider font-medium mb-3">FEATURED CASE STUDY</p>
          <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl mb-4 max-w-4xl mx-auto">
            <span className="relative">
              Examples Of Our <span className="bg-orange-500 text-white px-4 py-1 rounded-md relative inline-block">Best Projects</span>
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mt-4">
            Real marketing projects that delivered exceptional lead generation results for our clients.
          </p>
        </motion.div>
        
        {/* 3D Angled Cards Display - Inspired by reference image */}
        <motion.div 
          className="relative h-[500px] sm:h-[400px] md:h-[420px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.3,
                delayChildren: 0.1
              }
            }
          }}
        >
          {/* Orange glow effects behind the cards */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-orange-400/10 blur-3xl opacity-70 pointer-events-none"></div>
          <div className="absolute left-1/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-orange-500/20 blur-3xl opacity-60 pointer-events-none"></div>
          <div className="absolute right-1/3 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-orange-500/20 blur-3xl opacity-60 pointer-events-none"></div>
          
          <div className="absolute inset-0 flex items-center justify-center perspective">
            {/* IMPORTANT: For proper z-stacking we must ensure the middle card (id 2) is rendered LAST */}
            {[...caseStudyCards]
              // First sort ensures correct position in the DOM for proper stacking context
              .sort((a, b) => {
                // Force middle card (id 2) to be rendered absolutely last in the DOM tree
                if (a.id === 2) return 1; // Push card 2 to the end
                if (b.id === 2) return -1; // Keep other cards before card 2
                // Any other cards maintain their original order
                return a.id - b.id;
              })
              .map((card, index) => {
                // Recalculate the index based on the original position for proper fan layout
                const originalIndex = caseStudyCards.findIndex(c => c.id === card.id);
              // Different positioning for mobile vs desktop
              // On small screens, stack the cards vertically
              const mobileLayout = isMobile || windowWidth < 768;
              // Calculate position for the fan-out effect with 3 cards on desktop
              // Wider spacing for the side cards to create a more pronounced fan effect
              const xPos = mobileLayout ? 0 : ((originalIndex - 1) * 320); // Extra wide spacing for dramatic fan-out
              // On desktop, lift the middle card up slightly to enhance its prominence
              const yPos = mobileLayout 
                ? (originalIndex * 70) - 60 // Vertical stacking on mobile, centered
                : originalIndex === 1 ? -15 : 0; // Middle card higher on desktop
              const zPos = -Math.abs((originalIndex - 1) * 5); // Very subtle z-depth
              // Use less dramatic angles on mobile
              const calculatedRotate = mobileLayout ? (originalIndex === 0 ? -5 : originalIndex === 1 ? 0 : 5) : card.rotate;
              
              return (
                <motion.div
                  key={card.id}
                  className={`absolute ${
                    card.id === 2 
                      ? 'shadow-[0_20px_50px_-5px_rgba(249,115,22,0.5)] ring-2 ring-orange-400/50' 
                      : 'shadow-2xl'
                  } rounded-xl overflow-hidden w-[280px] h-[200px] sm:w-[300px] sm:h-[220px] md:w-[330px] md:h-[240px]`}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1600px',
                    originX: originalIndex < 2 ? 0.65 : 0.35 // Origin point for rotation
                  }}
                  variants={{
                    hidden: { 
                      opacity: 0, 
                      y: 30,
                      x: 0, 
                      rotateY: 0,
                      scale: 0.8,
                      zIndex: 10
                    },
                    visible: { 
                      opacity: 1, 
                      y: yPos, // Use yPos for vertical positioning on mobile
                      x: xPos,
                      rotateY: calculatedRotate,
                      z: zPos,
                      scale: card.id === 2 ? 1.08 : 1, // Middle card slightly larger
                      zIndex: card.id === 2 ? 999 : (card.id === 1 ? 10 : 20), // Extremely high z-index for middle card to ensure it's in front
                      transition: { 
                        duration: 0.8,
                        type: "spring",
                        stiffness: 80,
                        damping: 20
                      }
                    }
                  }}
                  whileHover={{ 
                    y: -15, 
                    scale: 1.08,
                    boxShadow: "0 10px 30px -5px rgba(249, 115, 22, 0.4)",
                    transition: { duration: 0.3 } 
                  }}
                >
                  {/* Display actual image */}
                  <img 
                    src={card.imageUrl} 
                    alt={card.title}
                    className="w-full h-full object-contain bg-white"
                  />
                  
                  {/* Optional title overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <h3 className="text-white text-lg font-semibold text-center">{card.title}</h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        
        {/* Content Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto mt-20">
          {/* Left: Text Callout */}
          <motion.div
            className="flex flex-col justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariant}
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Lead Capture Strategy:</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-gray-700">Hyper-specific pricing & offer visibility</span>
              </li>
              <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-gray-700">Multi-format ad creative testing</span>
              </li>
              <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-gray-700">Clear call-to-action with urgency elements</span>
              </li>
            </ul>
          </motion.div>
          
          {/* Right: Metrics Highlight */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariant}
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-100 rounded-full opacity-50 blur-2xl pointer-events-none"></div>
            
            <div className="flex items-baseline mb-6">
              <span className="text-5xl font-bold text-orange-500">284%</span>
              <span className="ml-2 text-lg text-gray-500">conversion lift</span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-4">
              <div className="text-sm text-gray-500 mb-1">Ad Performance Improvement</div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
                </div>
                <span className="ml-2 text-gray-700 font-bold">87%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-sm text-orange-700 font-medium">CPC Reduction</div>
                <div className="text-2xl font-bold text-gray-800">-41%</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-sm text-orange-700 font-medium">Lead Cost</div>
                <div className="text-2xl font-bold text-gray-800">$12.40</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariant}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Want Ad Creative That Converts?</h3>
          <Link 
            href="/audit"
            className="inline-flex items-center px-6 py-4 bg-orange-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:bg-orange-600 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-orange-400/20 group"
          >
            Request Your Free Audit
            <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}