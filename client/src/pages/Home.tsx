import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import BrandLogoRow from "@/components/home/BrandLogoRow";
import Services from "@/components/home/Services";
import FeaturedCaseStudy from "@/components/home/FeaturedCaseStudy";
import AuditForm from "@/components/home/AuditForm";

export default function Home() {
  useEffect(() => {
    document.title = "ReachFlow - Lead Generation Agency";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Navbar />
      <main>
        <Hero />
        <BrandLogoRow />
        <Services />
        <FeaturedCaseStudy />
        <AuditForm />
      </main>
      <Footer />
    </motion.div>
  );
}
