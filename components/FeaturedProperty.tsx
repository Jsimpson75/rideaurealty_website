import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Bed, Bath, Square, Home, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchPropertyListings, type PropertyListing } from '@/lib/api'
import { ApiCache } from '@/lib/cache'

const getAgentPhoto = (name: string) => {
  const nameLower = name.toLowerCase()
  if (nameLower.includes('zach shea')) return '/images/team/zach-shea.jpg'
  if (nameLower.includes('scott burns')) return '/images/team/scott-burns.jpg'
  if (nameLower.includes('steve wells')) return '/images/team/steve-wells.jpg'
  if (nameLower.includes('joe kozak')) return '/images/team/joe-kozak.jpg'
  if (nameLower.includes('neve wells')) return '/images/team/neve-wells.jpg'
  return '/images/team/scott-burns.jpg'
}

export default function FeaturedProperty() {
  const [featuredProperty, setFeaturedProperty] = useState<PropertyListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFeaturedProperty = async () => {
      const cacheKey = 'featured_property'
      
      try {
        setLoading(true)
        setError(null)
        
        const cachedProperty = ApiCache.get<PropertyListing>(cacheKey)
        
        if (cachedProperty) {
          console.log('Loading featured property from cache')
          setFeaturedProperty(cachedProperty)
          setLoading(false)
          return
        }
        
        console.log('Selecting new featured property')
        
        const cachedListings = ApiCache.get<{ properties: PropertyListing[], totalRecords: number }>('property_listings')
        let properties: PropertyListing[]
        
        if (cachedListings) {
          console.log('Using cached property listings for featured selection')
          properties = cachedListings.properties
        } else {
          console.log('Fetching fresh property listings for featured selection')
          const result = await fetchPropertyListings({
            recordsPerPage: 100
          })
          properties = result.properties
        }
        
        const eligibleProperties = properties.filter(property => {
          const priceValue = property.priceValue || 0
          const isNotVacantLand = !property.propertyType.toLowerCase().includes('vacant') && 
                                 !property.type.toLowerCase().includes('vacant')
          
          return priceValue > 500000 && isNotVacantLand
        })
        
        let selectedProperty: PropertyListing | null = null
        
        if (eligibleProperties.length > 0) {
          const now = new Date()
          const hourSeed = now.getFullYear() * 1000000 + now.getMonth() * 100000 + now.getDate() * 1000 + now.getHours()
          const randomIndex = hourSeed % eligibleProperties.length
          selectedProperty = eligibleProperties[randomIndex]
        } else {
          if (properties.length > 0) {
            const now = new Date()
            const hourSeed = now.getFullYear() * 1000000 + now.getMonth() * 100000 + now.getDate() * 1000 + now.getHours()
            const randomIndex = hourSeed % properties.length
            selectedProperty = properties[randomIndex]
          }
        }
        
        if (selectedProperty) {
          ApiCache.set(cacheKey, selectedProperty, 60)
          setFeaturedProperty(selectedProperty)
        }
      } catch (err) {
        console.error('Error loading featured property:', err)
        setError('Failed to load featured property')
      } finally {
        setLoading(false)
      }
    }
    
    loadFeaturedProperty()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Property</h2>
            <p className="text-lg text-gray-600">Discover premium properties in the Rideau Lakes region</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-96 bg-gray-300"></div>
              <div className="p-8">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                <div className="flex space-x-4 mb-4">
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !featuredProperty) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Property</h2>
            <p className="text-lg text-gray-600">
              {error || 'No featured property available at the moment.'}
            </p>
            <Link 
              to="/listings"
              className="inline-block mt-6 bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              View All Listings
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Property</h2>
          <p className="text-lg text-gray-600">Discover premium properties in the Rideau Lakes region</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-96 overflow-hidden">
              <img
                src={featuredProperty.image}
                alt={featuredProperty.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="bg-brand-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-brand-600 px-4 py-2 rounded-lg font-bold text-lg">
                  {featuredProperty.price}
                </span>
              </div>
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {featuredProperty.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2 text-brand-600" />
                  <span>{featuredProperty.location}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {featuredProperty.bedrooms && (
                  <div className="flex items-center text-gray-600">
                    <Bed className="h-5 w-5 mr-2 text-brand-600" />
                    <span className="text-sm">{featuredProperty.bedrooms} Bed{featuredProperty.bedrooms !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {featuredProperty.bathrooms && (
                  <div className="flex items-center text-gray-600">
                    <Bath className="h-5 w-5 mr-2 text-brand-600" />
                    <span className="text-sm">{featuredProperty.bathrooms} Bath{featuredProperty.bathrooms !== 1 ? 's' : ''}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Square className="h-5 w-5 mr-2 text-brand-600" />
                  <span className="text-sm">{featuredProperty.sqft}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Home className="h-5 w-5 mr-2 text-brand-600" />
                  <span className="text-sm">{featuredProperty.propertyType}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed line-clamp-3">
                  {featuredProperty.description}
                </p>
              </div>
              
              <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={getAgentPhoto(featuredProperty.agentName)}
                      alt={featuredProperty.agentName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <p className="font-semibold text-brand-800">{featuredProperty.agentName}</p>
                      <p className="text-sm text-brand-600">{featuredProperty.agentPhone}</p>
                    </div>
                  </div>
                  {featuredProperty.mlsNumber && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500">MLS: {featuredProperty.mlsNumber}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/listings"
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 px-6 rounded-lg font-semibold text-center transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Eye className="h-5 w-5" />
                  <span>View Details</span>
                </Link>
                <Link
                  to="/listings"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold text-center transition-colors duration-200"
                >
                  See More Properties
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
