import { motion } from 'framer-motion'
import { DollarSign, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function BuyingSelling() {
  return (
    <section id="buying" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            id="selling"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-brand-50 p-8 rounded-lg"
          >
            <div className="flex items-center mb-6">
              <div className="bg-brand-600 p-3 rounded-lg mr-4">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Selling a Property?
              </h2>
            </div>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Give us a call or drop into our office. Our experienced sales agents will be 
              pleased to provide honest non-exaggerated advice to help you choose the best 
              sales option for maximum results.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-brand-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Market Analysis</h4>
                  <p className="text-gray-600 text-sm">Comprehensive local market evaluation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-brand-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Professional Marketing</h4>
                  <p className="text-gray-600 text-sm">Maximum exposure for your property</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-brand-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Expert Negotiation</h4>
                  <p className="text-gray-600 text-sm">Get the best price for your property</p>
                </div>
              </div>
            </div>

            <a 
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-block bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
            >
              Get Selling Advice
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-secondary-50 p-8 rounded-lg"
          >
            <div className="flex items-center mb-6">
              <div className="bg-secondary-600 p-3 rounded-lg mr-4">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Buying a Property?
              </h2>
            </div>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Our sales agents have lived in the area for many years and you can count on 
              them to answer your questions with a great deal of knowledge and help find 
              the right property for you.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Local Expertise</h4>
                  <p className="text-gray-600 text-sm">Deep knowledge of the Rideau region</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Property Search</h4>
                  <p className="text-gray-600 text-sm">Find properties that match your needs</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Buying Support</h4>
                  <p className="text-gray-600 text-sm">Guidance through the entire process</p>
                </div>
              </div>
            </div>

            <Link 
              to="/listings"
              className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
            >
              Start Property Search
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Serving the Rideau Region
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The Rideau Lakes are located in Eastern Ontario, approximately 1 hour from Ottawa, 
              45 minutes from Kingston, 30 minutes from the Thousand Islands Bridge to the U.S.A. 
              and 3½ hours from Toronto.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
            {['Portland', 'Westport', 'Elgin', 'Delta', 'Seeley\'s Bay', 'Lombardy', 'Rideau Ferry'].map((location) => (
              <div key={location} className="bg-gray-50 hover:bg-primary-50 p-4 rounded-lg transition-colors duration-200">
                <p className="font-semibold text-gray-900">{location}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
