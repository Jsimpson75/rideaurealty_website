import { motion } from 'framer-motion'
import { Bed, Bath, Square, MapPin, Heart } from 'lucide-react'

const properties = [
  {
    id: 1,
    title: "Luxury Waterfront Estate",
    location: "Ottawa, ON",
    price: "$1,250,000",
    beds: 4,
    baths: 3,
    sqft: 3200,
    image: "http://rideaurealty.ca/wp-content/uploads/2025/08/1-640x427.jpg",
    featured: true
  },
  {
    id: 2,
    title: "Modern Downtown Condo",
    location: "Kingston, ON",
    price: "$450,000",
    beds: 2,
    baths: 2,
    sqft: 1200,
    image: "http://rideaurealty.ca/wp-content/uploads/2025/08/1-640x427.jpg",
    featured: false
  },
  {
    id: 3,
    title: "Family Home with Pool",
    location: "Brockville, ON",
    price: "$750,000",
    beds: 3,
    baths: 2,
    sqft: 2100,
    image: "http://rideaurealty.ca/wp-content/uploads/2025/08/1-640x427.jpg",
    featured: false
  },
  {
    id: 4,
    title: "Historic Character Home",
    location: "Smiths Falls, ON",
    price: "$550,000",
    beds: 3,
    baths: 2,
    sqft: 1800,
    image: "http://rideaurealty.ca/wp-content/uploads/2025/08/1-640x427.jpg",
    featured: false
  }
]

export default function FeaturedProperties() {
  return (
    <section id="properties" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover exceptional properties in the Rideau region. From luxury waterfront estates 
            to charming family homes, we have the perfect property for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Property Image */}
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                {property.featured && (
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
                <button className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full transition-colors duration-200">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {property.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.beds} beds
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.baths} baths
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    {property.sqft.toLocaleString()} sqft
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600">
                    {property.price}
                  </span>
                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
            View All Properties
          </button>
        </motion.div>
      </div>
    </section>
  )
} 