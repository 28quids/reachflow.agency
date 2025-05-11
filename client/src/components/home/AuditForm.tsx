import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const auditFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL" }),
  business: z.string().optional(),
  goals: z.array(z.string()).optional(),
});

type AuditFormValues = z.infer<typeof auditFormSchema>;

export default function AuditForm() {
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

  // Render the audit form using the AuditLanding page style
  const renderAuditForm = () => (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 md:p-6">
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
            <h3 className="font-bold text-xl text-gray-800">
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
              <label htmlFor="name-home" className="block text-gray-700 font-medium mb-1 text-sm">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  id="name-home"
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
              <label htmlFor="email-home" className="block text-gray-700 font-medium mb-1 text-sm">Business Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  id="email-home"
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
              <label htmlFor="website-home" className="block text-gray-700 font-medium mb-1 text-sm">Website URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <input 
                  type="url" 
                  id="website-home"
                  {...form.register("website")} 
                  className={`w-full pl-8 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                    form.formState.errors.website ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="https://yourcompany.com" 
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
              <label htmlFor="business-home" className="block text-gray-700 font-medium mb-1 text-sm">Tell us about your goals</label>
              <div className="relative">
                <div className="absolute top-2 left-3 flex items-start pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <textarea 
                  id="business-home"
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
    <section id="audit" className="py-24 relative overflow-hidden bg-gradient-to-b from-orange-50/60 via-white to-gray-50">
      {/* Abstract background elements */}
      <div className="absolute inset-0 opacity-5" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      <div className="absolute -top-40 right-0 w-96 h-96 bg-orange-300 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/40 to-transparent"></div>
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-orange-300/30 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-200 rounded-full opacity-20 blur-2xl"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div 
          className="text-center mb-14 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block uppercase text-xs font-semibold tracking-wider text-orange-600 mb-2 px-3 py-1 bg-orange-50 rounded-full">FREE ANALYSIS</span>
          <h2 className="font-poppins font-bold text-3xl md:text-[40px] leading-tight mb-5 tracking-tight">
            Get Your <span className="inline-block bg-orange-300/30 px-2 text-orange-600 rounded relative">Free</span> Marketing Audit
          </h2>
          <p className="text-gray-600 text-lg">
            Discover untapped opportunities to grow your business in less than 48 hours.
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-6xl mx-auto relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Left side - What to expect cards */}
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-gray-800 mb-4">What to Expect</h3>
            <motion.div 
              className="bg-white rounded-xl shadow-xl border border-gray-200 p-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">30-minute Discovery Call</h4>
                  <p className="text-gray-600 text-sm">A no-obligation conversation to understand your business needs</p>
                </div>
              </div>
            </motion.div>

            {/* Arrow 1 */}
            <motion.div 
              className="flex justify-center -my-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-xl border border-gray-200 p-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Quick Assessment</h4>
                  <p className="text-gray-600 text-sm">Thorough evaluation of your current marketing strategy</p>
                </div>
              </div>
            </motion.div>

            {/* Arrow 2 */}
            <motion.div 
              className="flex justify-center -my-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-xl border border-gray-200 p-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Initial Recommendations</h4>
                  <p className="text-gray-600 text-sm">Actionable insights based on your specific goals</p>
                </div>
              </div>
            </motion.div>

            {/* Arrow 3 */}
            <motion.div 
              className="flex justify-center -my-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-xl border border-gray-200 p-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Clear Next Steps</h4>
                  <p className="text-gray-600 text-sm">Defined action plan if we're a mutual fit</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right side - Form */}
          <div>
            {/* Form glow effect */}
            <div className="absolute -inset-4 bg-orange-300/10 blur-2xl rounded-xl -z-10"></div>
            
            {renderAuditForm()}
            
            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>By submitting this form, you agree to our <a href="#" className="text-orange-600 hover:text-orange-700 transition-colors">Privacy Policy</a> and <a href="#" className="text-orange-600 hover:text-orange-700 transition-colors">Terms of Service</a>.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}