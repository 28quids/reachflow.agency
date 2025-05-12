import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuditForm from "@/components/home/AuditForm";

// AuditForm Schema
const auditFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  website: z.string()
    .min(1, { message: "Website is required" })
    .transform((val) => {
      // If empty, return as is
      if (!val) return val;
      
      // Remove any existing protocol and www
      let cleanUrl = val.replace(/^(https?:\/\/)?(www\.)?/, '');
      
      // Add https://www. if not present
      return `https://www.${cleanUrl}`;
    }),
  business: z.string().optional(),
  goals: z.array(z.string()).optional(),
});

type AuditFormValues = z.infer<typeof auditFormSchema>;

// The audit process steps
const auditProcess = [
  {
    id: 1,
    title: "Request Audit",
    description: "Fill out our simple form telling us about your business goals and current marketing.",
    icon: (
      <svg className="w-10 h-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
  {
    id: 2,
    title: "We Analyze",
    description: "Our experts review your funnel, website, and competitors to find opportunities and gaps.",
    icon: (
      <svg className="w-10 h-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Get Results",
    description: "We deliver actionable insights and a strategy you can implement right away.",
    icon: (
      <svg className="w-10 h-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

// Why trust us items
const trustItems = [
  {
    title: "Proven Growth Expertise",
    description: "We've generated over 10,000 leads for businesses across various industries with our data-driven approach.",
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    title: "Modern Marketing Systems",
    description: "Our strategies combine cutting-edge tools and techniques designed for today's digital landscape.",
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    title: "Trusted by Businesses",
    description: "We work with businesses across the UK who trust us to deliver quality leads that actually convert.",
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }
];

export default function AuditLanding() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const { toast } = useToast();

  const form = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      name: "",
      email: "",
      website: "",
      business: "",
      goals: [],
    },
    mode: "onChange",
  });

  // Track form progress
  useEffect(() => {
    const values = form.getValues();
    const totalFields = 4; // name, email, website, business
    const filledFields = Object.values(values).filter(value => 
      value && (typeof value === 'string' ? value.length > 0 : Array.isArray(value) ? value.length > 0 : true)
    ).length;
    
    setFormProgress((filledFields / totalFields) * 100);
  }, [form.watch()]);

  const onSubmit = async (data: AuditFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/audit-requests", data);
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Your audit request has been received. We'll be in touch within 48 hours.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (value: string) => {
    const currentGoals = form.getValues().goals || [];
    const newGoals = currentGoals.includes(value)
      ? currentGoals.filter(goal => goal !== value)
      : [...currentGoals, value];
    form.setValue("goals", newGoals);
  };

  const renderAuditForm = (variant: "hero" | "footer" = "hero") => (
    <div className={`bg-white rounded-xl shadow-xl border border-gray-200 ${variant === "hero" ? "p-6 md:p-8" : "p-8"}`}>
      {isSubmitted ? (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-green-200/50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.svg 
              className="w-10 h-10 text-green-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </motion.svg>
          </motion.div>
          <motion.h3 
            className="font-poppins font-bold text-2xl mb-3 text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Thank You!
          </motion.h3>
          <motion.p 
            className="text-gray-600 text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Your audit request has been received. Our team will analyze your marketing and get back to you within 48 hours.
          </motion.p>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-500 opacity-30 blur-lg -z-10 rounded-lg"></div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-gradient-to-r from-green-400 to-green-500 text-white font-medium px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Submit Another Request
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative mb-4">
            <h3 className={`font-bold text-xl ${variant === "hero" ? "" : "text-center"} text-gray-800`}>
              Request Your <span className="text-orange-500">Free Audit</span>
            </h3>
            <p className="text-gray-600 text-sm mt-1">Complete the form below and we'll analyze your current marketing.</p>
            
            {/* Progress bar */}
            <div className="mt-3">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${formProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{Math.round(formProgress)}% Complete</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label htmlFor={`name-${variant}`} className="block text-gray-700 font-medium mb-1 text-sm">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  id={`name-${variant}`}
                  {...form.register("name")} 
                  className={`w-full pl-8 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                    form.formState.errors.name ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="John Smith" 
                />
              </div>
              <AnimatePresence>
                {form.formState.errors.name && (
                  <motion.p 
                    className="text-red-500 text-xs mt-0.5"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {form.formState.errors.name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            
            <div>
              <label htmlFor={`email-${variant}`} className="block text-gray-700 font-medium mb-1 text-sm">Business Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  id={`email-${variant}`}
                  {...form.register("email")} 
                  className={`w-full pl-8 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                    form.formState.errors.email ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="john@yourcompany.com" 
                />
              </div>
              <AnimatePresence>
                {form.formState.errors.email && (
                  <motion.p 
                    className="text-red-500 text-xs mt-0.5"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {form.formState.errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            
            <div>
              <label htmlFor={`website-${variant}`} className="block text-gray-700 font-medium mb-1 text-sm">Website URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  id={`website-${variant}`}
                  {...form.register("website")} 
                  className={`w-full pl-8 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                    form.formState.errors.website ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="yourcompany.com" 
                />
              </div>
              <AnimatePresence>
                {form.formState.errors.website && (
                  <motion.p 
                    className="text-red-500 text-xs mt-0.5"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {form.formState.errors.website.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            
            <div>
              <label htmlFor={`business-${variant}`} className="block text-gray-700 font-medium mb-1 text-sm">Tell us about your goals</label>
              <div className="relative">
                <div className="absolute top-2 left-3 flex items-start pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <textarea 
                  id={`business-${variant}`}
                  {...form.register("business")} 
                  rows={2} 
                  className={`w-full pl-8 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                    form.formState.errors.business ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="What are you looking to achieve? What are your current challenges?" 
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            {/* Button glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-500 opacity-40 blur-lg -z-10 rounded-lg"></div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 rounded-lg shadow-xl hover:shadow-2xl hover:brightness-110 transition-all text-center text-base relative"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                <>
                  <span>Request My Free Audit</span>
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </>
              )}
            </button>
          </div>
          
          {/* Trust badges */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-orange-50/50 rounded-lg p-3 border border-orange-100/50">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600">Secure & Private</p>
              </div>
            </div>
            <div className="bg-orange-50/50 rounded-lg p-3 border border-orange-100/50">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600">No Obligation</p>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-28 pb-24 md:pt-36 md:pb-32 relative overflow-hidden layer-depth">
          <div className="container max-w-6xl mx-auto px-4">
            <motion.div 
              className="text-center mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block uppercase text-xs font-semibold tracking-wider text-orange-600 mb-2 px-3 py-1 bg-orange-50 rounded-full">FREE MARKETING AUDIT</span>
            </motion.div>
          
            <div className="max-w-4xl mx-auto mb-16 text-center">
              <motion.h1 
                className="font-poppins font-bold text-4xl md:text-[44px] mb-6 leading-tight tracking-tight text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div>You Focus on Delivering</div>
                <div><span className="inline-block bg-orange-300/30 px-2 text-orange-600 rounded relative">Great Service</span></div>
                <div>We'll Focus on Delivering <span className="inline-block bg-orange-300/30 px-2 text-orange-600 rounded relative">Great Customers</span></div>
              </motion.h1>
              
              <motion.p 
                className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                We'll analyze your site and funnel - and show you what's broken with a free audit.
              </motion.p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                {/* Form glow effect - reduced opacity and blur for better readability */}
                <div className="absolute -inset-6 bg-gradient-to-r from-orange-200/20 to-orange-400/10 opacity-30 blur-2xl -z-10 rounded-xl"></div>
                {/* Add solid background to ensure form contrast */}
                <div className="absolute inset-0 bg-white/95 rounded-xl -z-5"></div>
                
                {/* Floating elements */}
                <motion.div 
                  className="absolute -right-4 -top-4 hidden md:block z-10"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  <div className="bg-white p-2 rounded-full shadow-lg">
                    <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                </motion.div>
                
                {renderAuditForm("hero")}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="space-y-4"
              >
                <motion.div 
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start">
                    <div className="bg-orange-100 rounded-full p-2 mr-3 mt-1 flex-shrink-0 shadow-inner">
                      <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-800 text-lg font-medium">Still relying on word-of-mouth?</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start">
                    <div className="bg-orange-100 rounded-full p-2 mr-3 mt-1 flex-shrink-0 shadow-inner">
                      <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-800 text-lg font-medium">Site looks outdated on mobile?</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start">
                    <div className="bg-orange-100 rounded-full p-2 mr-3 mt-1 flex-shrink-0 shadow-inner">
                      <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-800 text-lg font-medium">No real marketing strategy?</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* The Best Businesses Often Have the Worst Funnels */}
        <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-transparent relative overflow-hidden -mt-10">
          <div className="container max-w-6xl mx-auto px-4">
            <motion.div 
              className="text-center mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block uppercase text-xs font-semibold tracking-wider text-orange-600 mb-2 px-3 py-1 bg-orange-50 rounded-full">CONVERSION CHALLENGES</span>
            </motion.div>
            
            <motion.div 
              className="max-w-4xl mx-auto mb-16 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="font-poppins font-bold text-3xl md:text-[42px] mb-4 leading-tight tracking-tight text-gray-900">
                The Best Businesses Often Have the <span className="inline-block bg-orange-300/30 px-2 text-orange-600 rounded relative">Worst</span> Funnels. We Fix That.
              </h2>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                className="bg-white rounded-xl p-8 shadow-xl border border-gray-100 relative transition-all duration-500 hover:shadow-2xl hover:border-orange-100"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                whileHover={{ y: -5 }}
              >
                {/* Red tint gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white rounded-xl opacity-40"></div>
                
                <div className="relative">
                  <h3 className="font-poppins font-semibold text-xl md:text-2xl mb-6 text-gray-800">What's Costing You</h3>
                  
                  <ul className="space-y-6">
                    <li className="flex items-start">
                      <div className="bg-red-100 rounded-full p-2 mr-4 mt-1 flex-shrink-0 shadow-md border border-red-200">
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-gray-800 mb-1">Confused visitors leave your site</p>
                        <p className="text-gray-600">They don't understand what you offer or why they should choose you</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="bg-red-100 rounded-full p-2 mr-4 mt-1 flex-shrink-0 shadow-md border border-red-200">
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-gray-800 mb-1">Money wasted on low-quality traffic</p>
                        <p className="text-gray-600">Your ads bring the wrong people who don't convert</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="bg-red-100 rounded-full p-2 mr-4 mt-1 flex-shrink-0 shadow-md border border-red-200">
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-gray-800 mb-1">Leads disappear into the ether</p>
                        <p className="text-gray-600">No proper follow-up system to nurture potential customers</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </motion.div>
              
              <motion.div
                className="bg-white rounded-xl p-8 shadow-xl border border-gray-100 relative transition-all duration-500 hover:shadow-2xl hover:border-orange-100"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                whileHover={{ y: -5 }}
              >
                {/* Green tint gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white rounded-xl opacity-40"></div>
                
                <div className="relative">
                  <h3 className="font-poppins font-semibold text-xl md:text-2xl mb-6 text-gray-800">What You Could Have</h3>
                  
                  <ul className="space-y-6 mb-10">
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-2 mr-4 mt-1 flex-shrink-0 shadow-md border border-green-200">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-gray-800 mb-1">Clear messaging that converts</p>
                        <p className="text-gray-600">Visitors immediately understand your value proposition</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-2 mr-4 mt-1 flex-shrink-0 shadow-md border border-green-200">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-gray-800 mb-1">Targeted traffic that's ready to buy</p>
                        <p className="text-gray-600">Your ads attract the right people at the right time</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-2 mr-4 mt-1 flex-shrink-0 shadow-md border border-green-200">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-gray-800 mb-1">Automated lead nurturing</p>
                        <p className="text-gray-600">Leads automatically followed up with and converted</p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="relative">
                    {/* Floating arrow */}
                    <motion.div 
                      className="absolute -right-4 -top-4 hidden md:block z-10"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      <div className="bg-white p-2 rounded-full shadow-lg">
                        <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </motion.div>
                    
                    {/* Button with glow */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-orange-500 opacity-40 blur-lg -z-10 rounded-xl"></div>
                    <Link 
                      href="#audit-form" 
                      className="block w-full gradient-bg text-white font-semibold py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl hover:brightness-110 transition-all text-center flex items-center justify-center space-x-2"
                    >
                      <span>Get Your Free Audit</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Our Audit Process */}
        <section className="py-24 mt-6 relative overflow-hidden bg-gradient-to-b from-white to-transparent">
          <div className="container max-w-6xl mx-auto px-4 relative">
            <motion.div 
              className="text-center mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block uppercase text-xs font-semibold tracking-wider text-orange-600 mb-2 px-3 py-1 bg-orange-50 rounded-full shadow-sm">SIMPLE & EFFECTIVE</span>
            </motion.div>
            
            <motion.div 
              className="max-w-4xl mx-auto mb-16 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="font-poppins font-bold text-3xl md:text-[42px] mb-4 leading-tight tracking-tight text-gray-900">Our Audit Process</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We make it easy to discover what's holding your marketing back and provide clear steps to improve.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-10">
              {auditProcess.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="bg-white rounded-xl p-8 shadow-xl border border-gray-100 text-center relative transition-all duration-500 hover:shadow-2xl hover:border-orange-100 hover-lift"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  {/* Number badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-lg z-10 animate-pulse-subtle">
                    {step.id}
                  </div>
                  
                  {/* Glowing object behind card */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/5 to-orange-300/10 blur-xl -z-10 rounded-xl opacity-75"></div>
                  
                  {/* Light gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-white rounded-xl opacity-50"></div>
                  
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-orange-200 animate-glow">
                      <div className="flex items-center justify-center w-full h-full">
                        {step.icon}
                      </div>
                    </div>
                    
                    <h3 className="font-poppins font-semibold text-xl md:text-2xl mb-3 text-gray-800">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  
                  {/* Card bottom highlight */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-b-xl"></div>
                </motion.div>
              ))}
            </div>
            
            
            {/* Floating UI elements */}
            <motion.div 
              className="absolute -bottom-2 right-[25%] hidden lg:block z-0"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 0.8, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 1.5 }}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-orange-300 animate-float"></div>
            </motion.div>
          </div>
        </section>
        
        {/* Why Trust ReachFlow */}
        <section className="py-24 relative overflow-hidden bg-white">
          <div className="container max-w-6xl mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block uppercase text-xs font-semibold tracking-wider text-orange-600 mb-2 px-3 py-1 bg-orange-50 rounded-full shadow-sm">EXPERIENCED TEAM</span>
            </motion.div>
            
            <motion.div 
              className="max-w-4xl mx-auto mb-16 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="font-poppins font-bold text-3xl md:text-[42px] mb-4 leading-tight tracking-tight text-gray-900">Why Trust ReachFlow</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Our team brings proven experience and a data-driven approach to marketing.
              </p>
            </motion.div>
            
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 grid md:grid-cols-3 gap-6">
                {trustItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="bg-white rounded-xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:border-orange-100 transition-all duration-300 hover-lift relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    {/* Glowing background effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/5 to-orange-300/10 blur-lg -z-10 rounded-xl opacity-75"></div>
                    
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mb-6 shadow-lg border border-orange-200/50 animate-glow">
                      <div className="text-orange-500 w-8 h-8">
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="font-poppins font-semibold text-xl mb-3 text-gray-800">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                className="bg-gradient-to-br from-white to-orange-50/50 rounded-xl p-8 shadow-xl border border-orange-100/50 relative overflow-hidden hover-lift"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                {/* Decorative elements */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-orange-300/20 to-orange-200/10 rounded-full blur-xl animate-pulse-subtle"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-tr from-orange-300/20 to-orange-200/10 rounded-full blur-xl animate-pulse-subtle"></div>
                
                <motion.div
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative"
                >
                  <h3 className="font-poppins font-bold text-2xl mb-4 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent animate-pulse-subtle">10,000+ Leads Generated</h3>
                  
                  <ul className="space-y-4 mb-6">
                    <li className="flex items-start">
                      <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-full p-1.5 mr-3 mt-0.5 flex-shrink-0 shadow-lg animate-pulse-subtle">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">24/7 Lead Gen</span>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-full p-1.5 mr-3 mt-0.5 flex-shrink-0 shadow-lg animate-pulse-subtle">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">Modern Website</span>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-full p-1.5 mr-3 mt-0.5 flex-shrink-0 shadow-lg animate-pulse-subtle">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">Traffic Control</span>
                    </li>
                  </ul>
                  
                  <div className="p-4 bg-white rounded-lg border border-orange-100 shadow-sm">
                    <p className="text-gray-700">Backed by results, not geography. We've helped brands grow in the UK and globally.</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* No More Leads Left on the Table */}
        <section id="audit-form" className="py-24 relative overflow-hidden bg-white">
          {/* Abstract background elements */}
          <div className="absolute inset-0 opacity-5" style={{ 
            backgroundImage: `url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")`,
          }}></div>
          <div className="absolute -top-40 right-0 w-96 h-96 bg-orange-300 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/40 to-transparent"></div>
          <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-orange-300/30 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-200 rounded-full opacity-20 blur-2xl"></div>
          <div className="w-full px-0 relative">
            <motion.div 
              className="text-center mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block uppercase text-xs font-semibold tracking-wider text-orange-600 mb-2 px-3 py-1 bg-orange-50 rounded-full shadow-sm">TAKE ACTION NOW</span>
            </motion.div>
            
            <motion.div 
              className="w-full mb-16 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="font-poppins font-bold text-3xl md:text-[42px] mb-4 leading-tight tracking-tight text-gray-900">No More Leads Left on the <span className="relative inline-block">
                <span className="absolute inset-x-0 bottom-2 h-3 bg-orange-200/50 -z-10 rounded"></span>
                Table
              </span></h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                You don't need to learn funnels or hire a team. Just let us show you what's broken.
              </p>
            </motion.div>
            
            <div className="flex justify-center">
              <AuditForm />
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <Footer />
      </main>
    </motion.div>
  );
}