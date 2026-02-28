import Header from '@/components/Header'
import Hero from '@/components/Hero'
import FeaturedProperty from '@/components/FeaturedProperty'
import BuyingSelling from '@/components/BuyingSelling'
import About from '@/components/About'
import Team from '@/components/Team'
import Links from '@/components/Links'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen no-swipe">
      <Header />
      <Hero />
      <FeaturedProperty />
      <BuyingSelling />
      <About />
      <Team />
      <Links />
      <Contact />
      <Footer />
    </main>
  )
}
