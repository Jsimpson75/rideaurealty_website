import { motion } from 'framer-motion'
import { ExternalLink, Home, Calculator, FileText, Shield, Building, Map } from 'lucide-react'

const linkCategories = [
  {
    title: "Real Estate Resources",
    icon: Home,
    links: [
      { name: "MLS.ca", url: "https://www.mls.ca", description: "Search MLS listings across Canada" },
      { name: "CREA - Canadian Real Estate Association", url: "https://www.crea.ca", description: "National real estate association" },
      { name: "OREA - Ontario Real Estate Association", url: "https://www.orea.com", description: "Provincial real estate association" },
      { name: "KAREA - Kingston Area Real Estate", url: "https://www.karea.ca", description: "Local real estate board" },
    ]
  },
  {
    title: "Financial & Mortgage",
    icon: Calculator,
    links: [
      { name: "CMHC - Canada Mortgage and Housing Corporation", url: "https://www.cmhc-schl.gc.ca", description: "Government housing agency" },
      { name: "Mortgage Calculator", url: "https://www.cmhc-schl.gc.ca/en/consumers/home-buying/calculators/mortgage-calculator", description: "Calculate mortgage payments" },
      { name: "Bank of Canada", url: "https://www.bankofcanada.ca", description: "Current interest rates" },
      { name: "First-Time Home Buyer Incentive", url: "https://www.placetocallhome.ca", description: "Government assistance programs" },
    ]
  },
  {
    title: "Legal & Government",
    icon: FileText,
    links: [
      { name: "Law Society of Ontario", url: "https://lso.ca", description: "Find qualified real estate lawyers" },
      { name: "ServiceOntario", url: "https://www.ontario.ca/page/serviceontario", description: "Government services" },
      { name: "Land Registry Office", url: "https://www.ontario.ca/page/land-registration", description: "Property records and titles" },
      { name: "Ontario Building Code", url: "https://www.ontario.ca/page/building-code", description: "Building regulations and permits" },
    ]
  },
  {
    title: "Home Inspection & Protection",
    icon: Shield,
    links: [
      { name: "Ontario Association of Home Inspectors", url: "https://www.oahi.com", description: "Find certified home inspectors" },
      { name: "Tarion Warranty Corporation", url: "https://www.tarion.com", description: "New home warranty protection" },
      { name: "Technical Standards & Safety Authority", url: "https://www.tssa.org", description: "Safety inspections and regulations" },
      { name: "Electrical Safety Authority", url: "https://www.esasafe.com", description: "Electrical safety information" },
    ]
  },
  {
    title: "Local Government & Services",
    icon: Building,
    links: [
      { name: "City of Ottawa", url: "https://ottawa.ca", description: "Municipal services and information" },
      { name: "City of Kingston", url: "https://www.cityofkingston.ca", description: "Municipal services and information" },
      { name: "Leeds and Grenville County", url: "https://www.leedsgrenville.com", description: "County services and information" },
      { name: "Rideau Valley Conservation Authority", url: "https://www.rvca.ca", description: "Environmental protection and conservation" },
    ]
  },
  {
    title: "Utilities & Services",
    icon: Map,
    links: [
      { name: "Hydro One", url: "https://www.hydroone.com", description: "Electricity services" },
      { name: "Enbridge Gas", url: "https://www.enbridgegas.com", description: "Natural gas services" },
      { name: "Bell Canada", url: "https://www.bell.ca", description: "Telecommunications services" },
      { name: "Canada Post", url: "https://www.canadapost.ca", description: "Postal services and address lookup" },
    ]
  }
]

export default function Links() {
  return (
    <section id="links" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Useful Links & Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The internet is a valuable resource in the home buying or selling process. 
            Here are some helpful links and resources to assist you on your real estate journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {linkCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="bg-brand-600 p-3 rounded-lg">
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">
                  {category.title}
                </h3>
              </div>
              
              <div className="space-y-4">
                {category.links.map((link) => (
                  <div key={link.name} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-brand-600 group-hover:text-brand-700 transition-colors duration-200 flex items-center">
                            {link.name}
                            <ExternalLink className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {link.description}
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-brand-50 rounded-lg p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need More Information?
          </h3>
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
            If you have questions about any of these resources or need help navigating 
            the real estate process, don't hesitate to contact us. We're here to help 
            make your real estate experience as smooth as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Contact Us Today
            </a>
            <a
              href="tel:613-272-5000"
              className="border border-brand-600 text-brand-600 hover:bg-brand-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Call (613) 272-5000
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}