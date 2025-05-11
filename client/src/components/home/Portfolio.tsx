import { motion, useAnimationControls } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Link } from "wouter";

// Featured case study
const featuredProject = {
  id: 0,
  title: "Green Home Path",
  subtitle: "10,000+ Qualified Energy Leads Captured",
  description: "We built a custom lead system that scraped location- and problem-specific homeowners interested in heat pump installation. These leads were resold profitably to local contractors — now over 10,000 captured and counting.",
  tag: "Lead Gen System",
  link: "/case-studies/green-home-path"
};

// Project list for vertical scrolling
const projectList = [
  { id: 1, name: "Juger Clothing", tag: "DTC Fashion Brand" },
  { id: 2, name: "Thompson Towers", tag: "Event Venue Funnel" },
  { id: 3, name: "Nvision Shades", tag: "Product Pre-Launch" },
  { id: 4, name: "Trading IQ", tag: "Investor-Focused Waitlist" },
  { id: 5, name: "Clarity Supplements", tag: "Ad Campaign Build" },
  { id: 6, name: "You?", tag: "Next Case Study In Progress" }
];

export default function Portfolio() {
  // Animation controls for the scrolling effect
  const controls = useAnimationControls();
  const scrollerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Set up the automatic scrolling of project list
    const startAnimation = async () => {
      if (scrollerRef.current) {
        const itemHeight = 90; // Approximate height of a single item
        const totalHeight = itemHeight * projectList.length;
        const listHeight = itemHeight * 4; // Display 4 items at once
        
        let currentPosition = 0;
        
        // Animation interval
        const interval = setInterval(() => {
          currentPosition = (currentPosition + 1) % projectList.length;
          
          controls.start({
            y: -currentPosition * itemHeight,
            transition: {
              duration: 0.8,
              ease: "easeInOut"
            }
          });
          
          // Reset position when we reach the end to create a smooth loop
          if (currentPosition === projectList.length - 4) {
            setTimeout(() => {
              controls.set({ y: 0 });
              currentPosition = 0;
            }, 5000);
          }
        }, 5000);
        
        return () => clearInterval(interval);
      }
    };
    
    startAnimation();
  }, [controls]);
  
  return (
    <section id="impact" className="py-20 bg-orange-50/40 relative overflow-hidden">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 pointer-events-none" style={{ 
        backgroundImage: `linear-gradient(to right, rgba(251, 146, 60, 0.05) 1px, transparent 1px), 
                        linear-gradient(to bottom, rgba(251, 146, 60, 0.05) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        backgroundPosition: 'center center'
      }}></div>
      
      <motion.div 
        className="container mx-auto px-4 relative py-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h2 className="font-poppins font-bold text-3xl md:text-[44px] mb-4">
            Where We've Made an <span className="inline-block bg-orange-300/30 px-2 text-orange-600 rounded relative">Impact</span>
          </h2>
          <p className="text-gray-600 md:text-lg font-medium max-w-xl mx-auto">Real brands. Real results.</p>
          <div className="w-24 h-1 bg-orange-400 rounded-full mx-auto mt-6 opacity-70"></div>
        </motion.div>
        
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* LEFT COLUMN: Featured Case Study */}
          <motion.div
            className="w-full"
            variants={fadeInUp}
            custom={1}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full border border-orange-100 shadow-orange-100/10 relative">
              {/* Orange glow background effect */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-300/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="p-8 md:p-10 relative">
                <div className="mb-6">
                  <span className="text-sm text-orange-600 font-medium uppercase tracking-wider">Featured Case Study</span>
                </div>
                
                <h3 className="font-poppins font-bold text-2xl md:text-3xl mb-2">{featuredProject.title}</h3>
                <div className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  {featuredProject.tag}
                </div>
                
                <h4 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
                  {featuredProject.subtitle}
                </h4>
                
                <p className="text-gray-600 mb-8 text-base leading-relaxed">
                  {featuredProject.description}
                </p>
                
                <Link href={featuredProject.link} className="inline-flex items-center gradient-bg text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-300 hover:translate-y-[-2px] group">
                  See How We Did It
                  <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* RIGHT COLUMN: Scrolling Project List */}
          <motion.div
            className="w-full relative"
            variants={fadeInUp}
            custom={2}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[450px] md:h-full border border-orange-100 shadow-orange-100/10">
              <div className="p-8 h-full">
                {/* Visible list container with overflow mask */}
                <div className="relative h-full overflow-hidden mt-2">
                  {/* Fade gradient at top and bottom */}
                  <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
                  
                  {/* Scrolling list */}
                  <motion.div
                    ref={scrollerRef}
                    className="pt-8 pb-12"
                    animate={controls}
                    initial={{ y: 0 }}
                  >
                    {/* Duplicate the list items for seamless scrolling */}
                    {[...projectList, ...projectList].map((project, index) => (
                      <motion.div 
                        key={`${project.id}-${index}`}
                        className="mb-8 transition-all duration-300 hover:translate-x-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-orange-400 mr-4"></div>
                          <div>
                            <h4 className="font-poppins font-semibold text-xl mb-1 text-gray-800">{project.name}</h4>
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                              {project.tag}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
