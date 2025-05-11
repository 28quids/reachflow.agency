import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/utils";

export default function VisualProof() {
  return (
    <section className="py-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-orange-50/30 to-white"></div>
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[800px] h-[800px] bg-orange-200 rounded-full opacity-20 blur-[150px]"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="relative mx-auto max-w-6xl">
          
          {/* Phone floating at an angle */}
          <motion.div 
            className="relative mx-auto max-w-[320px] md:max-w-xs lg:max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="transform rotate-6 origin-bottom-right shadow-2xl rounded-[40px] hover:rotate-3 transition-transform duration-700">
              <div className="bg-[#1D1D1D] rounded-[40px] pt-1 pb-6 px-2 relative overflow-hidden border-4 border-gray-800">
                {/* Phone notch */}
                <div className="w-1/2 h-6 bg-black rounded-b-2xl absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                
                {/* Full Screen */}
                <div className="rounded-[32px] overflow-hidden h-[500px] bg-orange-600">
                  <div className="px-4 pt-12 pb-4 h-full flex flex-col">
                    {/* Screen Content */}
                    <div className="text-center mb-auto mt-6">
                      <div className="text-[72px] font-extralight text-white tracking-tighter leading-tight">11:56</div>
                      <div className="text-white/80 mt-1 font-light tracking-wider">Dec 11, Monday</div>
                    </div>
                    
                    {/* Notifications */}
                    <div className="space-y-3 mb-6">
                      {/* Notification 1 */}
                      <div className="bg-orange-200/90 backdrop-blur-sm rounded-xl p-3 flex items-start animate-pulse-subtle">
                        <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-orange-800" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L1 21h22L12 2z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div className="font-semibold text-sm text-orange-900">REACHFLOW</div>
                            <div className="text-xs text-orange-800/70">1m ago</div>
                          </div>
                          <div className="text-sm text-orange-800 font-medium">You've booked a new qualified meeting!</div>
                        </div>
                      </div>
                      
                      {/* Notification 2 */}
                      <div className="bg-orange-200/90 backdrop-blur-sm rounded-xl p-3 flex items-start">
                        <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-orange-800" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L1 21h22L12 2z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div className="font-semibold text-sm text-orange-900">REACHFLOW</div>
                            <div className="text-xs text-orange-800/70">5m ago</div>
                          </div>
                          <div className="text-sm text-orange-800 font-medium">Meeting confirmed with Sarah for 2pm</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom pill */}
              <div className="w-1/3 h-1 bg-white/80 absolute bottom-2 left-1/2 transform -translate-x-1/2 rounded-full mx-auto"></div>
            </div>
            
            {/* Floating Calendar Card - Top left */}
            <motion.div 
              className="absolute -top-10 -left-16 md:-left-20 md:-top-8 lg:-left-32 bg-white py-3 px-3 rounded-xl shadow-lg w-[140px] lg:w-[160px] z-10 shadow-orange-100/50"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="grid grid-cols-5 gap-1">
                {/* Calendar mini grid */}
                {[...Array(15)].map((_, i) => {
                  const hasCheckmark = [2, 7, 10].includes(i);
                  
                  return (
                    <div 
                      key={i} 
                      className={`flex items-center justify-center rounded-md h-5 w-5 ${
                        hasCheckmark 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-200'
                      }`}
                    >
                      {hasCheckmark && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
            
            {/* Floating Contact Card - Bottom right */}
            <motion.div 
              className="absolute bottom-10 -right-16 md:-right-24 lg:-right-32 bg-white py-3 px-3 rounded-xl shadow-lg w-[150px] lg:w-[180px] z-10 shadow-orange-100/50"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="space-y-3">
                {/* Mini contact row */}
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                    <img 
                      src="https://randomuser.me/api/portraits/women/44.jpg" 
                      alt="Contact" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="w-12 h-2 bg-gray-300 rounded-full mb-1"></div>
                    <div className="w-20 h-1.5 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="ml-1 bg-orange-500 w-5 h-5 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                
                {/* Mini contact row */}
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="Contact" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="w-14 h-2 bg-gray-300 rounded-full mb-1"></div>
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="ml-1 bg-orange-500 w-5 h-5 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Small calendar badge floating to bottom left */}
            <motion.div 
              className="absolute top-1/3 -left-12 md:-left-16 bg-white p-2 rounded-lg shadow-lg shadow-orange-100/50 rotate-[-8deg]"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="w-10 h-10 bg-orange-100 rounded-md flex items-center justify-center text-orange-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </motion.div>
            
            {/* Check icon floating to right */}
            <motion.div 
              className="absolute bottom-1/3 -right-8 md:-right-10 bg-green-500 p-2 rounded-full shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}