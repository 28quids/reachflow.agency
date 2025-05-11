import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/utils";

// Service card data with phone mockups
const services = [
  {
    id: 1,
    title: "Pages That Turn Clicks Into Clients",
    description: "We design high-converting landing pages and sales funnels that turn visitors into customers.",
    alignment: "left",
    phoneContent: (
      <div className="bg-gradient-to-b from-orange-500 to-rose-500 h-full rounded-lg p-3">
        <div className="flex justify-between mb-2">
          <div className="w-10 h-2 bg-white/20 rounded-full"></div>
          <div className="w-6 h-2 bg-white/20 rounded-full"></div>
        </div>
        <div className="w-full h-24 bg-white/10 rounded-lg mb-3"></div>
        <div className="space-y-1 mb-3">
          <div className="w-full h-2 bg-white/20 rounded-full"></div>
          <div className="w-5/6 h-2 bg-white/20 rounded-full"></div>
          <div className="w-4/6 h-2 bg-white/20 rounded-full"></div>
        </div>
        <div className="flex justify-center">
          <div className="w-1/3 h-6 bg-white/30 rounded-lg"></div>
        </div>
      </div>
    ),
    icon: (
      <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    features: [
      "Conversion-optimized design",
      "A/B testing for peak performance",
      "Mobile-friendly experiences"
    ]
  },
  {
    id: 2,
    title: "Traffic That Actually Converts",
    description: "We drive qualified leads to your business through strategic ad campaigns across multiple platforms.",
    alignment: "right",
    phoneContent: (
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 h-full rounded-lg p-3">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="w-full h-5 bg-white/20 rounded-md"></div>
          <div className="w-full h-5 bg-white/20 rounded-md"></div>
          <div className="w-full h-5 bg-white/20 rounded-md"></div>
          <div className="w-full h-5 bg-white/20 rounded-md"></div>
        </div>
        <div className="h-14 bg-white/10 rounded-lg flex items-center px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-white/20 mr-2"></div>
          <div className="flex-1">
            <div className="w-16 h-2 bg-white/30 rounded-full mb-1"></div>
            <div className="w-24 h-2 bg-white/20 rounded-full"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="w-full h-2 bg-orange-200/50 rounded-full"></div>
          <div className="w-2/3 h-2 bg-orange-200/30 rounded-full"></div>
        </div>
      </div>
    ),
    icon: (
      <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
    features: [
      "Precise audience targeting",
      "Cost-effective campaign management",
      "Continuous optimization"
    ]
  },
  {
    id: 3,
    title: "Turn Cold Leads Into Booked Calls",
    description: "We help you build relationships with prospects through personalized communication that guides them toward purchase.",
    alignment: "left",
    phoneContent: (
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 h-full rounded-lg p-3">
        <div className="mb-2 w-1/2 h-3 bg-white/20 rounded-full mx-auto"></div>
        <div className="space-y-3">
          <div className="w-full h-12 bg-white/10 rounded-lg px-2 py-2 flex">
            <div className="w-8 h-8 rounded-full bg-white/30 mr-2"></div>
            <div className="w-full">
              <div className="w-16 h-2 bg-white/30 rounded-full mb-1"></div>
              <div className="w-24 h-2 bg-white/20 rounded-full"></div>
            </div>
          </div>
          <div className="w-full h-12 bg-white/10 rounded-lg px-2 py-2 flex">
            <div className="w-8 h-8 rounded-full bg-white/30 mr-2"></div>
            <div className="w-full">
              <div className="w-16 h-2 bg-white/30 rounded-full mb-1"></div>
              <div className="w-24 h-2 bg-white/20 rounded-full"></div>
            </div>
          </div>
          <div className="w-full h-12 bg-white/10 rounded-lg px-2 py-2 flex">
            <div className="w-8 h-8 rounded-full bg-white/30 mr-2"></div>
            <div className="w-full">
              <div className="w-16 h-2 bg-white/30 rounded-full mb-1"></div>
              <div className="w-24 h-2 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    ),
    icon: (
      <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    features: [
      "Automated email sequences",
      "Personalized content strategies",
      "Lead scoring and segmentation"
    ]
  }
];

// Process path data - The ReachFlow Experience
const processSteps = [
  {
    id: 1,
    title: "Real-Time Slack Feedback",
    description: "Live updates. Fast turnarounds. Clear priorities.",
    icon: (
      <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    uiMockup: (
      <div className="w-full h-24 sm:h-32 bg-white rounded-lg p-3 relative overflow-hidden border border-gray-200 shadow-md shadow-orange-100/10">
        <div className="absolute left-0 top-0 h-full w-1 bg-green-500"></div>
        <div className="flex mb-2">
          <div className="w-6 h-6 rounded-md bg-[#611f69] mr-2 flex items-center justify-center text-white text-[10px] font-bold">S</div>
          <div className="w-32 h-3 bg-gray-300 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-gray-300 mr-2 mt-0.5"></div>
            <div>
              <div className="w-32 h-2 bg-gray-300 rounded-full mb-1"></div>
              <div className="w-48 h-2 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-gray-300 mr-2 mt-0.5"></div>
            <div>
              <div className="w-40 h-2 bg-gray-300 rounded-full mb-1"></div>
              <div className="w-56 h-2 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Loom Breakdowns",
    description: "We explain every decision in plain English — no mystery.",
    icon: (
      <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    uiMockup: (
      <div className="w-full h-24 sm:h-32 bg-white rounded-lg p-3 border border-gray-200 overflow-hidden relative shadow-md shadow-orange-100/10">
        <div className="absolute left-0 top-0 h-8 w-full bg-gradient-to-r from-gray-900 to-gray-800"></div>
        <div className="absolute left-1/2 top-4 -translate-x-1/2 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
        </div>
        <div className="h-full flex items-end pb-2">
          <div className="w-full flex items-center">
            <div className="w-12 h-3 bg-gray-300 rounded-full"></div>
            <div className="flex-1 h-1 bg-gray-200 mx-2 rounded-full relative">
              <div className="absolute left-1/3 top-0 h-1 w-8 bg-red-500 rounded-full"></div>
            </div>
            <div className="w-10 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Iteration-Driven Execution",
    description: "We launch, learn, and optimize — daily.",
    icon: (
      <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    uiMockup: (
      <div className="w-full h-24 sm:h-32 bg-white rounded-lg p-3 border border-gray-200 overflow-hidden shadow-md shadow-orange-100/10">
        <div className="flex items-center justify-between mb-2">
          <div className="w-20 h-3 bg-gray-300 rounded-full"></div>
          <div className="flex space-x-1">
            <div className="w-6 h-6 rounded-md bg-green-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <div className="w-6 h-6 rounded-md bg-red-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 h-12">
          <div className="w-1/4 bg-green-200 rounded-md h-full"></div>
          <div className="w-1/5 bg-green-300 rounded-md h-3/4 self-end"></div>
          <div className="w-1/6 bg-green-400 rounded-md h-1/2 self-end"></div>
          <div className="w-1/5 bg-red-300 rounded-md h-1/3 self-end"></div>
          <div className="w-1/4 bg-green-500 rounded-md h-full"></div>
        </div>
      </div>
    )
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/60 via-orange-50/30 to-white"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")"
      }}></div>
      
      {/* Decorative blurs */}
      <div className="absolute -bottom-40 left-0 w-96 h-96 bg-orange-200 rounded-full opacity-20 blur-[100px]"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-orange-200 rounded-full opacity-20 blur-[100px] translate-x-1/3"></div>
      
      {/* Orange wave */}
      <div className="absolute left-0 right-0 bottom-0 h-32 opacity-[0.03] overflow-hidden">
        <svg viewBox="0 0 1440 320" className="absolute w-full">
          <path fill="#f97316" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block uppercase text-xs font-semibold tracking-wider text-orange-600 mb-2 px-3 py-1 bg-orange-50 rounded-full">OUR SERVICES</span>
          <h2 className="font-poppins font-bold text-3xl md:text-[40px] leading-tight mb-6 tracking-tight">What We <span className="inline-block bg-orange-300/30 px-2 text-orange-600 rounded relative">Do</span></h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            We help businesses attract and convert high-quality leads through strategic digital marketing solutions.
          </p>
        </motion.div>
        
        {/* Services in Zig-Zag Layout */}
        <div className="space-y-32 mb-32">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className={`flex flex-col-reverse ${service.alignment === "right" ? "md:flex-row-reverse" : "md:flex-row"} gap-10 md:gap-16 items-center`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
              whileHover={{ y: -5 }}
            >
              {/* Content Side */}
              <div className="w-full md:w-1/2">
                <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <motion.div 
                    className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6 shadow-orange-100/50 shadow-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {service.icon}
                  </motion.div>
                  
                  <h3 className="font-poppins font-bold text-2xl md:text-3xl mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 text-lg">{service.description}</p>
                  
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <motion.li 
                        key={idx} 
                        className="flex items-start"
                        initial={{ opacity: 0, x: service.alignment === "right" ? 20 : -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 + (idx * 0.1) }}
                      >
                        <div className="bg-orange-100 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                          <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Image or Phone Mockup Side */}
              <div className="w-full md:w-1/2 flex items-center justify-center">
                {index === 0 ? (
                  // Landing Pages image for Landing Page & Funnel Design section
                  <motion.div 
                    className="max-w-[320px] w-full"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, type: "spring" }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="relative">
                      {/* Landing Pages Image */}
                      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(249,115,22,0.15)]">
                        <img
                          src="/assets/images/content/landing-pages.png"
                          className="w-full h-full object-cover rounded-lg"
                          alt="Landing Pages"
                        />
                      </div>
                      
                      {/* Floating elements */}
                      <motion.div 
                        className="absolute -right-8 -bottom-4 bg-white p-2 rounded-lg shadow-lg z-10 shadow-orange-100/30"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : index === 1 ? (
                  // Facebook Ads image for Targeted Paid Traffic section
                  <motion.div 
                    className="max-w-[320px] w-full"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, type: "spring" }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="relative">
                      {/* Facebook Ads Image */}
                      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(249,115,22,0.15)]">
                        <img
                          src="/assets/images/content/facebook-campaigns.png"
                          className="w-full h-full object-cover rounded-lg"
                          alt="Facebook Campaigns"
                        />
                      </div>
                      
                      {/* Floating elements */}
                      <motion.div 
                        className="absolute -right-8 -bottom-4 bg-white p-2 rounded-lg shadow-lg z-10 shadow-orange-100/30"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  // Lead Nurture image for Lead Nurturing section
                  <motion.div 
                    className="max-w-[320px] w-full"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, type: "spring" }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="relative">
                      {/* Lead Nurture Image */}
                      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(249,115,22,0.15)]">
                        <img
                          src="/assets/images/content/lead-nurture.png"
                          className="w-full h-full object-cover rounded-lg"
                          alt="Lead Nurture"
                        />
                      </div>
                      
                      {/* Floating elements */}
                      <motion.div 
                        className="absolute -right-8 -bottom-4 bg-white p-2 rounded-lg shadow-lg z-10 shadow-orange-100/30"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* The ReachFlow Experience - Process Path */}
        <motion.div 
          className="mt-24 md:mt-32 py-16 px-4 relative bg-gradient-to-b from-orange-50/70 to-transparent rounded-2xl overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Orange grid background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-15" style={{ 
              backgroundImage: `linear-gradient(to right, rgba(251, 146, 60, 0.1) 1px, transparent 1px), 
                              linear-gradient(to bottom, rgba(251, 146, 60, 0.1) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
              backgroundPosition: 'center center'
            }}></div>
            
            {/* Diagonal lines */}
            <div className="absolute inset-0 opacity-10" style={{ 
              backgroundImage: `linear-gradient(45deg, rgba(251, 146, 60, 0.1) 25%, transparent 25%, transparent 50%, 
                              rgba(251, 146, 60, 0.1) 50%, rgba(251, 146, 60, 0.1) 75%, transparent 75%, transparent)`,
              backgroundSize: '64px 64px',
              backgroundPosition: 'center center'
            }}></div>
            
            {/* Glowing circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-300/20 rounded-full blur-3xl"></div>
          </div>
          <span className="inline-block uppercase text-xs font-semibold tracking-wider text-orange-600 mb-2 px-3 py-1 bg-orange-50 rounded-full mx-auto text-center">OUR APPROACH</span>
          <h3 className="text-center font-poppins font-bold text-3xl md:text-[36px] leading-tight mb-4 tracking-tight">The ReachFlow <span className="inline-block bg-orange-300/30 px-2 text-orange-600 rounded relative">Experience</span></h3>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16 text-lg">
            When you work with us, you get a transparent, collaborative process that delivers results.
          </p>
          
          <div className="relative">
            {/* Process path connector */}
            <div className="hidden lg:block absolute top-1/2 transform -translate-y-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-100 via-orange-200 to-orange-100 rounded-full"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="bg-white rounded-xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl group border border-gray-100 hover:border-orange-200 shadow-orange-100/5 hover:shadow-orange-100/20 hover:translate-y-[-5px]">
                    {/* Removed step counter from mobile view to improve mobile appearance */}
                    <div className="flex lg:hidden items-center mb-3">
                      <h4 className="font-poppins font-semibold text-xl">{step.title}</h4>
                    </div>
                    
                    <div className="hidden lg:flex w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex-shrink-0 items-center justify-center mb-6 mx-auto group-hover:from-orange-200 group-hover:to-orange-100 transition-colors shadow-lg shadow-orange-100/30">
                      {step.icon}
                    </div>
                    
                    <h4 className="hidden lg:block font-poppins font-semibold text-xl text-center mb-4">{step.title}</h4>
                    <p className="text-gray-600 mb-6 lg:text-center">{step.description}</p>
                    
                    {/* UI mockup visual for each experience step */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                      className="hover:shadow-lg transition-all duration-300"
                    >
                      {step.uiMockup}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-600 italic max-w-2xl mx-auto text-lg">
              We bring together marketing expertise and a results-focused approach to deliver qualified leads that grow your business.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
