import { motion } from 'framer-motion'
import { Home, Users, FileText, Calculator, Camera, Award } from 'lucide-react'

const services = [
  {
    icon: Home,
    title: "Property Sales",
    description: "Comprehensive real estate sales services with market analysis, pricing strategies, and negotiation support.",
    features: ["Market Analysis", "Pricing Strategy", "Negotiation Support", "Closing Assistance"]
  },
  {
    icon: Users,
    title: "Property Management",
    description: "Professional property management services for landlords and investors in the Rideau region.",
    features: ["Tenant Screening", "Rent Collection", "Maintenance Coordination", "Financial Reporting"]
  },
  {
    icon: FileText,
    title: "Legal Support",
    description: "Expert legal guidance throughout the real estate transaction process with trusted partners.",
    features: ["Contract Review", "Legal Compliance", "Title Search", "Closing Support"]
  },
  {
    icon: Calculator,
    title: "Investment Consulting",
    description: "Strategic investment advice for real estate investors looking to build their portfolio.",
    features: ["Market Research", "ROI Analysis", "Investment Strategy", "Portfolio Planning"]
  },
  {
    icon: Camera,
    title: "Professional Photography",
    description: "High-quality photography and virtual tours to showcase your property in the best light.",
    features: ["Professional Photos", "Virtual Tours", "Drone Photography", "Marketing Materials"]
  },
  {
    icon: Award,
    title: "Award-Winning Service",
    description: "Recognized excellence in real estate services with proven track record of client satisfaction.",
    features: ["Client Satisfaction", "Industry Recognition", "Quality Assurance", "Ongoing Support"]
  }
]

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive real estate services tailored to your needs. From buying and selling 
            to property management and investment consulting, we're here to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-lg p-8 hover:bg-gray-100 transition-colors duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="bg-primary-600 p-3 rounded-lg">
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">
                  {service.title}
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-primary-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Rideau Reality?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">15+</div>
                <div className="text-gray-600">Years of Experience</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">$50M+</div>
                <div className="text-gray-600">Properties Sold</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 