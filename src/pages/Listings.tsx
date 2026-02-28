import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Bed, Bath, Square, Heart, Eye, Filter, Loader, X } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyDetailsModal from '@/components/PropertyDetailsModal'
import { fetchPropertyListings, type PropertyListing, type PropertyAgent } from '@/lib/api'
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

const fallbackProperties: PropertyListing[] = [
  {
    id: '1',
    mlsNumber: 'FALLBACK001',
    title: "Waterfront Cottage on Big Rideau Lake",
    price: "$875,000",
    priceValue: 875000,
    location: "Portland, ON",
    city: "Portland",
    province: "Ontario",
    bedrooms: 3,
    bathrooms: 2,
    sqft: "1,850 sqft",
    type: "Waterfront",
    description: "Beautiful waterfront cottage with panoramic lake views, private dock, and sandy beach.",
    features: ["Private Dock", "Sandy Beach", "Fireplace", "Deck"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    agentName: "Rideau Realty Team",
    agentPhone: "(613) 272-5000",
    agents: [
      {
        name: "Rideau Realty Team",
        phone: "(613) 272-5000",
        position: "Sales Team"
      }
    ],
    propertyType: "House"
  },
]

const propertyTypes = ["All Types", "Waterfront", "Farm", "Residential", "Vacant Land", "Townhouse", "Condo"]
const locations = ["All Locations", "Portland", "Westport", "Delta", "Elgin", "Seeley's Bay", "Rideau Ferry", "Lombardy", "Near Perth", "Rideau Lakes"]
const priceRanges = ["All Prices", "Under $500K", "$500K - $750K", "$750K - $1M", "Over $1M", "Over $1.5M"]
const bedroomOptions = ["Any Bedrooms", "1", "1+", "2", "2+", "3", "3+", "4", "4+", "5", "5+"]
const bathroomOptions = ["Any Bathrooms", "1", "1+", "2", "2+", "3", "3+", "4", "4+"]
const sqftRanges = ["Any Size", "Under 1,000 sqft", "1,000-1,500 sqft", "1,500-2,000 sqft", "2,000-2,500 sqft", "2,500-3,000 sqft", "Over 3,000 sqft"]

export default function ListingsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [keywords, setKeywords] = useState('')
  const [selectedType, setSelectedType] = useState('All Types')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices')
  const [selectedAgent, setSelectedAgent] = useState('All Agents')
  const [selectedBedrooms, setSelectedBedrooms] = useState('Any Bedrooms')
  const [selectedBathrooms, setSelectedBathrooms] = useState('Any Bathrooms')
  const [selectedSqft, setSelectedSqft] = useState('Any Size')
  
  const [allProperties, setAllProperties] = useState<PropertyListing[]>([])
  const [filteredProperties, setFilteredProperties] = useState<PropertyListing[]>([])
  const [availableAgents, setAvailableAgents] = useState<string[]>(['All Agents'])
  
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalRecords, setTotalRecords] = useState(0)
  
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const loadProperties = async () => {
      const cacheKey = 'property_listings'
      
      try {
        setLoading(true)
        setError(null)
        
        const cachedData = ApiCache.get<{ properties: PropertyListing[], totalRecords: number }>(cacheKey)
        
        if (cachedData) {
          console.log('Loading properties from cache')
          setAllProperties(cachedData.properties)
          setFilteredProperties(cachedData.properties)
          setTotalRecords(cachedData.totalRecords)
          
          const agents = ['All Agents', ...new Set(cachedData.properties.map(p => p.agentName).filter(Boolean))]
          setAvailableAgents(agents)
          setLoading(false)
          return
        }
        
        console.log('Fetching properties from API')
        const { properties, totalRecords: total } = await fetchPropertyListings({
          recordsPerPage: 50
        })
        
        ApiCache.set(cacheKey, { properties, totalRecords: total }, 10)
        
        setAllProperties(properties)
        setFilteredProperties(properties)
        setTotalRecords(total)
        
        const agents = ['All Agents', ...new Set(properties.map(p => p.agentName).filter(Boolean))]
        setAvailableAgents(agents)
      } catch (err) {
        console.error('Failed to fetch properties:', err)
        setError('Failed to load properties. Showing sample listings.')
        setAllProperties(fallbackProperties)
        setFilteredProperties(fallbackProperties)
        setTotalRecords(fallbackProperties.length)
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  useEffect(() => {
    let filtered = allProperties

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(term) ||
        property.location.toLowerCase().includes(term) ||
        property.city.toLowerCase().includes(term) ||
        property.description.toLowerCase().includes(term) ||
        property.features.some(feature => feature.toLowerCase().includes(term)) ||
        property.agentName.toLowerCase().includes(term) ||
        property.mlsNumber.toLowerCase().includes(term)
      )
    }

    if (keywords) {
      const keywordList = keywords.toLowerCase().split(',').map(k => k.trim()).filter(k => k.length > 0)
      filtered = filtered.filter(property =>
        keywordList.some(keyword =>
          property.description.toLowerCase().includes(keyword) ||
          property.features.some(feature => feature.toLowerCase().includes(keyword)) ||
          property.title.toLowerCase().includes(keyword)
        )
      )
    }

    if (selectedType !== 'All Types') {
      filtered = filtered.filter(property => property.type === selectedType)
    }

    if (selectedLocation !== 'All Locations') {
      filtered = filtered.filter(property => 
        property.city.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        property.location.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    if (selectedAgent !== 'All Agents') {
      filtered = filtered.filter(property => property.agentName === selectedAgent)
    }

    if (selectedPriceRange !== 'All Prices') {
      filtered = filtered.filter(property => {
        if (!property.priceValue) return true
        
        const price = property.priceValue
        switch (selectedPriceRange) {
          case 'Under $500K': return price < 500000
          case '$500K - $750K': return price >= 500000 && price <= 750000
          case '$750K - $1M': return price > 750000 && price <= 1000000
          case 'Over $1M': return price > 1000000 && price <= 1500000
          case 'Over $1.5M': return price > 1500000
          default: return true
        }
      })
    }

    if (selectedBedrooms !== 'Any Bedrooms') {
      filtered = filtered.filter(property => {
        if (!property.bedrooms) return false
        
        const bedrooms = property.bedrooms
        if (selectedBedrooms.includes('+')) {
          const minBedrooms = parseInt(selectedBedrooms.replace('+', ''))
          return bedrooms >= minBedrooms
        } else {
          return bedrooms === parseInt(selectedBedrooms)
        }
      })
    }

    if (selectedBathrooms !== 'Any Bathrooms') {
      filtered = filtered.filter(property => {
        if (!property.bathrooms) return false
        
        const bathrooms = property.bathrooms
        if (selectedBathrooms.includes('+')) {
          const minBathrooms = parseInt(selectedBathrooms.replace('+', ''))
          return bathrooms >= minBathrooms
        } else {
          return bathrooms === parseInt(selectedBathrooms)
        }
      })
    }

    if (selectedSqft !== 'Any Size') {
      filtered = filtered.filter(property => {
        if (!property.sqft || property.sqft === 'N/A') return false
        
        const sqftMatch = property.sqft.replace(/,/g, '').match(/(\d+)/)
        if (!sqftMatch) return false
        
        const sqft = parseInt(sqftMatch[1])
        switch (selectedSqft) {
          case 'Under 1,000 sqft': return sqft < 1000
          case '1,000-1,500 sqft': return sqft >= 1000 && sqft <= 1500
          case '1,500-2,000 sqft': return sqft >= 1500 && sqft <= 2000
          case '2,000-2,500 sqft': return sqft >= 2000 && sqft <= 2500
          case '2,500-3,000 sqft': return sqft >= 2500 && sqft <= 3000
          case 'Over 3,000 sqft': return sqft > 3000
          default: return true
        }
      })
    }

    setFilteredProperties(filtered)
  }, [allProperties, searchTerm, keywords, selectedType, selectedLocation, selectedAgent, selectedPriceRange, selectedBedrooms, selectedBathrooms, selectedSqft])

  const clearAllFilters = () => {
    setSearchTerm('')
    setKeywords('')
    setSelectedType('All Types')
    setSelectedLocation('All Locations')
    setSelectedAgent('All Agents')
    setSelectedPriceRange('All Prices')
    setSelectedBedrooms('Any Bedrooms')
    setSelectedBathrooms('Any Bathrooms')
    setSelectedSqft('Any Size')
  }

  const openPropertyDetails = (property: PropertyListing) => {
    setSelectedProperty(property)
    setIsModalOpen(true)
  }

  const closePropertyDetails = () => {
    setIsModalOpen(false)
    setSelectedProperty(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 no-swipe">
      <Header />
      
      <section className="bg-gradient-to-r from-brand-600 to-brand-800 text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Property Listings
            </h1>
            <p className="text-xl text-brand-100 max-w-3xl mx-auto">
              Discover beautiful properties in the Rideau Lakes region with advanced filtering
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="p-8 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search by location, property type, MLS#, agent, or features..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900 text-lg transition-all duration-200"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-brand-100 hover:bg-brand-200 text-brand-700 px-6 py-4 rounded-xl flex items-center space-x-2 transition-colors duration-200 font-medium"
                  >
                    <Filter className="h-5 w-5" />
                    <span>Advanced Filters</span>
                  </button>

                  <button
                    onClick={clearAllFilters}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-4 rounded-xl font-medium transition-colors duration-200"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            <div className={`${showFilters ? 'block' : 'hidden'} bg-gray-50`}>
              <div className="p-8">
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Keywords & Features</h3>
                  <div className="max-w-2xl">
                    <input
                      type="text"
                      placeholder="e.g., waterfront, garage, fireplace, updated kitchen..."
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900 transition-all duration-200"
                    />
                    <p className="text-sm text-gray-500 mt-2">Separate multiple keywords with commas</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900 bg-white transition-all duration-200"
                    >
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900 bg-white transition-all duration-200"
                    >
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <select
                      value={selectedPriceRange}
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900 bg-white transition-all duration-200"
                    >
                      {priceRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Listing Agent</label>
                    <select
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900 bg-white transition-all duration-200"
                    >
                      {availableAgents.map(agent => (
                        <option key={agent} value={agent}>{agent}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                    <select
                      value={selectedBedrooms}
                      onChange={(e) => setSelectedBedrooms(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900 bg-white transition-all duration-200"
                    >
                      {bedroomOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                    <select
                      value={selectedBathrooms}
                      onChange={(e) => setSelectedBathrooms(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900 bg-white transition-all duration-200"
                    >
                      {bathroomOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Square Footage</label>
                    <select
                      value={selectedSqft}
                      onChange={(e) => setSelectedSqft(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900 bg-white transition-all duration-200"
                    >
                      {sqftRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
              <div className="flex items-center">
                <div className="text-orange-600 text-sm">
                  {error}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Loading Properties...</span>
                </div>
              ) : (
                `${filteredProperties.length} Properties Found`
              )}
            </h2>
            <div className="text-sm text-gray-600">
              {loading ? 'Fetching latest listings...' : `Total available: ${totalRecords}`}
            </div>
          </div>

          {!loading && (searchTerm || keywords || selectedType !== 'All Types' || selectedLocation !== 'All Locations' || selectedAgent !== 'All Agents' || selectedPriceRange !== 'All Prices' || selectedBedrooms !== 'Any Bedrooms' || selectedBathrooms !== 'Any Bathrooms' || selectedSqft !== 'Any Size') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-brand-50 to-brand-100 px-6 py-4 border-b border-brand-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-brand-800 flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-brand-600" />
                    Active Filters
                  </h3>
                  <button
                    onClick={clearAllFilters}
                    className="bg-white hover:bg-brand-50 text-brand-700 hover:text-brand-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm border border-brand-200"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-3">
                  {searchTerm && (
                    <div className="inline-flex items-center bg-brand-50 text-brand-700 px-4 py-2 rounded-xl border border-brand-200 group">
                      <span className="text-sm font-medium mr-2">Search: &quot;{searchTerm}&quot;</span>
                      <button onClick={() => setSearchTerm('')} className="text-brand-500 hover:text-brand-700 hover:bg-brand-100 rounded-full p-1 transition-colors duration-200">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  {keywords && (
                    <div className="inline-flex items-center bg-brand-50 text-brand-700 px-4 py-2 rounded-xl border border-brand-200 group">
                      <span className="text-sm font-medium mr-2">Keywords: &quot;{keywords}&quot;</span>
                      <button onClick={() => setKeywords('')} className="text-brand-500 hover:text-brand-700 hover:bg-brand-100 rounded-full p-1 transition-colors duration-200">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  {selectedType !== 'All Types' && (
                    <div className="inline-flex items-center bg-brand-50 text-brand-700 px-4 py-2 rounded-xl border border-brand-200 group">
                      <span className="text-sm font-medium mr-2">Type: {selectedType}</span>
                      <button onClick={() => setSelectedType('All Types')} className="text-brand-500 hover:text-brand-700 hover:bg-brand-100 rounded-full p-1 transition-colors duration-200">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  {selectedLocation !== 'All Locations' && (
                    <div className="inline-flex items-center bg-brand-50 text-brand-700 px-4 py-2 rounded-xl border border-brand-200 group">
                      <span className="text-sm font-medium mr-2">Location: {selectedLocation}</span>
                      <button onClick={() => setSelectedLocation('All Locations')} className="text-brand-500 hover:text-brand-700 hover:bg-brand-100 rounded-full p-1 transition-colors duration-200">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  {selectedAgent !== 'All Agents' && (
                    <div className="inline-flex items-center bg-brand-50 text-brand-700 px-4 py-2 rounded-xl border border-brand-200 group">
                      <span className="text-sm font-medium mr-2">Agent: {selectedAgent}</span>
                      <button onClick={() => setSelectedAgent('All Agents')} className="text-brand-500 hover:text-brand-700 hover:bg-brand-100 rounded-full p-1 transition-colors duration-200">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  {selectedPriceRange !== 'All Prices' && (
                    <div className="inline-flex items-center bg-brand-50 text-brand-700 px-4 py-2 rounded-xl border border-brand-200 group">
                      <span className="text-sm font-medium mr-2">Price: {selectedPriceRange}</span>
                      <button onClick={() => setSelectedPriceRange('All Prices')} className="text-brand-500 hover:text-brand-700 hover:bg-brand-100 rounded-full p-1 transition-colors duration-200">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  {selectedBedrooms !== 'Any Bedrooms' && (
                    <div className="inline-flex items-center bg-brand-50 text-brand-700 px-4 py-2 rounded-xl border border-brand-200 group">
                      <span className="text-sm font-medium mr-2">Bedrooms: {selectedBedrooms}</span>
                      <button onClick={() => setSelectedBedrooms('Any Bedrooms')} className="text-brand-500 hover:text-brand-700 hover:bg-brand-100 rounded-full p-1 transition-colors duration-200">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  {selectedBathrooms !== 'Any Bathrooms' && (
                    <div className="inline-flex items-center bg-brand-50 text-brand-700 px-4 py-2 rounded-xl border border-brand-200 group">
                      <span className="text-sm font-medium mr-2">Bathrooms: {selectedBathrooms}</span>
                      <button onClick={() => setSelectedBathrooms('Any Bathrooms')} className="text-brand-500 hover:text-brand-700 hover:bg-brand-100 rounded-full p-1 transition-colors duration-200">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  {selectedSqft !== 'Any Size' && (
                    <div className="inline-flex items-center bg-brand-50 text-brand-700 px-4 py-2 rounded-xl border border-brand-200 group">
                      <span className="text-sm font-medium mr-2">Size: {selectedSqft}</span>
                      <button onClick={() => setSelectedSqft('Any Size')} className="text-brand-500 hover:text-brand-700 hover:bg-brand-100 rounded-full p-1 transition-colors duration-200">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={`loading-${index}`} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-4 w-3/4"></div>
                    <div className="flex space-x-4 mb-4">
                      <div className="h-3 bg-gray-300 rounded w-12"></div>
                      <div className="h-3 bg-gray-300 rounded w-12"></div>
                      <div className="h-3 bg-gray-300 rounded w-12"></div>
                    </div>
                    <div className="h-3 bg-gray-300 rounded mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-brand-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {property.type}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {property.title}
                    </h3>
                    <div className="text-right">
                      <div className="text-xl font-bold text-brand-600">
                        {property.price}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="bg-brand-50 border border-brand-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-brand-800 mb-3">
                          {property.agents.length > 1 ? 'Listing Agents' : 'Listing Agent'}
                        </p>
                        {property.agents.length <= 2 ? (
                          <div className="space-y-3">
                            {property.agents.map((agent, idx) => (
                              <div key={idx} className="flex items-center space-x-3">
                                <img
                                  src={getAgentPhoto(agent.name)}
                                  alt={agent.name}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <div>
                                  <p className="text-sm font-bold text-gray-900">{agent.name}</p>
                                  {agent.position && (
                                    <p className="text-xs text-gray-600">{agent.position}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-3">
                              <img
                                src={getAgentPhoto(property.agents[0].name)}
                                alt={property.agents[0].name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                              />
                              <div>
                                <p className="text-sm font-bold text-gray-900">{property.agents[0].name}</p>
                                {property.agents[0].position && (
                                  <p className="text-xs text-gray-600">{property.agents[0].position}</p>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 ml-13">
                              +{property.agents.length - 1} more agent{property.agents.length > 2 ? 's' : ''}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        {property.mlsNumber && (
                          <p className="text-xs text-gray-500">MLS: {property.mlsNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    {property.bedrooms && (
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.bathrooms}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.sqft}</span>
                    </div>
                  </div>

                  <div className="text-gray-700 text-sm mb-4 flex-grow">
                    <p className="leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {property.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                    {property.features.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        +{property.features.length - 3} more
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={() => openPropertyDetails(property)}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200 mt-auto"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
              ))
            )}
          </div>

          {!loading && filteredProperties.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all available properties.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {selectedProperty && (
        <PropertyDetailsModal
          isOpen={isModalOpen}
          onClose={closePropertyDetails}
          property={selectedProperty}
        />
      )}
    </div>
  )
}
