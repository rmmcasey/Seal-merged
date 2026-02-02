# Seal Website

Enterprise-grade file encryption landing page built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 What's Built

### ✅ Completed Components
- **Hero Section** - With animated seal stamp and CTAs
- **SealAnimation** - Beautiful stamp-down animation with seal mascot
- **Navbar** - Sticky navigation with mobile menu
- **Problem Section** - Pain points highlighted
- **How It Works** - 3-step process visualization
- **Features Grid** - 6 key features with icons

### 🚧 To Build Next
- Security Deep Dive section
- Pricing section
- FAQ (accordion)
- Final CTA
- Footer
- Placeholder pages (login, register, about, etc.)

## 📦 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Database:** Supabase (not yet connected)
- **Auth:** Supabase Auth (not yet connected)
- **Hosting:** Vercel

## 🛠 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Supabase account (for later phases)

### Installation

1. **Navigate to project directory:**
```bash
cd seal-website
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials (optional for now)
```

4. **Run development server:**
```bash
npm run dev
```

5. **Open browser:**
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
seal-website/
├── app/
│   ├── page.tsx              # Main landing page
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles
├── components/
│   ├── landing/
│   │   ├── Hero.tsx          # Hero section ✅
│   │   ├── SealAnimation.tsx # Animated stamp ✅
│   │   ├── ProblemSection.tsx # Problem statement ✅
│   │   ├── HowItWorks.tsx    # 3-step process ✅
│   │   └── Features.tsx      # Features grid ✅
│   └── layout/
│       └── Navbar.tsx        # Navigation bar ✅
├── lib/
│   └── utils.ts              # Utility functions
├── public/
│   └── images/               # Static assets (empty for now)
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind + theme config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

## 🎨 Design System

### Colors
- **Primary Blue:** `#3B82F6` (blue-500)
- **Light Blue:** `#60A5FA` (blue-400)
- **Dark Blue:** `#1E40AF` (blue-800)
- **Success:** `#10B981` (emerald-500)
- **Warning:** `#F59E0B` (amber-500)
- **Error:** `#EF4444` (red-500)

### Typography
- **Font:** Inter (Google Fonts)
- **Headings:** Bold, 32px-56px
- **Body:** Regular, 16px-18px

### Animations
- Seal stamp animation (1.2s duration)
- Fade-in on scroll (Intersection Observer)
- Hover effects on cards and buttons
- Smooth scroll between sections

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## 📝 Next Steps

### Phase 1: Complete Landing Page (Current)
1. Build Security section with technical details
2. Build Pricing section (Free vs Pro comparison)
3. Build FAQ with accordion
4. Build Final CTA section
5. Build Footer with links
6. Add real seal SVG logo
7. Polish animations and responsiveness

### Phase 2: Static Pages
1. /about page
2. /security (whitepaper)
3. /pricing (detailed)
4. /contact page
5. Legal pages (privacy, terms)

### Phase 3: Authentication
1. Connect Supabase
2. /login page with form
3. /register page with key generation
4. Password strength requirements
5. Email verification flow

### Phase 4: Protected App
1. /dashboard (main hub)
2. /inbox (received files)
3. /viewer/:fileId (file viewer)
4. /settings (account management)

## 🎯 Brand Guidelines

### Voice & Tone
- **Target:** IT professionals managing security
- **Tone:** Confident, honest, clear (no jargon unless necessary)
- **Style:** Professional but approachable

### Key Messages
1. "Send files securely, without the complexity"
2. "Enterprise-grade encryption your team can use"
3. "No training, no software, no headaches"
4. "Zero-knowledge architecture" (we can't read your files)

### Seal Mascot
- Friendly harbor seal outline
- Used in stamp animation
- Can be expanded to full mascot illustrations
- Represents security + approachability

## 🐛 Known Issues

- [ ] Need to add actual company logos (currently placeholders)
- [ ] Need real seal SVG logo file
- [ ] Mobile menu doesn't close on link click (needs update)
- [ ] Some Tailwind dynamic classes need safelist for badges
- [ ] Missing OG images for social sharing

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository:**
   - Push code to GitHub
   - Import to Vercel
   - Auto-deploys on push to main

2. **Configure domain:**
   - Add `seal.email` in Vercel dashboard
   - Update DNS records
   - SSL auto-configured

3. **Environment variables:**
   - Add in Vercel dashboard
   - Include all variables from .env.local

### Build Command
```bash
npm run build
```

### Environment Variables (Production)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://seal.email
```

## 📊 Performance Targets

- **Lighthouse Score:** 90+ (all metrics)
- **LCP:** < 2.5s
- **FID:** < 100ms
- **CLS:** < 0.1
- **Page Weight:** < 1MB fully loaded

## 🤝 Contributing

Currently private development. Will open source encryption library later.

## 📄 License

Proprietary - All rights reserved.

---

**Built with ❤️ for IT teams who want security without complexity**
