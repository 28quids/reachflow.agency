import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";

// Notification color palette
const notificationColors = [
  "bg-teal-600",
  "bg-rose-500",
  "bg-purple-600",
  "bg-orange-600",
  "bg-blue-600",
  "bg-green-600",
  "bg-pink-600",
  "bg-yellow-500",
  "bg-indigo-600",
  "bg-red-600",
  "bg-cyan-600"
];

// Notification pool (10 unique events)
const notificationPool = [
  { message: "New lead qualified", color: "bg-teal-600" },
  { message: "You've booked a new meeting", color: "bg-rose-500" },
  { message: "Meeting confirmed with Sarah for 2pm", color: "bg-purple-600" },
  { message: "Payment received from client", color: "bg-orange-600" },
  { message: "Follow-up scheduled for tomorrow", color: "bg-blue-600" },
  { message: "Lead replied to your email", color: "bg-green-600" },
  { message: "Proposal sent to prospect", color: "bg-pink-600" },
  { message: "Contract signed!", color: "bg-yellow-500" },
  { message: "Demo requested by lead", color: "bg-indigo-600" },
  { message: "Call scheduled with Alex", color: "bg-cyan-600" }
];

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Transform values for floating calendar icons - using transform3d for GPU acceleration
  const y1 = useTransform(scrollYProgress, [0, 1], ['translate3d(0, 0, 0)', 'translate3d(0, -20px, 0)']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['translate3d(0, 0, 0)', 'translate3d(0, -30px, 0)']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['translate3d(0, 0, 0)', 'translate3d(0, -15px, 0)']);

  // Only 3 notifications visible, cycling through 10 events
  const [visibleNotifications, setVisibleNotifications] = useState([
    { id: 1, title: "REACHFLOW", message: notificationPool[0].message, time: "now", color: notificationPool[0].color },
    { id: 2, title: "REACHFLOW", message: notificationPool[1].message, time: "1m ago", color: notificationPool[1].color },
    { id: 3, title: "REACHFLOW", message: notificationPool[2].message, time: "2m ago", color: notificationPool[2].color }
  ]);
  const poolIndex = useRef(3);
  const notificationId = useRef(4);

  // Add prefers-reduced-motion check and Safari detection
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [isSafari, setIsSafari] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for Safari
      const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      setIsSafari(isSafariBrowser);
      
      // Check for prefers-reduced-motion
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setShouldAnimate(!mediaQuery.matches && !isSafariBrowser);
      
      const handleChange = (e: MediaQueryListEvent) => {
        setShouldAnimate(!e.matches && !isSafariBrowser);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const cycle = () => {
      const next = notificationPool[poolIndex.current % notificationPool.length];
      const newNotification = {
        id: notificationId.current++,
        title: "REACHFLOW",
        message: next.message,
        time: "now",
        color: next.color
      };
      poolIndex.current++;

      setVisibleNotifications(prev => {
        const updated = [...prev, newNotification];
        return updated.length > 3 ? updated.slice(1) : updated;
      });

      timeoutId = setTimeout(cycle, 1700); // Changed to 1.7s for faster rotation
    };

    timeoutId = setTimeout(cycle, 1700); // Initial timeout also changed to 1.7s

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section ref={containerRef} className="pt-28 pb-24 md:pt-36 md:pb-32 relative overflow-hidden">
      {/* Geometric pattern background */}
      <div className="absolute inset-0 opacity-10 geometric-pattern"></div>
      
      {/* Abstract wave background with enhanced blurs */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-orange-100/40 to-transparent"></div>
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-orange-300 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-coral-300 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-40 bg-orange-100 rounded-full opacity-20 blur-3xl transform rotate-6"></div>
      </div>
      
      <motion.div 
        className="container mx-auto px-4 relative"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Floating Marketing Icons - Added more icons in dead space */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          {/* Top right calendar icon */}
          <motion.div 
            className="absolute top-10 right-10 md:right-20 lg:right-[10%] hidden md:block"
            style={{
              y: shouldAnimate ? y1 : 0,
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
            initial={{ opacity: 0, rotate: 10 }}
            animate={{ 
              opacity: 1, 
              rotate: [4, 6, 4, 2, 4],
              y: [0, -18, 0, 18, 0], 
              x: [0, 10, 0, -10, 0] 
            }}
            transition={{ 
              opacity: { duration: 0.8 }, 
              rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut" }, 
              x: { duration: 7, repeat: Infinity, ease: "easeInOut" } 
            }}
          >
            <div className="bg-white rounded-lg shadow-lg p-2 border border-orange-100 shadow-orange-100/50">
              <div className="flex justify-between items-center mb-1 pb-1 border-b border-gray-100">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <div className="w-12 h-3 bg-gray-200 rounded-full"></div>
              </div>
              <div className="grid grid-cols-5 gap-[2px]">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-3 w-3 rounded-sm ${i === 2 || i === 7 ? 'bg-orange-500' : 'bg-gray-200'}`}
                  ></div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Bottom left booked slot */}
          <motion.div 
            className="absolute bottom-20 left-8 md:left-[15%] hidden md:block"
            style={{ 
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
            initial={{ opacity: 0, rotate: -5 }}
            animate={{ 
              opacity: 1, 
              rotate: [-4, -2, -4],
              y: [0, -10, 0]
            }}
            transition={{ 
              opacity: { duration: 0.6 }, 
              rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div className="bg-white rounded-lg shadow-lg p-2 border border-orange-100 shadow-orange-100/50 transform rotate-12">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
                <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
              </div>
              <div className="bg-orange-100 rounded px-1 py-0.5 text-[8px] text-orange-800 font-medium w-fit">
                BOOKED
              </div>
            </div>
          </motion.div>
          
          {/* Top left calendar icon */}
          <motion.div 
            className="absolute top-24 left-4 md:left-[5%] lg:left-[15%] hidden md:block"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
            initial={{ opacity: 0, rotate: -15 }}
            animate={{ 
              opacity: 1, 
              rotate: [-12, -10, -12, -14, -12],
              y: [0, -25, 0, 25, 0], 
              x: [0, 15, 0, -15, 0] 
            }}
            transition={{ 
              opacity: { duration: 0.8 }, 
              rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut" }, 
              x: { duration: 7, repeat: Infinity, ease: "easeInOut" } 
            }}
          >
            <div className="bg-white rounded-lg shadow-lg p-1.5 border border-orange-100 shadow-orange-100/50 transform -rotate-6">
              <div className="flex space-x-1 mb-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-gray-200 rounded-full"></div>
                ))}
              </div>
              <div className="flex space-x-1">
                <div className="w-4 h-4 bg-orange-500 rounded-md flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="w-6 h-2 bg-gray-200 rounded-full mt-1"></div>
              </div>
            </div>
          </motion.div>
          
          {/* Bottom right marketing icon - graph chart */}
          <motion.div 
            className="absolute bottom-40 right-8 md:right-[8%] lg:right-[18%] hidden md:block"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
            initial={{ opacity: 0, rotate: 8 }}
            animate={{ 
              opacity: 1, 
              rotate: [6, 8, 6, 4, 6],
              y: [0, -22, 0, 22, 0], 
              x: [0, 12, 0, -12, 0] 
            }}
            transition={{ 
              opacity: { duration: 0.8 }, 
              rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 8, repeat: Infinity, ease: "easeInOut" }, 
              x: { duration: 8, repeat: Infinity, ease: "easeInOut" } 
            }}
          >
            <div className="bg-white rounded-lg shadow-lg p-2 border border-orange-100 shadow-orange-100/50 transform rotate-3">
              <div className="flex justify-between items-center mb-2">
                <div className="w-10 h-2 bg-gray-200 rounded-full"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
              <div className="flex items-end space-x-1 h-10">
                {[40, 65, 35, 85, 50, 70].map((height, i) => (
                  <div 
                    key={i} 
                    className="w-2 bg-orange-400 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Moved '+5' icon to below the bar chart (bottom right), with slight angle */}
          <motion.div 
            className="absolute bottom-8 right-8 md:right-[8%] lg:right-[18%] hidden md:block"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
            initial={{ opacity: 0, rotate: 6 }}
            animate={{ 
              opacity: 1, 
              rotate: [6, 8, 6, 4, 6],
              y: [0, -18, 0, 18, 0], 
              x: [0, 12, 0, -12, 0] 
            }}
            transition={{ 
              opacity: { duration: 0.8 }, 
              rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 8, repeat: Infinity, ease: "easeInOut" }, 
              x: { duration: 8, repeat: Infinity, ease: "easeInOut" } 
            }}
          >
            <div className="bg-white rounded-lg shadow-lg p-2 border border-orange-100 shadow-orange-100/50 transform rotate-6">
              <div className="flex space-x-2 mb-1">
                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">+5</span>
                </div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-5 h-5 bg-gray-200 rounded-full"></div>
                ))}
              </div>
              <div className="w-16 h-2 bg-gray-200 rounded-full mt-1"></div>
            </div>
          </motion.div>
          
          {/* Bottom left marketing icon - engagement metrics */}
          <motion.div 
            className="absolute bottom-48 left-8 md:left-[12%] hidden md:block"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
            initial={{ opacity: 0, rotate: -5 }}
            animate={{ 
              opacity: 1, 
              rotate: [-3, -1, -3, -5, -3],
              y: [0, -18, 0, 18, 0], 
              x: [0, 10, 0, -10, 0] 
            }}
            transition={{ 
              opacity: { duration: 0.8 }, 
              rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut" }, 
              x: { duration: 7, repeat: Infinity, ease: "easeInOut" } 
            }}
          >
            <div className="bg-white rounded-lg shadow-lg p-2 border border-orange-100 shadow-orange-100/50 transform rotate-3">
              <div className="flex mb-1">
                <div className="w-3 h-3 bg-orange-500 rounded-sm mr-1"></div>
                <div className="w-8 h-2 bg-gray-200 rounded-full mt-0.5"></div>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <div className="h-2 w-6 bg-orange-400 rounded-full"></div>
                <div className="text-[8px] text-gray-500 font-medium">+87%</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.p 
            className="uppercase text-xs font-semibold tracking-wider text-orange-600 mb-4 px-3 py-1 bg-orange-50 rounded-full"
            variants={fadeInUp}
          >
            ATTENTION BUSINESSES
          </motion.p>
          
          <motion.h1 
            className="font-poppins font-bold text-4xl md:text-5xl lg:text-[56px] leading-tight mb-8 relative tracking-tight"
            variants={fadeInUp}
          >
            We Build Marketing Systems That <span className="inline-block bg-orange-300/30 px-2 text-orange-600 rounded relative">Attract</span>, <span className="inline-block bg-orange-300/30 px-2 text-orange-600 rounded relative">Capture</span> & <span className="inline-block bg-orange-300/30 px-2 text-orange-600 rounded relative">Convert</span> More Customers
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-10 max-w-2xl"
            variants={fadeInUp}
          >
            We'll patch up your leaky funnel with a high-converting, custom-built acquisition engine - proven to drive traffic and consistent revenue.
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="mb-16 relative"
          >
            {/* Orange glow behind button */}
            <div className="absolute -inset-4 bg-orange-400/20 blur-2xl rounded-full -z-10"></div>
            
            <Link 
              href="/audit"
              className="inline-block gradient-bg text-white font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:brightness-110 transition-all hover:translate-y-[-2px] animate-pulse-glow"
            >
              Get A Free Marketing Audit
              <span className="block text-sm mt-1 opacity-90 font-medium">(in less than 48hrs)</span>
            </Link>
          </motion.div>
          
          {/* Notification stack with layout animations */}
          <div className="relative mt-2 mb-4" style={{ height: '140px', width: '320px', maxWidth: '100%' }}>
            <motion.ul
              layout
              initial={false}
              className="space-y-[-8px] flex flex-col absolute left-0 right-0 mx-auto max-w-xs w-full"
            >
              <AnimatePresence initial={false} mode="popLayout">
                {visibleNotifications.map((notification, index) => (
                  <motion.li
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      zIndex: 3 - index // Higher index = higher z-index
                    }}
                    exit={{
                      opacity: 0,
                      y: -20,
                      scale: 0.95,
                      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                    }}
                    transition={{
                      layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                    }}
                    className={`${notification.color} rounded-xl p-3 shadow-lg border border-white/20 relative text-white backdrop-blur-sm`}
                    style={{
                      willChange: 'transform, opacity',
                      transform: 'translateZ(0)',
                      marginTop: index === 0 ? 0 : '-8px' // Overlap cards
                    }}
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="font-bold text-sm">{notification.title}</div>
                          <div className="text-xs text-white/80">{notification.time}</div>
                        </div>
                        <div className="text-sm font-medium mt-0.5">{notification.message}</div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
