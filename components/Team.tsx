import { motion } from 'framer-motion'
import { Phone, Mail, User, Award } from 'lucide-react'

const teamMembers = [
  {
    name: "Scott Burns",
    role: "Broker of Record / Owner",
    cell: "613-498-4201",
    business: "613-272-5000",
    fax: "613-272-2546",
    email: "scottburnsrealty@gmail.com",
    photo: "/images/team/scott-burns.jpg",
    isOwner: true
  },
  {
    name: "Zach Shea",
    role: "Broker",
    cell: "613-331-2635",
    business: "613-272-5000",
    fax: "613-272-2546",
    email: "zachshearealty@gmail.com",
    photo: "/images/team/zach-shea.jpg",
    isOwner: false
  },
  {
    name: "Steve Wells",
    role: "Sales Representative",
    cell: "613-284-7640",
    business: "613-272-5000",
    fax: "613-272-2546",
    email: "steve@rideaurealty.ca",
    photo: "/images/team/steve-wells.jpg",
    isOwner: false
  },
  {
    name: "Joe Kozak",
    role: "Sales Representative",
    cell: "613-802-2054",
    business: "613-272-5000",
    fax: "613-272-2546",
    email: "joekozakrealty@gmail.com",
    photo: "/images/team/joe-kozak.jpg",
    isOwner: false
  },
  {
    name: "Neve Wells",
    role: "Sales Representative",
    cell: "613-390-2381",
    business: "613-272-5000",
    fax: "613-272-2546",
    email: "nevewellsrealty@gmail.com",
    photo: "/images/team/neve-wells.jpg",
    isOwner: false
  }
]

export default function Team() {
  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Sales Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our experienced team of real estate professionals. With years of local expertise 
            and a commitment to exceptional service, we're here to help you with all your real estate needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Profile Header */}
              <div className={`${member.isOwner ? 'bg-brand-600' : 'bg-gray-700'} p-6 text-white text-center`}>
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <img
                    src={member.photo}
                    alt={`${member.name} - ${member.role}`}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
                    onError={(e) => {
                      // Fallback to user icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center absolute top-0 left-0" style={{ display: 'none' }}>
                    <User className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <div className="flex items-center justify-center space-x-2">
                  {member.isOwner && <Award className="h-4 w-4" />}
                  <span className="text-sm font-medium">{member.role}</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-brand-100 p-2 rounded-lg">
                    <Phone className="h-4 w-4 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Cell</div>
                    <a 
                      href={`tel:${member.cell.replace(/\D/g, '')}`}
                      className="text-brand-600 hover:text-brand-700 font-medium transition-colors duration-200"
                    >
                      {member.cell}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Phone className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Business</div>
                    <a 
                      href={`tel:${member.business.replace(/\D/g, '')}`}
                      className="text-gray-700 hover:text-brand-600 font-medium transition-colors duration-200"
                    >
                      {member.business}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-brand-100 p-2 rounded-lg">
                    <Mail className="h-4 w-4 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <a 
                      href={`mailto:${member.email}`}
                      className="text-brand-600 hover:text-brand-700 font-medium transition-colors duration-200 break-all"
                    >
                      {member.email}
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Fax: {member.fax}
                  </div>
                </div>

                {/* Contact Button */}
                <div className="pt-4">
                  <a
                    href={`mailto:${member.email}`}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-semibold text-center transition-colors duration-200 block"
                  >
                    Contact {member.name.split(' ')[0]}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Team Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-lg p-8 text-center shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Work with Our Team?
          </h3>
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
            Our experienced sales team is ready to help you buy, sell, or invest in the Rideau region. 
            Contact any of our team members directly or reach out to our main office.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:613-272-5000"
              className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>Call Our Office</span>
            </a>
            <a
              href="#contact"
              className="border border-brand-600 text-brand-600 hover:bg-brand-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Contact Form
            </a>
          </div>
        </motion.div>

        {/* Instagram Feed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Follow Us on Social Media
            </h3>
            <p className="text-lg text-gray-600">
              Stay connected with our latest listings and community updates
            </p>
          </div>
          
          <div 
            data-key="Carousel Instagram Feed " 
            className="ft" 
            id="ftv7f5wub"
          />
          
          <script 
            src="https://wdg.fouita.com/widgets/0x2b7549.js"
            async
          />
        </motion.div>
      </div>
    </section>
  )
}