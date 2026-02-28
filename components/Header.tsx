import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Listings', href: '/listings' },
    { name: 'Buying', href: '/#buying' },
    { name: 'Selling', href: '/#selling' },
    { name: 'Team', href: '/#team' },
    { name: 'Links', href: '/#links' },
    { name: 'Contact', href: '/#contact' },
  ]

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false)

    if (href.startsWith('/#')) {
      const sectionId = href.substring(2)
      if (location.pathname === '/') {
        const el = document.getElementById(sectionId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
          return
        }
      }
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      navigate(href)
      window.scrollTo(0, 0)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/" className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity duration-200">
              <img
                src="/images/rideau-realty-logo.png"
                alt="Rideau Realty Limited Brokerage"
                className="h-14 sm:h-20 w-auto mr-2"
              />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-brand-800 leading-tight">
                  Rideau Realty
                </h1>
                <p className="text-xs text-brand-600 leading-tight hidden sm:block">
                  Serving the Region for Over 50 Years
                </p>
              </div>
            </Link>
          </motion.div>

          <nav className="hidden lg:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-700 hover:text-brand-600 px-3 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap"
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-brand-600 focus:outline-none focus:text-brand-600 p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-1 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="text-gray-700 hover:text-brand-600 hover:bg-brand-50 block px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200 w-full text-left"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}
