import { motion, useAnimationControls } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/utils";
import { useEffect, useRef } from "react";

// Project type definition
type Project = {
  id: number;
  name: string;
  label: string;
};

// Project list from client specifications
const projects: Project[] = [
  { id: 1, name: "Juger Clothing", label: "DTC Fashion Brand" },
  { id: 2, name: "Thompson Towers", label: "Event Venue Funnel" },
  { id: 3, name: "Nvision Shades", label: "Product Pre-Launch" },
  { id: 4, name: "Trading IQ", label: "Investor-Focused Waitlist" },
  { id: 5, name: "Clarity Supplements", label: "Ad Campaign Build" },
  { id: 6, name: "Green Home Path", label: "10K+ Lead Capture System" },
  { id: 7, name: "You?", label: "Next Success Story" }
];

// Create a duplicate set of projects to make the scrolling seamless
const duplicatedProjects = [...projects, ...projects];

// Brand Logo Item component for the scrolling display
const BrandLogoItem = ({ project }: { project: Project }) => {
  const isYou = project.name === "You?";
  return (
    <div
      className={
        `flex flex-col items-center justify-center mx-6 whitespace-nowrap transition-all duration-300 group w-48 ` +
        (isYou
          ? "opacity-100 grayscale-0"
          : "grayscale hover:grayscale-0 opacity-80 hover:opacity-100")
      }
    >
      <div className="text-center">
        {isYou ? (
          <>
            <h3 className="inline-block bg-orange-300/30 px-2 text-orange-600 rounded relative font-bold font-poppins text-lg mb-1">
              {project.name}
            </h3>
            <div className="mt-2">
              <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-orange-50 text-orange-600">
                {project.label}
              </span>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-poppins font-semibold text-gray-800 text-lg mb-1 group-hover:text-orange-500 transition-colors">
              {project.name}
            </h3>
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full transition-colors bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600">
              {project.label}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default function BrandLogoRow() {
  // Animation controls for the scrolling effect
  const controls = useAnimationControls();
  const scrollerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Calculate the total width needed for animation
    if (scrollerRef.current) {
      const scrollWidth = scrollerRef.current.scrollWidth / 2;
      
      // Start the animation sequence
      const startAnimation = async () => {
        await controls.start({
          x: -scrollWidth,
          transition: {
            duration: 25, // Slightly slower for better readability
            ease: "linear",
            repeat: Infinity
          }
        });
      };
      
      startAnimation();
    }
    
    return () => {
      controls.stop();
    };
  }, [controls]);

  return (
    <section className="py-16 border-t border-gray-100 border-b overflow-hidden relative">
      {/* Subtle floating elements in background */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-orange-100 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-orange-50 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-poppins font-bold text-3xl md:text-4xl mb-3">
            Brands We've Helped <span className="inline-block bg-orange-300/30 px-2 text-orange-600 rounded relative">Grow</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">From funded tech to local service operators</p>
        </motion.div>
        
        {/* Automatic scrolling container */}
        <div className="relative w-full overflow-hidden mt-8">
          {/* Hide scrollbar but allow overflow */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          <motion.div
            ref={scrollerRef}
            className="flex items-center py-4"
            animate={controls}
            initial={{ x: 0 }}
          >
            {/* First set of projects */}
            <div className="flex items-center">
              {projects.map((project) => (
                <BrandLogoItem key={`first-${project.id}`} project={project} />
              ))}
            </div>
            
            {/* Duplicated set to create seamless loop */}
            <div className="flex items-center">
              {projects.map((project) => (
                <BrandLogoItem key={`second-${project.id}`} project={project} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}