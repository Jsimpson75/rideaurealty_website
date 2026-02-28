import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Property Buyer",
    content: "Rideau Realty made our home buying experience seamless. Their attention to detail and market knowledge is unmatched.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Property Seller",
    content: "They sold our property above asking price in just 2 weeks! Professional service from start to finish.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Investor",
    content: "Their investment consulting helped me build a profitable real estate portfolio. Highly recommended!",
    rating: 5
  }
]

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              About Rideau Realty
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              <strong>SERVING THE REGION FOR OVER 50 YEARS……WE ARE YOUR "LOCAL" REALTOR!</strong>
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Rideau Realty Limited offers real estate listings in the Rideau region of Eastern Ontario, 
              including waterfront homes and cottages on Big Rideau Lake and the surrounding Rideau Lakes area, 
              together with homes, farms, land and businesses in the charming rural communities including; 
              Portland, Westport, Elgin, Delta, Seeley's Bay, Lombardy and Rideau Ferry.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              We are only 20 minutes away from Perth and Smith Falls. Don't hesitate to contact one of 
              our full time, experienced, knowledgeable and professional Real Estate Agents for all your 
              Rideau area real estate needs.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">Local</div>
                <div className="text-gray-600">Expertise</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">Full-Time</div>
                <div className="text-gray-600">Agents</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">Professional</div>
                <div className="text-gray-600">Service</div>
              </div>
            </div>
          </motion.div>

          {/* About Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Rideau Realty Office - Portland-on-the-Rideau"
              className="rounded-lg shadow-lg"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">Trusted Since 1974</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Our Clients Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-primary-600 mr-3" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Google Reviews Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div 
            data-key="Inline Google Reviews" 
            className="ft" 
            id="ftoz0oxc"
          />
          
          <script 
            src="https://wdg.fouita.com/widgets/0x2b75d3.js"
            async
          />
        </motion.div>
      </div>
    </section>
  )
} 