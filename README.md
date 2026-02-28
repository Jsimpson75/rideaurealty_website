# Rideau Realty Website

A modern, professional real estate website built with Next.js, React, and Tailwind CSS for Rideau Realty.

## Features

- **Modern Design**: Clean, professional design optimized for real estate
- **Responsive Layout**: Fully responsive design that works on all devices
- **Interactive Components**: Smooth animations and transitions using Framer Motion
- **SEO Optimized**: Built with Next.js for excellent search engine optimization
- **Fast Performance**: Optimized for speed and user experience
- **Contact Forms**: Interactive contact forms for lead generation
- **Property Showcase**: Featured properties section with detailed information
- **Service Pages**: Comprehensive service offerings display
- **Testimonials**: Client testimonials and reviews section

## Tech Stack

- **Next.js 14**: React framework for production
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth interactions
- **Lucide React**: Beautiful, customizable icons
- **PostCSS**: CSS processing
- **ESLint**: Code linting and formatting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd RideauRealty
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
RideauRealty/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/             # React components
│   ├── Header.tsx         # Navigation header
│   ├── Hero.tsx           # Hero section
│   ├── FeaturedProperties.tsx # Property showcase
│   ├── Services.tsx       # Services section
│   ├── About.tsx          # About section
│   ├── Contact.tsx        # Contact form
│   └── Footer.tsx         # Footer
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
└── README.md             # Project documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Colors
The color scheme can be customized in `tailwind.config.js` under the `colors` section.

### Content
Update the content in each component file to match your business information.

### Images
Replace placeholder images with your own property photos and branding.

### Google Maps Integration
To get the correct Google Maps embed for your office location:

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for "2790 Highway 15, Portland, ON K0G 1V0, Canada"
3. Click the "Share" button
4. Select "Embed a map"
5. Choose your preferred size (Medium recommended)
6. Copy the iframe src URL
7. Replace the src URL in `components/Contact.tsx` line 185

The current implementation includes:
- Interactive Google Maps embed
- "Open in Google Maps" and "Get Directions" links
- Responsive design with proper styling
- Accessibility features

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The site can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

## SEO Features

- Meta tags for social sharing
- Open Graph tags
- Twitter Card support
- Structured data markup
- Optimized images
- Fast loading times

## Performance

- Optimized images with Next.js Image component
- Code splitting and lazy loading
- Minimal bundle size
- Fast page loads

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact:
- Email: info@rideaurealty.ca
- Phone: (613) 272-5000

---

Built with ❤️ for Rideau Realty 