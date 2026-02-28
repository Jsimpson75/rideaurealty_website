// API service for fetching property listings from Realtor.ca API

export interface PropertyDetails {
  id: string
  mlsNumber: string
  title: string
  price: string
  priceValue?: number
  description: string
  address: {
    street: string
    city: string
    province: string
    postalCode: string
    latitude?: number
    longitude?: number
  }
  property: {
    type: string
    subType?: string
    bedrooms?: number
    bathrooms?: number
    halfBaths?: number
    sqft?: string
    lotSize?: string
    yearBuilt?: number
    stories?: number
    parking?: string
    basement?: string
    heating?: string
    cooling?: string
    exterior?: string
    roof?: string
  }
  features: string[]
  images: Array<{
    url: string
    description?: string
  }>
  agents: PropertyAgent[]
  financials: {
    listPrice: string
    taxes?: string
    fees?: string
    pricePerSqft?: string
  }
  dates: {
    listed?: string
    updated?: string
    timeOnMarket?: string
  }
  rooms: Array<{
    type: string
    level?: string
    dimensions?: string
    description?: string
  }>
  utilities: {
    water?: string
    sewer?: string
    electricity?: string
    gas?: string
    internet?: string
  }
  additional: {
    zoning?: string
    possession?: string
    restrictions?: string
    inclusions?: string
    exclusions?: string
  }
}

export interface PropertyAgent {
  name: string
  phone: string
  email?: string
  position?: string
}

export interface PropertyListing {
  id: string
  mlsNumber: string
  title: string
  price: string
  priceValue?: number
  location: string
  city: string
  province: string
  bedrooms?: number
  bathrooms?: number
  sqft: string
  type: string
  description: string
  features: string[]
  image: string
  agentName: string // Primary agent for backward compatibility
  agentPhone: string // Primary agent phone for backward compatibility
  agentEmail?: string // Primary agent email for backward compatibility
  agents: PropertyAgent[] // All agents associated with the property
  latitude?: number
  longitude?: number
  propertyType: string
  parkingSpaces?: number
  landSize?: string
  timeOnMarket?: string
}

interface APIPropertyResponse {
  Id: string
  MlsNumber: string
  PublicRemarks: string
  Building?: {
    BathroomTotal?: string
    Bedrooms?: string
    SizeInterior?: string
    Type?: string
    StoriesTotal?: string
    FloorAreaMeasurements?: Array<{
      Area?: string
      AreaUnformatted?: string
    }>
  }
  Individual?: Array<{
    Name?: string
    Phones?: Array<{
      PhoneNumber?: string
      AreaCode?: string
      PhoneTypeId?: string
    }>
    Emails?: Array<{
      ContactId?: string
    }>
  }>
  Property?: {
    Price?: string
    Type?: string
    PriceUnformattedValue?: string
    Address?: {
      AddressText?: string
      Longitude?: string
      Latitude?: string
    }
    Photo?: Array<{
      LowResPath?: string
      MedResPath?: string
      HighResPath?: string
    }>
    ParkingSpaceTotal?: string
  }
  Land?: {
    SizeTotal?: string
    SizeFrontage?: string
  }
  TimeOnRealtor?: string
}

interface APIResponse {
  ErrorCode: {
    Id: number
    Description: string
  }
  Paging: {
    TotalRecords: number
    RecordsPerPage: number
    CurrentPage: number
  }
  Results: APIPropertyResponse[]
}

const API_CONFIG = {
  baseUrl: 'https://realty-in-ca1.p.rapidapi.com',
  headers: {
    'x-rapidapi-host': 'realty-in-ca1.p.rapidapi.com',
    'x-rapidapi-key': '5be04ccacbmsh719915338a197fdp1a839djsn7b6a94dec832'
  }
}

function parsePropertyType(apiType?: string): string {
  if (!apiType) return 'Residential'
  
  const type = apiType.toLowerCase()
  if (type.includes('house') || type.includes('single family')) return 'Residential'
  if (type.includes('row') || type.includes('townhouse')) return 'Townhouse'
  if (type.includes('condo') || type.includes('apartment')) return 'Condo'
  return 'Residential'
}

function extractLocation(addressText?: string): { city: string; location: string } {
  if (!addressText) return { city: 'Unknown', location: 'Unknown' }
  
  const parts = addressText.split('|')
  const locationPart = parts.length > 1 ? parts[1] : addressText
  
  // Extract city from location (format: "City, Province PostalCode")
  const locationMatch = locationPart.match(/^([^,]+),\s*([^K\d]+)/);
  const city = locationMatch ? locationMatch[1].trim() : 'Unknown'
  
  return {
    city,
    location: locationPart.replace(/\s+K\d[A-Z]\s*\d[A-Z]\d$/, '').trim()
  }
}

function extractFeatures(description: string, building?: APIPropertyResponse['Building']): string[] {
  const features: string[] = []
  
  // Extract from description
  const desc = description.toLowerCase()
  if (desc.includes('waterfront') || desc.includes('lake')) features.push('Waterfront')
  if (desc.includes('garage')) features.push('Garage')
  if (desc.includes('fireplace')) features.push('Fireplace')
  if (desc.includes('basement')) features.push('Basement')
  if (desc.includes('deck') || desc.includes('porch')) features.push('Deck/Porch')
  if (desc.includes('pool')) features.push('Pool')
  if (desc.includes('barn')) features.push('Barn')
  if (desc.includes('workshop')) features.push('Workshop')
  if (desc.includes('private')) features.push('Private')
  if (desc.includes('updated') || desc.includes('renovated')) features.push('Updated')
  
  // Extract from building amenities
  if ((building as any)?.Amenities) {
    if ((building as any).Amenities.toLowerCase().includes('fireplace')) {
      features.push('Fireplace')
    }
  }
  
  return [...new Set(features)] // Remove duplicates
}

function formatPrice(price?: string, priceValue?: string): string {
  if (!price) return 'Contact for Price'
  
  // Handle "Contact for Price" or similar cases
  if (price.toLowerCase().includes('contact') || price.toLowerCase().includes('call')) {
    return 'Contact for Price'
  }
  
  return price
}

function transformAPIResponseToListing(apiProperty: APIPropertyResponse): PropertyListing {
  const { city, location } = extractLocation(apiProperty.Property?.Address?.AddressText)
  
  // Process all agents
  const agents: PropertyAgent[] = (apiProperty.Individual || []).map(individual => ({
    name: individual.Name || 'Rideau Realty Team',
    phone: individual.Phones?.[0] 
      ? `(${individual.Phones[0].AreaCode}) ${individual.Phones[0].PhoneNumber}`
      : '(613) 272-5000',
    email: individual.Emails?.[0]?.ContactId ? `agent@rideaurealty.ca` : undefined,
    position: (individual as any).Position
  }))
  
  // Primary agent (first agent or fallback)
  const primaryAgent = agents[0] || {
    name: 'Rideau Realty Team',
    phone: '(613) 272-5000'
  }
  
  const features = extractFeatures(apiProperty.PublicRemarks || '', apiProperty.Building)
  const propertyType = parsePropertyType(apiProperty.Property?.Type)
  
  // Determine main property type for filtering
  let mainType = 'Residential'
  const description = apiProperty.PublicRemarks?.toLowerCase() || ''
  if (description.includes('waterfront') || description.includes('lake')) {
    mainType = 'Waterfront'
  } else if (description.includes('farm') || description.includes('barn') || description.includes('acre')) {
    mainType = 'Farm'
  } else if (description.includes('vacant') || description.includes('lot') || description.includes('land')) {
    mainType = 'Vacant Land'
  }
  
  // Extract square footage
  let sqft = 'N/A'
  if (apiProperty.Building?.FloorAreaMeasurements?.[0]?.AreaUnformatted) {
    sqft = apiProperty.Building.FloorAreaMeasurements[0].AreaUnformatted
  } else if (apiProperty.Land?.SizeTotal) {
    sqft = apiProperty.Land.SizeTotal
  }
  
  return {
    id: apiProperty.Id,
    mlsNumber: apiProperty.MlsNumber,
    title: generatePropertyTitle(apiProperty),
    price: formatPrice(apiProperty.Property?.Price, apiProperty.Property?.PriceUnformattedValue),
    priceValue: apiProperty.Property?.PriceUnformattedValue ? parseInt(apiProperty.Property.PriceUnformattedValue) : undefined,
    location,
    city,
    province: 'Ontario',
    bedrooms: apiProperty.Building?.Bedrooms ? parseInt(apiProperty.Building.Bedrooms.replace(/[^\d]/g, '')) : undefined,
    bathrooms: apiProperty.Building?.BathroomTotal ? parseInt(apiProperty.Building.BathroomTotal) : undefined,
    sqft,
    type: mainType,
    description: apiProperty.PublicRemarks || 'Beautiful property in the Rideau Lakes region.',
    features,
    image: apiProperty.Property?.Photo?.[0]?.HighResPath || apiProperty.Property?.Photo?.[0]?.MedResPath || apiProperty.Property?.Photo?.[0]?.LowResPath || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    agentName: primaryAgent.name,
    agentPhone: primaryAgent.phone,
    agentEmail: primaryAgent.email,
    agents,
    latitude: apiProperty.Property?.Address?.Latitude ? parseFloat(apiProperty.Property.Address.Latitude) : undefined,
    longitude: apiProperty.Property?.Address?.Longitude ? parseFloat(apiProperty.Property.Address.Longitude) : undefined,
    propertyType,
    parkingSpaces: apiProperty.Property?.ParkingSpaceTotal ? parseInt(apiProperty.Property.ParkingSpaceTotal) : undefined,
    landSize: apiProperty.Land?.SizeTotal,
    timeOnMarket: apiProperty.TimeOnRealtor
  }
}

function generatePropertyTitle(apiProperty: APIPropertyResponse): string {
  const address = apiProperty.Property?.Address?.AddressText
  const { city } = extractLocation(address)
  const propertyType = apiProperty.Property?.Type || 'Property'
  
  // Extract street address
  const streetAddress = address?.split('|')[0] || ''
  
  // Create a descriptive title
  if (streetAddress && city !== 'Unknown') {
    return `${streetAddress}, ${city}`
  } else if (city !== 'Unknown') {
    return `${propertyType} in ${city}`
  } else {
    return `Beautiful ${propertyType} in Rideau Lakes Region`
  }
}

export async function fetchPropertyListings(params: {
  recordsPerPage?: number
  sortOrder?: string
  sortBy?: number
  organizationId?: number
} = {}): Promise<{ properties: PropertyListing[]; totalRecords: number }> {
  const {
    recordsPerPage = 50,
    sortOrder = 'D',
    sortBy = 1,
    organizationId = 56031
  } = params
  
  try {
    const url = new URL(`${API_CONFIG.baseUrl}/agents/get-listings`)
    url.searchParams.append('RecordsPerPage', recordsPerPage.toString())
    url.searchParams.append('SortOrder', sortOrder)
    url.searchParams.append('SortBy', sortBy.toString())
    url.searchParams.append('CultureId', '1')
    url.searchParams.append('OrganizationId', organizationId.toString())
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...API_CONFIG.headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'default'
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }
    
    const data: APIResponse = await response.json()
    
    if (data.ErrorCode.Id !== 200) {
      throw new Error(`API Error: ${data.ErrorCode.Description}`)
    }
    
    const properties = data.Results.map(transformAPIResponseToListing)
    
    return {
      properties,
      totalRecords: data.Paging.TotalRecords
    }
  } catch (error) {
    console.error('Error fetching property listings:', error)
    throw error
  }
}

export function filterProperties(
  properties: PropertyListing[],
  filters: {
    searchTerm?: string
    type?: string
    location?: string
    priceRange?: string
  }
): PropertyListing[] {
  let filtered = properties
  
  // Filter by search term
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase()
    filtered = filtered.filter(property =>
      property.title.toLowerCase().includes(term) ||
      property.location.toLowerCase().includes(term) ||
      property.city.toLowerCase().includes(term) ||
      property.description.toLowerCase().includes(term) ||
      property.features.some(feature => feature.toLowerCase().includes(term))
    )
  }
  
  // Filter by type
  if (filters.type && filters.type !== 'All Types') {
    filtered = filtered.filter(property => property.type === filters.type)
  }
  
  // Filter by location
  if (filters.location && filters.location !== 'All Locations') {
    filtered = filtered.filter(property => 
      property.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
      property.location.toLowerCase().includes(filters.location!.toLowerCase())
    )
  }
  
  // Filter by price range
  if (filters.priceRange && filters.priceRange !== 'All Prices') {
    filtered = filtered.filter(property => {
      if (!property.priceValue) return true // Include "Contact for Price" properties
      
      const price = property.priceValue
      switch (filters.priceRange) {
        case 'Under $500K': return price < 500000
        case '$500K - $750K': return price >= 500000 && price <= 750000
        case '$750K - $1M': return price > 750000 && price <= 1000000
        case 'Over $1M': return price > 1000000
        default: return true
      }
    })
  }
  
  return filtered
}

export async function fetchPropertyDetails(propertyId: string, referenceNumber: string): Promise<PropertyDetails> {
  try {
    const url = new URL(`${API_CONFIG.baseUrl}/properties/detail`)
    url.searchParams.append('PropertyID', propertyId)
    url.searchParams.append('ReferenceNumber', referenceNumber)
    url.searchParams.append('PreferedMeasurementUnit', '1')
    url.searchParams.append('CultureId', '1')
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...API_CONFIG.headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'default'
    })
    
    if (!response.ok) {
      throw new Error(`Property details API request failed: ${response.status} ${response.statusText}`)
    }
    
    const data: any = await response.json()
    
    // Transform API response to PropertyDetails interface
    return transformPropertyDetailsResponse(data)
  } catch (error) {
    console.error('Error fetching property details:', error)
    throw error
  }
}

function transformPropertyDetailsResponse(apiData: any): PropertyDetails {
  const property = apiData.Property || {}
  const building = property.Building || {}
  const address = property.Address || {}
  const land = property.Land || {}
  const photos = property.Photo || []
  
  // Transform images
  const images = photos.map((photo: any) => ({
    url: photo.HighResPath || photo.MedResPath || photo.LowResPath || '',
    description: photo.Description || ''
  })).filter((img: any) => img.url)
  
  // Transform agents
  const agents: PropertyAgent[] = (apiData.Individual || []).map((individual: any) => ({
    name: individual.Name || 'Rideau Realty Team',
    phone: individual.Phones?.[0] 
      ? `(${individual.Phones[0].AreaCode}) ${individual.Phones[0].PhoneNumber}`
      : '(613) 272-5000',
    email: individual.Emails?.[0]?.ContactId ? `agent@rideaurealty.ca` : undefined,
    position: (individual as any).Position
  }))
  
  // Transform rooms
  const rooms = (building.Rooms || []).map((room: any) => ({
    type: room.Type || 'Room',
    level: room.Level,
    dimensions: room.Dimension,
    description: room.Description
  }))
  
  // Transform features with enhanced detail extraction
  const features: string[] = []
  
  // Building amenities and features
  if ((building as any).Amenities) features.push(...(building as any).Amenities.split(',').map((f: string) => f.trim()))
  if ((building as any).Appliances) features.push(...(building as any).Appliances.split(',').map((f: string) => f.trim()))
  if ((building as any).KitchenFeatures) features.push(...(building as any).KitchenFeatures.split(',').map((f: string) => f.trim()))
  if ((building as any).InteriorFeatures) features.push(...(building as any).InteriorFeatures.split(',').map((f: string) => f.trim()))
  if ((building as any).ArchitecturalStyle) features.push(`Architecture: ${(building as any).ArchitecturalStyle}`)
  if ((building as any).FlooringType) features.push(`Flooring: ${(building as any).FlooringType}`)
  if ((building as any).WindowFeatures) features.push(`Windows: ${(building as any).WindowFeatures}`)
  
  // Property features
  if ((property as any).AccessibilityFeatures) features.push(...(property as any).AccessibilityFeatures.split(',').map((f: string) => f.trim()))
  if ((property as any).PoolFeatures) features.push(`Pool: ${(property as any).PoolFeatures}`)
  if ((property as any).FireplaceFeatures) features.push(`Fireplace: ${(property as any).FireplaceFeatures}`)
  if ((property as any).SecurityFeatures) features.push(...(property as any).SecurityFeatures.split(',').map((f: string) => f.trim()))
  
  // Land amenities
  if ((land as any).Amenities) features.push(...(land as any).Amenities.split(',').map((f: string) => f.trim()))
  if ((land as any).LandscapeFeatures) features.push(...(land as any).LandscapeFeatures.split(',').map((f: string) => f.trim()))
  
  // Calculate price per square foot
  const priceValue = property.Price ? parseInt(property.Price.replace(/[^\d]/g, '')) : undefined
  const sqftValue = building.SizeInterior ? parseInt(building.SizeInterior.replace(/[^\d]/g, '')) : undefined
  const pricePerSqft = priceValue && sqftValue ? `$${Math.round(priceValue / sqftValue)}/sqft` : undefined
  
  return {
    id: apiData.Id || '',
    mlsNumber: apiData.MlsNumber || '',
    title: `${building.Type || 'Property'} in ${address.City || 'Rideau Lakes'}`,
    price: property.Price || 'Contact for Price',
    priceValue,
    description: apiData.PublicRemarks || 'Beautiful property in the Rideau Lakes region.',
    address: {
      street: `${address.StreetNumber || ''} ${address.StreetName || ''}`.trim(),
      city: address.City || '',
      province: address.Province || 'Ontario',
      postalCode: address.PostalCode || '',
      latitude: address.Latitude ? parseFloat(address.Latitude) : undefined,
      longitude: address.Longitude ? parseFloat(address.Longitude) : undefined
    },
    property: {
      type: building.Type || 'Residential',
      subType: building.Style,
      bedrooms: building.Bedrooms ? parseInt(building.Bedrooms.replace(/[^\d]/g, '')) : undefined,
      bathrooms: building.BathroomTotal ? parseInt(building.BathroomTotal) : undefined,
      halfBaths: building.BathroomHalf ? parseInt(building.BathroomHalf) : undefined,
      sqft: building.SizeInterior,
      lotSize: land.SizeTotal,
      yearBuilt: building.YearBuilt ? parseInt(building.YearBuilt) : undefined,
      stories: building.StoriesTotal ? parseInt(building.StoriesTotal) : undefined,
      parking: property.ParkingSpaceTotal ? `${property.ParkingSpaceTotal} spaces` : undefined,
      basement: building.BasementType,
      heating: building.HeatingType,
      cooling: building.CoolingType,
      exterior: building.ExteriorFinish,
      roof: building.RoofMaterial
    },
    features: features.filter(Boolean),
    images,
    agents,
    financials: {
      listPrice: property.Price || 'Contact for Price',
      taxes: property.TaxAnnualAmount,
      fees: property.MaintenanceFeeAmount,
      pricePerSqft
    },
    dates: {
      listed: property.ListingContractDate,
      updated: apiData.LastUpdated,
      timeOnMarket: apiData.TimeOnRealtor
    },
    rooms,
    utilities: {
      water: property.WaterType,
      sewer: property.SewerType,
      electricity: property.Hydro,
      gas: property.Gas,
      internet: property.Internet
    },
    additional: {
      zoning: land.Zoning,
      possession: property.PossessionDate,
      restrictions: property.Restrictions,
      inclusions: property.Inclusions,
      exclusions: property.Exclusions
    }
  }
}