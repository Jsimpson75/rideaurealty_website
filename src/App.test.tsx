import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(document.body).toBeTruthy()
  })

  it('renders home content at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Rideau Realty/i, level: 1 })).toBeInTheDocument()
  })

  it('renders listings route at /listings', () => {
    render(
      <MemoryRouter initialEntries={['/listings']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText(/Property Listings/i)).toBeInTheDocument()
  })
})
