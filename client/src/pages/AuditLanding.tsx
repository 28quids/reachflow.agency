import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import ExitIntentPopup from "@/components/home/ExitIntentPopup";

// AuditForm Schema
const auditFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  website: z.string().url({ message: "Please enter a valid URL" }),
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
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
  {
    id: 2,
    title: "We Analyze",
    description: "Our experts review your funnel, website, and competitors to find opportunities and gaps.",
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Get Results",
    description: "We deliver actionable insights and a strategy you can implement right away.",
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

// No more leads left on the table steps
const noMoreLeadsSteps = [
  {
    number: "01",
    title: "We review your site & funnel",
    caption: "Our team analyzes everything from your messaging to your user flow."
  },
  {
    number: "02",
    title: "We identify the gaps & leaks",
    caption: "We show you exactly where you're losing leads and how to fix it."
  },
  {
    number: "03",
    title: "Implement & start converting",
    caption: "Take our recommendations and watch your conversions climb."
  }
];

export default function AuditLanding() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
  });

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
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-green-200/50">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-poppins font-bold text-2xl mb-3 text-gray-800">Thank You!</h3>
          <p className="text-gray-600 text-lg mb-8">Your audit request has been received. Our team will analyze your marketing and get back to you within 48 hours.</p>
          
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-500 opacity-30 blur-lg -z-10 rounded-lg"></div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-gradient-to-r from-green-400 to-green-500 text-white font-medium px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative mb-8">
            {variant === "footer" && (
              <div className="absolute -top-4 -right-4 hidden md:block z-10">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-lg">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            )}
            
            <h3 className={`font-bold text-2xl ${variant === "hero" ? "" : "text-center"} text-gray-800`}>
              Request Your <span className="text-gradient">Free Audit</span>
            </h3>
            
            {variant === "hero" && (
              <p className="text-gray-600 mt-2">Complete the form below and we'll analyze your current marketing.</p>
            )}
          </div>
          
          <div className="space-y-5">
            <div>
              <label htmlFor={`name-${variant}`} className="block text-gray-700 font-medium mb-1.5 text-sm">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  id={`name-${variant}`}
                  {...form.register("name")} 
                  className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" 
                  placeholder="John Smith" 
                />
              </div>
              {form.formState.errors.name && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor={`email-${variant}`} className="block text-gray-700 font-medium mb-1.5 text-sm">Business Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  id={`email-${variant}`}
                  {...form.register("email")} 
                  className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" 
                  placeholder="john@yourcompany.com" 
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor={`website-${variant}`} className="block text-gray-700 font-medium mb-1.5 text-sm">Website URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <input 
                  type="url" 
                  id={`website-${variant}`}
                  {...form.register("website")} 
                  className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" 
                  placeholder="https://yourcompany.com" 
                />
              </div>
              {form.formState.errors.website && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.website.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor={`business-${variant}`} className="block text-gray-700 font-medium mb-1.5 text-sm">Tell us about your goals</label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <textarea 
                  id={`business-${variant}`}
                  {...form.register("business")} 
                  rows={3} 
                  className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" 
                  placeholder="What are you looking to achieve? What are your current challenges?" 
                />
              </div>
            </div>
          </div>
          
          <div className="relative mt-8">
            {/* Button glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-500 opacity-40 blur-lg -z-10 rounded-lg"></div>
            
            <button 
              type="submit" 
              className="w-full gradient-bg text-white font-semibold py-4 rounded-lg shadow-xl hover:shadow-2xl hover:brightness-110 transition-all text-center text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                <>
                  <span>Request My Free Audit</span>
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </>
              )}
            </button>
          </div>
          
          {variant === "footer" && (
            <div className="mt-4 bg-orange-50/50 rounded-lg p-3 border border-orange-100/50">
              <p className="text-gray-600 text-xs text-center">
                No obligation. You can use our recommendations with any marketing provider.
              </p>
            </div>
          )}
        </form>
      )}
    </div>
  );

  return (
    <div className="grid-pattern-bg relative">
      <Navbar />
      <ExitIntentPopup />
      
      {/* Floating UI elements - site-wide */}
      <div className="fixed top-1/3 left-[5%] w-8 h-8 opacity-20 hidden lg:block z-0">
        <div className="w-full h-full rounded-full bg-orange-100 animate-float"></div>
      </div>
      <div className="fixed bottom-1/4 right-[8%] w-12 h-12 opacity-20 hidden lg:block z-0">
        <div className="w-full h-full blob-effect bg-orange-100 animate-float-delayed"></div>
      </div>
      <div className="fixed top-2/3 right-[15%] w-6 h-6 opacity-15 hidden lg:block z-0">
        <div className="w-full h-full rounded-full bg-orange-200 animate-pulse-subtle"></div>
      </div>
      
      {/* Hero Section */}
      <section className="pt-28 pb-24 md:pt-36 md:pb-32 relative overflow-hidden layer-depth">
        {/* Background elements - reduced opacity and blur for better contrast */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full opacity-10 blur-2xl -z-10 transform translate-x-1/4"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-orange-300 rounded-full opacity-10 blur-2xl -z-10 transform -translate-x-1/4"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-orange-300/10 to-orange-400/5 rounded-full opacity-20 blur-xl -z-10"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gradient-to-tl from-orange-400/5 to-orange-300/10 rounded-full opacity-20 blur-xl -z-10"></div>
        
        {/* Grid pattern for better visual structure - made more prominent */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="h-full w-full" style={{ 
            backgroundImage: 
              `linear-gradient(rgba(255, 107, 44, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 107, 44, 0.2) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            backgroundPosition: 'center center',
          }}></div>
        </div>
        
        {/* Floating UI Elements */}
        <motion.div 
          className="absolute top-32 right-[10%] hidden lg:block"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          <div className="bg-white p-3 rounded-lg shadow-xl">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <div className="text-xs font-medium">New lead captured</div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-32 left-[10%] hidden lg:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
        >
          <div className="bg-white p-3 rounded-lg shadow-xl w-32">
            <div className="h-3 w-full bg-gray-100 rounded-full mb-1">
              <div className="h-full w-3/4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"></div>
            </div>
            <div className="text-xs font-medium text-gray-600">Leads +75%</div>
          </div>
        </motion.div>
        
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
        {/* Background patterns - made more prominent */}
        <div className="absolute inset-0 opacity-15" style={{ 
          backgroundImage: `linear-gradient(45deg, rgba(251, 146, 60, 0.15) 25%, transparent 25%, transparent 50%, 
                          rgba(251, 146, 60, 0.15) 50%, rgba(251, 146, 60, 0.15) 75%, transparent 75%, transparent)`,
          backgroundSize: '64px 64px',
          backgroundPosition: 'center center'
        }}></div>
        
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
        {/* Grid background overlay - more prominent */}
        <div className="absolute inset-0 opacity-15 z-0">
          <div className="h-full w-full" style={{ 
            backgroundImage: 
              `linear-gradient(rgba(255, 107, 44, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 107, 44, 0.2) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            backgroundPosition: 'center center',
          }}></div>
        </div>
        
        {/* Background decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden -z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-64 text-gray-50" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,202.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Radial gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/5 to-orange-300/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-tr from-orange-300/10 to-orange-400/5 rounded-full blur-3xl -z-10"></div>
        
        {/* Floating elements */}
        <motion.div 
          className="absolute top-1/4 right-[10%] hidden lg:block z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          <div className="bg-white p-3 rounded-full shadow-xl animate-float">
            <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-1/4 left-[8%] hidden lg:block z-10"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 1.3 }}
        >
          <div className="w-16 h-16 blob-effect bg-gradient-to-br from-orange-400/20 to-orange-300/10 backdrop-blur-sm border border-orange-200/30 animate-float-delayed"></div>
        </motion.div>
        
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
                    <div className="text-orange-500 w-10 h-10">
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
          
          {/* Process connector (desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-[33%] right-[33%] h-0.5 bg-gradient-to-r from-orange-300 to-orange-400 -translate-y-28 z-0">
            <div className="absolute -left-1 -top-1.5 w-4 h-4 bg-orange-400 rounded-full"></div>
            <div className="absolute -right-1 -top-1.5 w-4 h-4 bg-orange-400 rounded-full"></div>
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
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white -mt-12">
        {/* Background pattern - subtle dot pattern */}
        <div className="absolute inset-0 dot-pattern-bg opacity-80"></div>
        
        {/* Background grid overlay - more visible */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="h-full w-full" style={{ 
            backgroundImage: 
              `radial-gradient(circle, rgba(255, 107, 44, 0.15) 1px, transparent 1px)`,
            backgroundSize: '25px 25px',
            backgroundPosition: 'center center',
          }}></div>
        </div>
        
        {/* Background gradient */}
        <div className="absolute top-0 left-1/4 w-96 h-96 radial-blur-orange blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 radial-blur-peach blur-3xl -z-10"></div>
        
        {/* Floating trust badge */}
        <motion.div 
          className="absolute top-1/3 right-[15%] hidden lg:block z-10"
          initial={{ opacity: 0, rotate: -10, scale: 0.7 }}
          whileInView={{ opacity: 0.9, rotate: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="bg-white rounded-xl p-4 shadow-xl border border-orange-100 rotate-6 animate-float-delayed">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <p className="text-gray-700 text-xs font-medium mt-1">UK's Leading</p>
          </div>
        </motion.div>

        <motion.div 
          className="absolute bottom-1/3 left-[8%] hidden lg:block z-10"
          initial={{ opacity: 0, rotate: 10, scale: 0.7 }}
          whileInView={{ opacity: 0.9, rotate: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="bg-white rounded-xl p-3 shadow-xl border border-orange-100 -rotate-6 animate-float">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-700 text-xs font-medium">Verified Results</p>
            </div>
          </div>
        </motion.div>

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
      <section id="audit-form" className="py-24 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white -mt-10">
        {/* Grid background overlay */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="h-full w-full" style={{ 
            backgroundImage: 
              `linear-gradient(rgba(255, 107, 44, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 107, 44, 0.05) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            backgroundPosition: 'center center',
          }}></div>
        </div>
        
        {/* Background elements */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-orange-300/10 to-orange-200/5 rounded-full opacity-80 blur-3xl -z-10"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-orange-200/10 to-orange-300/5 rounded-full opacity-80 blur-3xl -z-10"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-orange-300/10 to-orange-400/5 rounded-full opacity-60 blur-2xl -z-10"></div>
        
        {/* Floating UI elements */}
        <motion.div 
          className="absolute top-1/4 left-[8%] hidden lg:block z-10"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          <div className="bg-white p-2 rounded-full shadow-xl animate-float">
            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-1/4 right-[20%] hidden lg:block z-10"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 1.3 }}
        >
          <div className="bg-white px-4 py-2 rounded-lg shadow-xl border border-gray-100 animate-float-delayed">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-gray-600 text-xs font-medium">28 online</p>
            </div>
          </div>
        </motion.div>
        
        <div className="container max-w-6xl mx-auto px-4 relative">
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
            className="max-w-4xl mx-auto mb-16 text-center"
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
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-12">
              {noMoreLeadsSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  className="flex group hover-lift"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="relative flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-5 shadow-xl group-hover:shadow-orange-200/50">
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-orange-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700"></div>
                    <span className="relative z-10">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-xl md:text-2xl mb-2 text-gray-800">{step.title}</h3>
                    <p className="text-gray-600 text-lg">{step.caption}</p>
                  </div>
                </motion.div>
              ))}
              
              {/* Floating arrows connecting steps */}
              <div className="absolute left-8 top-[30%] h-[40%] w-0.5 bg-gradient-to-b from-orange-300 to-orange-400 hidden lg:block opacity-30"></div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              {/* Form glow */}
              <div className="absolute -inset-8 radial-blur-orange opacity-20 blur-3xl -z-10 rounded-xl"></div>
              
              {renderAuditForm("footer")}
              
              {/* Trust badges */}
              <motion.div 
                className="flex justify-center items-center space-x-6 mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -3, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg border border-orange-200/50 animate-glow">
                    <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-sm font-medium">10K+ Leads Generated</p>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -3, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg border border-orange-200/50 animate-glow">
                    <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-sm font-medium">Trusted by Brands</p>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  whileHover={{ y: -3, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg border border-orange-200/50 animate-glow">
                    <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-sm font-medium">5-Star Rated Agency</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
        {/* Grid background overlay - subtle dark grid */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="h-full w-full" style={{ 
            backgroundImage: 
              `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            backgroundPosition: 'center center',
          }}></div>
        </div>
        
        {/* Dot pattern background */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: 
              `radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}></div>
        </div>
        
        {/* Top wave divider */}
        <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
          <svg className="absolute bottom-0 w-full h-16 text-white transform translate-y-1/2" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
        
        {/* Orange gradient glows */}
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500 opacity-10 blur-[100px] rounded-full"></div>
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-orange-600 opacity-5 blur-[100px] rounded-full"></div>
        
        {/* Floating UI elements */}
        <motion.div 
          className="absolute bottom-1/3 right-[10%] hidden lg:block"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.7, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-float"></div>
        </motion.div>
        
        <motion.div 
          className="absolute top-1/3 left-[15%] hidden lg:block"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.4, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <div className="w-6 h-6 blob-effect bg-orange-400 animate-float-delayed"></div>
        </motion.div>
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <Link href="/" className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center animate-pulse-subtle">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 10C3 9.05719 3 8.58579 3.29289 8.29289C3.58579 8 4.05719 8 5 8H19C19.9428 8 20.4142 8 20.7071 8.29289C21 8.58579 21 9.05719 21 10V16C21 16.9428 21 17.4142 20.7071 17.7071C20.4142 18 19.9428 18 19 18H5C4.05719 18 3.58579 18 3.29289 17.7071C3 17.4142 3 16.9428 3 16V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 14C6.6 14 8.4 17 12 17C15.6 17 17.4 14 21 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 11C6.6 11 8.4 8 12 8C15.6 8 17.4 11 21 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-poppins font-bold text-xl">Reach<span className="text-gradient">Flow</span></span>
            </Link>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="/#services" className="text-gray-400 hover:text-orange-400 transition-colors text-sm hover:-translate-y-0.5 hover:scale-105 duration-200">Services</a>
              <a href="/#audit" className="text-gray-400 hover:text-orange-400 transition-colors text-sm hover:-translate-y-0.5 hover:scale-105 duration-200">Free Audit</a>
              <a href="/#contact" className="text-gray-400 hover:text-orange-400 transition-colors text-sm hover:-translate-y-0.5 hover:scale-105 duration-200">Contact</a>
              <a href="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors text-sm hover:-translate-y-0.5 hover:scale-105 duration-200">Privacy</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center md:text-left">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-2">
                  Marketing systems for businesses who deliver real results.
                </p>
                <p className="text-gray-400 text-sm">
                  We help great work get seen and convert online.
                </p>
              </div>
              <div className="text-right">
                <a href="mailto:hello@reachflow.com" className="text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center gap-1 hover:gap-2 duration-200">
                  <span>hello@reachflow.com</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <p className="text-gray-500 text-sm mt-2">
                  &copy; {new Date().getFullYear()} ReachFlow. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}