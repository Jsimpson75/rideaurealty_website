import { describe, it, expect } from 'vitest'
import { filterProperties, type PropertyListing } from './api'

const baseListing: PropertyListing = {
  id: '1',
  mlsNumber: 'MLS001',
  title: 'Waterfront Cottage',
  price: '$750,000',
  priceValue: 750000,
  location: 'Portland, ON',
  city: 'Portland',
  province: 'Ontario',
  bedrooms: 3,
  bathrooms: 2,
  sqft: '1,500 sqft',
  type: 'Waterfront',
  description: 'Beautiful lakefront property with dock.',
  features: ['Dock', 'Beach'],
  image: 'https://example.com/1.jpg',
  agentName: 'Jane Agent',
  agentPhone: '613-000-0000',
  agents: [{ name: 'Jane Agent', phone: '613-000-0000' }],
  propertyType: 'House',
}

const listings: PropertyListing[] = [
  { ...baseListing, id: '1' },
  {
    ...baseListing,
    id: '2',
    title: 'Farm in Westport',
    city: 'Westport',
    location: 'Westport, ON',
    type: 'Farm',
    priceValue: 450000,
    price: '$450,000',
    description: 'Working farm with barn.',
    features: ['Barn', 'Land'],
  },
  {
    ...baseListing,
    id: '3',
    title: 'Downtown Condo',
    city: 'Ottawa',
    location: 'Ottawa, ON',
    type: 'Condo',
    priceValue: 350000,
    price: '$350,000',
    description: 'Urban condo near transit.',
    features: ['Parking', 'Balcony'],
  },
  {
    ...baseListing,
    id: '4',
    title: 'Contact for Price Home',
    price: 'Contact for Price',
    priceValue: undefined,
    city: 'Elgin',
    location: 'Elgin, ON',
    type: 'Residential',
    description: 'Price on request.',
    features: ['Garage'],
  },
]

describe('filterProperties', () => {
  it('returns all properties when no filters', () => {
    expect(filterProperties(listings, {})).toHaveLength(4)
  })

  it('filters by searchTerm (title)', () => {
    const result = filterProperties(listings, { searchTerm: 'Cottage' })
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Waterfront Cottage')
  })

  it('filters by searchTerm (city)', () => {
    const result = filterProperties(listings, { searchTerm: 'Westport' })
    expect(result).toHaveLength(1)
    expect(result[0].city).toBe('Westport')
  })

  it('filters by searchTerm (description)', () => {
    const result = filterProperties(listings, { searchTerm: 'lakefront' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })

  it('filters by searchTerm (features)', () => {
    const result = filterProperties(listings, { searchTerm: 'Dock' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })

  it('filters by type', () => {
    const result = filterProperties(listings, { type: 'Farm' })
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('Farm')
  })

  it('returns all when type is All Types', () => {
    const result = filterProperties(listings, { type: 'All Types' })
    expect(result).toHaveLength(4)
  })

  it('filters by location', () => {
    const result = filterProperties(listings, { location: 'Portland' })
    expect(result).toHaveLength(1)
    expect(result[0].city).toBe('Portland')
  })

  it('returns all when location is All Locations', () => {
    const result = filterProperties(listings, { location: 'All Locations' })
    expect(result).toHaveLength(4)
  })

  it('filters by price range Under $500K', () => {
    const result = filterProperties(listings, { priceRange: 'Under $500K' })
    expect(result).toHaveLength(3) // Farm 450k, Condo 350k, Contact for Price
  })

  it('filters by price range $500K - $750K', () => {
    const result = filterProperties(listings, { priceRange: '$500K - $750K' })
    expect(result).toHaveLength(2) // Waterfront 750k, Contact for Price
  })

  it('filters by price range Over $1M', () => {
    const result = filterProperties(listings, { priceRange: 'Over $1M' })
    expect(result).toHaveLength(1) // Contact for Price only
  })

  it('includes Contact for Price properties in any price range', () => {
    const result = filterProperties(listings, { priceRange: 'Under $500K' })
    const contactForPrice = result.find(p => p.price === 'Contact for Price')
    expect(contactForPrice).toBeDefined()
  })

  it('returns empty array when no match', () => {
    const result = filterProperties(listings, { searchTerm: 'xyznotfound' })
    expect(result).toHaveLength(0)
  })

  it('combines multiple filters', () => {
    const result = filterProperties(listings, {
      type: 'Waterfront',
      priceRange: '$500K - $750K',
    })
    expect(result).toHaveLength(1) // only id 1 (750k); id 4 is Residential
    expect(result[0].id).toBe('1')
  })
})
