import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Calendar, 
  DollarSign, 
  Home, 
  Thermometer, 
  Droplets,
  Zap,
  Wifi,
  Building,
  TreePine,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  User
} from 'lucide-react'
import { fetchPropertyDetails, type PropertyDetails, type PropertyListing } from '@/lib/api'

interface PropertyDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  property: PropertyListing
}

// Helper function to get agent photo based on name
const getAgentPhoto = (name: string) => {
  const nameLower = name.toLowerCase()
  if (nameLower.includes('zach shea')) return '/images/team/zach-shea.jpg'
  if (nameLower.includes('scott burns')) return '/images/team/scott-burns.jpg'
  if (nameLower.includes('steve wells')) return '/images/team/steve-wells.jpg'
  if (nameLower.includes('joe kozak')) return '/images/team/joe-kozak.jpg'
  if (nameLower.includes('neve wells')) return '/images/team/neve-wells.jpg'
  return '/images/team/scott-burns.jpg' // Default fallback
}

export default function PropertyDetailsModal({ isOpen, onClose, property }: PropertyDetailsModalProps) {
  const [details, setDetails] = useState<PropertyDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (isOpen && property) {
      loadPropertyDetails()
    }
  }, [isOpen, property])

  const loadPropertyDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use property ID and MLS number for the API call
      const propertyDetails = await fetchPropertyDetails(property.id, property.mlsNumber)
      setDetails(propertyDetails)
      setCurrentImageIndex(0)
    } catch (err) {
      console.error('Error loading property details:', err)
      setError('Failed to load property details')
    } finally {
      setLoading(false)
    }
  }

  const nextImage = () => {
    if (details && details.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % details.images.length)
    }
  }

  const prevImage = () => {
    if (details && details.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + details.images.length) % details.images.length)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative min-h-screen flex items-center justify-center p-4"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>

              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
                  <span className="ml-4 text-gray-600">Loading property details...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                      onClick={loadPropertyDetails}
                      className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : details ? (
                <div className="overflow-y-auto max-h-[90vh]">
                            {/* Image Gallery */}
          <div className="relative h-96 overflow-hidden no-swipe">
                    {details.images.length > 0 ? (
                      <>
                        <img
                          src={details.images[currentImageIndex]?.url || property.image}
                          alt={details.title}
                          className="w-full h-full object-cover"
                        />
                        
                        {details.images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors duration-200"
                            >
                              <ChevronLeft className="h-6 w-6 text-gray-600" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors duration-200"
                            >
                              <ChevronRight className="h-6 w-6 text-gray-600" />
                            </button>
                            
                            {/* Image Counter */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                              {currentImageIndex + 1} of {details.images.length}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <img
                        src={property.image}
                        alt={details.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* Price Overlay */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold text-xl">
                        {details.price}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{details.title}</h1>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-5 w-5 mr-2 text-brand-600" />
                        <span>{details.address.street}, {details.address.city}, {details.address.province} {details.address.postalCode}</span>
                      </div>
                      {details.mlsNumber && (
                        <p className="text-sm text-gray-500">MLS® {details.mlsNumber}</p>
                      )}
                    </div>

                    {/* Key Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      {details.property.bedrooms && (
                        <div className="text-center">
                          <Bed className="h-8 w-8 text-brand-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{details.property.bedrooms}</p>
                          <p className="text-sm text-gray-600">Bedroom{details.property.bedrooms !== 1 ? 's' : ''}</p>
                        </div>
                      )}
                      {details.property.bathrooms && (
                        <div className="text-center">
                          <Bath className="h-8 w-8 text-brand-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{details.property.bathrooms}</p>
                          <p className="text-sm text-gray-600">Bathroom{details.property.bathrooms !== 1 ? 's' : ''}</p>
                        </div>
                      )}
                      {details.property.sqft && (
                        <div className="text-center">
                          <Square className="h-8 w-8 text-brand-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{details.property.sqft}</p>
                          <p className="text-sm text-gray-600">Square Feet</p>
                        </div>
                      )}
                      {details.property.parking && (
                        <div className="text-center">
                          <Car className="h-8 w-8 text-brand-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{details.property.parking}</p>
                          <p className="text-sm text-gray-600">Parking</p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{details.description}</p>
                    </div>

                    {/* Property Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                      {/* Building Information */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <Building className="h-5 w-5 text-brand-600 mr-2" />
                          Building Details
                        </h3>
                        <div className="space-y-3">
                          {details.property.type && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Property Type:</span>
                              <span className="font-medium">{details.property.type}</span>
                            </div>
                          )}
                          {details.property.subType && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Style:</span>
                              <span className="font-medium">{details.property.subType}</span>
                            </div>
                          )}
                          {details.property.yearBuilt && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Year Built:</span>
                              <span className="font-medium">{details.property.yearBuilt}</span>
                            </div>
                          )}
                          {details.property.stories && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Stories:</span>
                              <span className="font-medium">{details.property.stories}</span>
                            </div>
                          )}
                          {details.property.bedrooms && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Bedrooms:</span>
                              <span className="font-medium">{details.property.bedrooms}</span>
                            </div>
                          )}
                          {details.property.bathrooms && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Full Bathrooms:</span>
                              <span className="font-medium">{details.property.bathrooms}</span>
                            </div>
                          )}
                          {details.property.halfBaths && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Half Bathrooms:</span>
                              <span className="font-medium">{details.property.halfBaths}</span>
                            </div>
                          )}
                          {details.property.sqft && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Interior Size:</span>
                              <span className="font-medium">{details.property.sqft}</span>
                            </div>
                          )}
                          {details.property.basement && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Basement:</span>
                              <span className="font-medium">{details.property.basement}</span>
                            </div>
                          )}
                          {details.property.heating && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Heating:</span>
                              <span className="font-medium">{details.property.heating}</span>
                            </div>
                          )}
                          {details.property.cooling && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Cooling:</span>
                              <span className="font-medium">{details.property.cooling}</span>
                            </div>
                          )}
                          {details.property.exterior && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Exterior:</span>
                              <span className="font-medium">{details.property.exterior}</span>
                            </div>
                          )}
                          {details.property.roof && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Roof Material:</span>
                              <span className="font-medium">{details.property.roof}</span>
                            </div>
                          )}
                          {details.property.parking && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Parking:</span>
                              <span className="font-medium">{details.property.parking}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Land & Utilities Information */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <TreePine className="h-5 w-5 text-brand-600 mr-2" />
                          Land & Utilities
                        </h3>
                        <div className="space-y-3">
                          {details.property.lotSize && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Lot Size:</span>
                              <span className="font-medium">{details.property.lotSize}</span>
                            </div>
                          )}
                          {details.additional.zoning && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Zoning:</span>
                              <span className="font-medium">{details.additional.zoning}</span>
                            </div>
                          )}
                          {details.utilities.water && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Water Source:</span>
                              <span className="font-medium">{details.utilities.water}</span>
                            </div>
                          )}
                          {details.utilities.sewer && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Sewage System:</span>
                              <span className="font-medium">{details.utilities.sewer}</span>
                            </div>
                          )}
                          {details.utilities.electricity && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Electricity:</span>
                              <span className="font-medium">{details.utilities.electricity}</span>
                            </div>
                          )}
                          {details.utilities.gas && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Gas:</span>
                              <span className="font-medium">{details.utilities.gas}</span>
                            </div>
                          )}
                          {details.utilities.internet && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Internet:</span>
                              <span className="font-medium">{details.utilities.internet}</span>
                            </div>
                          )}
                          {details.additional.possession && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Possession:</span>
                              <span className="font-medium">{details.additional.possession}</span>
                            </div>
                          )}
                          {details.additional.restrictions && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Restrictions:</span>
                              <span className="font-medium text-sm">{details.additional.restrictions}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Financial Information */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <DollarSign className="h-5 w-5 text-brand-600 mr-2" />
                          Financial Details
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">List Price:</span>
                            <span className="font-medium text-brand-600">{details.financials.listPrice}</span>
                          </div>
                          {details.financials.pricePerSqft && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price per Sq Ft:</span>
                              <span className="font-medium">{details.financials.pricePerSqft}</span>
                            </div>
                          )}
                          {details.financials.taxes && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Annual Taxes:</span>
                              <span className="font-medium">{details.financials.taxes}</span>
                            </div>
                          )}
                          {details.financials.fees && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Maintenance Fees:</span>
                              <span className="font-medium">{details.financials.fees}</span>
                            </div>
                          )}
                          {details.dates.listed && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Date Listed:</span>
                              <span className="font-medium">{new Date(details.dates.listed).toLocaleDateString()}</span>
                            </div>
                          )}
                          {details.dates.updated && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Last Updated:</span>
                              <span className="font-medium">{new Date(details.dates.updated).toLocaleDateString()}</span>
                            </div>
                          )}
                          {details.dates.timeOnMarket && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Time on Market:</span>
                              <span className="font-medium">{details.dates.timeOnMarket}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    {details.features.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Features & Amenities</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {details.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-brand-600 rounded-full"></div>
                              <span className="text-gray-700 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Appliances & Inclusions */}
                    {(details.additional.inclusions || details.additional.exclusions) && (
                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <Home className="h-5 w-5 text-brand-600 mr-2" />
                          Appliances & Inclusions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {details.additional.inclusions && (
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                                <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                                Included
                              </h4>
                              <p className="text-green-700 text-sm leading-relaxed">{details.additional.inclusions}</p>
                            </div>
                          )}
                          {details.additional.exclusions && (
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                              <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                                <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                                Not Included
                              </h4>
                              <p className="text-red-700 text-sm leading-relaxed">{details.additional.exclusions}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Room Details with Dimensions */}
                    {details.rooms.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <Square className="h-5 w-5 text-brand-600 mr-2" />
                          Room Details & Dimensions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {details.rooms.map((room, index) => (
                            <div key={index} className="bg-brand-50 p-4 rounded-lg border border-brand-200">
                              <h4 className="font-semibold text-brand-800 mb-2">{room.type}</h4>
                              <div className="space-y-1">
                                {room.level && (
                                  <div className="flex items-center text-sm">
                                    <span className="text-brand-600 font-medium w-16">Level:</span>
                                    <span className="text-brand-700">{room.level}</span>
                                  </div>
                                )}
                                {room.dimensions && (
                                  <div className="flex items-center text-sm">
                                    <span className="text-brand-600 font-medium w-16">Size:</span>
                                    <span className="text-brand-700 font-mono">{room.dimensions}</span>
                                  </div>
                                )}
                                {room.description && (
                                  <div className="text-sm text-brand-700 mt-2 pt-2 border-t border-brand-200">
                                    {room.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Agent Information */}
                    {details.agents.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Listing Agent{details.agents.length > 1 ? 's' : ''}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {details.agents.map((agent, index) => (
                            <div key={index} className="bg-brand-50 p-6 rounded-lg border border-brand-200">
                              <div className="flex items-center space-x-4">
                                <img
                                  src={getAgentPhoto(agent.name)}
                                  alt={agent.name}
                                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <div>
                                  <h4 className="font-bold text-brand-800 text-lg">{agent.name}</h4>
                                  {agent.position && (
                                    <p className="text-brand-600 text-sm mb-2">{agent.position}</p>
                                  )}
                                  <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <Phone className="h-4 w-4 text-brand-600" />
                                      <span className="text-brand-700 text-sm">{agent.phone}</span>
                                    </div>
                                    {agent.email && (
                                      <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-brand-600" />
                                        <span className="text-brand-700 text-sm">{agent.email}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact CTA */}
                    <div className="bg-brand-600 text-white p-6 rounded-lg text-center">
                      <h3 className="text-xl font-bold mb-2">Interested in this property?</h3>
                      <p className="mb-4">Contact our team for more information or to schedule a viewing.</p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                          href="tel:(613) 272-5000"
                          className="bg-white text-brand-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                        >
                          Call (613) 272-5000
                        </a>
                        <a
                          href="mailto:info@rideaurealty.ca"
                          className="bg-brand-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-800 transition-colors duration-200"
                        >
                          Send Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <p className="text-gray-600">No property details available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}