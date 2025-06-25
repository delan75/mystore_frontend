# UI/UX Design Guidelines: Green Farm Products Theme

**Version**: 1.0  
**Last Updated**: 2025-01-20  
**Status**: Planning Phase

## Design Philosophy

### Core Principles
1. **Natural & Organic**: Reflect the freshness and authenticity of farm products
2. **Clean & Modern**: Professional appearance that builds trust
3. **Accessible**: Inclusive design for all users
4. **Mobile-First**: Optimized for mobile experience
5. **Performance-Focused**: Fast, smooth interactions

### Brand Personality
- **Fresh**: Vibrant, clean, energetic
- **Trustworthy**: Reliable, professional, transparent
- **Sustainable**: Eco-friendly, responsible, caring
- **Local**: Community-focused, personal, authentic

## Color Palette

### Primary Colors
```css
/* Fresh Green - Primary brand color */
--primary-green: #2D5A27;        /* Dark forest green */
--primary-green-light: #4A7C59;  /* Medium green */
--primary-green-lighter: #7FB069; /* Light green */

/* Accent Green - Call-to-action */
--accent-green: #1ab188;         /* Existing brand green */
--accent-green-hover: #179b77;   /* Existing hover state */

/* Earth Tones - Supporting colors */
--earth-brown: #8B4513;          /* Rich soil brown */
--earth-tan: #D2B48C;            /* Light tan */
--earth-cream: #F5F5DC;          /* Cream/beige */
```

### Secondary Colors
```css
/* Fresh Produce Colors */
--tomato-red: #FF6347;           /* Fresh tomato */
--carrot-orange: #FF8C00;        /* Vibrant carrot */
--corn-yellow: #FFD700;          /* Golden corn */
--lettuce-green: #90EE90;        /* Light lettuce */

/* Neutral Colors */
--white: #FFFFFF;
--light-gray: #F8F9FA;
--medium-gray: #6C757D;
--dark-gray: #343A40;
--black: #000000;
```

### Background Colors
```css
/* Existing from AuthPage */
--background-primary: #c1bdba;   /* Existing body background */
--background-dark: #13232f;      /* Existing dark sections */
--background-overlay: rgba(19, 35, 47, 0.9); /* Existing form overlay */
```

### Usage Guidelines
- **Primary Green**: Headers, navigation, primary buttons
- **Accent Green**: CTAs, links, interactive elements (maintain existing)
- **Earth Tones**: Backgrounds, cards, subtle accents
- **Produce Colors**: Category highlights, badges, seasonal elements
- **Neutrals**: Text, borders, backgrounds

## Typography

### Font Stack
```css
/* Primary Font - Existing */
font-family: 'Titillium Web', sans-serif;

/* Additional Fonts for Landing Page */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap');
```

### Font Hierarchy
```css
/* Headlines - Playfair Display for elegance */
.heading-xl {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;      /* 56px */
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.heading-lg {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;      /* 40px */
  font-weight: 600;
  line-height: 1.2;
}

.heading-md {
  font-family: 'Titillium Web', sans-serif;
  font-size: 2rem;        /* 32px */
  font-weight: 600;
  line-height: 1.3;
}

.heading-sm {
  font-family: 'Titillium Web', sans-serif;
  font-size: 1.5rem;      /* 24px */
  font-weight: 600;
  line-height: 1.4;
}

/* Body Text - Source Sans Pro for readability */
.body-lg {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1.125rem;    /* 18px */
  font-weight: 400;
  line-height: 1.6;
}

.body-md {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1rem;        /* 16px */
  font-weight: 400;
  line-height: 1.5;
}

.body-sm {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 0.875rem;    /* 14px */
  font-weight: 400;
  line-height: 1.4;
}

/* UI Elements - Titillium Web (existing) */
.ui-text {
  font-family: 'Titillium Web', sans-serif;
  font-size: 0.875rem;    /* 14px */
  font-weight: 400;
  line-height: 1.4;
}

.ui-text-bold {
  font-family: 'Titillium Web', sans-serif;
  font-size: 0.875rem;    /* 14px */
  font-weight: 600;
  line-height: 1.4;
}
```

### Mobile Typography
```css
/* Responsive font sizes */
@media (max-width: 768px) {
  .heading-xl { font-size: 2.5rem; }  /* 40px */
  .heading-lg { font-size: 2rem; }    /* 32px */
  .heading-md { font-size: 1.5rem; }  /* 24px */
  .heading-sm { font-size: 1.25rem; } /* 20px */
  .body-lg { font-size: 1rem; }       /* 16px */
}
```

## Spacing System

### Base Unit: 8px
```css
/* Spacing scale based on 8px grid */
--space-xs: 0.25rem;    /* 4px */
--space-sm: 0.5rem;     /* 8px */
--space-md: 1rem;       /* 16px */
--space-lg: 1.5rem;     /* 24px */
--space-xl: 2rem;       /* 32px */
--space-2xl: 3rem;      /* 48px */
--space-3xl: 4rem;      /* 64px */
--space-4xl: 6rem;      /* 96px */
```

### Component Spacing
- **Sections**: 4xl (96px) desktop, 2xl (48px) mobile
- **Cards**: xl (32px) padding, lg (24px) gap
- **Buttons**: md (16px) padding vertical, lg (24px) horizontal
- **Form Elements**: md (16px) margin bottom
- **Text Elements**: sm (8px) to md (16px) margins

## Component Design System

### Buttons
```css
/* Primary Button - Green theme */
.btn-primary {
  background-color: var(--accent-green);
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  font-family: 'Titillium Web', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--accent-green-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 177, 136, 0.3);
}

/* Secondary Button - Earth tone */
.btn-secondary {
  background-color: var(--earth-brown);
  color: white;
  /* ... similar styling */
}

/* Outline Button */
.btn-outline {
  background-color: transparent;
  color: var(--primary-green);
  border: 2px solid var(--primary-green);
  /* ... similar styling */
}
```

### Cards
```css
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: var(--space-xl);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-product {
  /* Product-specific card styling */
  border: 1px solid var(--light-gray);
  overflow: hidden;
}

.card-category {
  /* Category-specific card styling */
  position: relative;
  min-height: 200px;
}
```

### Navigation
```css
.nav-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: var(--space-md) 0;
}

.nav-link {
  color: var(--primary-green);
  font-family: 'Titillium Web', sans-serif;
  font-weight: 600;
  text-decoration: none;
  padding: var(--space-sm) var(--space-md);
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--accent-green);
}
```

## Layout Guidelines

### Grid System
- **Container**: Max-width 1200px, centered
- **Columns**: 12-column grid system
- **Gutters**: 24px desktop, 16px mobile
- **Breakpoints**: 
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+

### Section Structure
```html
<!-- Standard section layout -->
<section class="section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Section Title</h2>
      <p class="section-subtitle">Section description</p>
    </div>
    <div class="section-content">
      <!-- Section content -->
    </div>
  </div>
</section>
```

## Imagery Guidelines

### Photography Style
- **Natural lighting**: Bright, fresh, outdoor settings
- **High quality**: Minimum 1920x1080 for hero images
- **Authentic**: Real products, real farms, real people
- **Consistent**: Similar lighting and color treatment

### Image Specifications
- **Hero Images**: 1920x1080 (16:9 ratio)
- **Product Images**: 800x800 (1:1 ratio)
- **Category Images**: 600x400 (3:2 ratio)
- **Thumbnails**: 300x300 (1:1 ratio)
- **Format**: WebP with JPEG fallback
- **Optimization**: < 100KB for thumbnails, < 500KB for large images

### Icon System
- **Style**: Outline icons with 2px stroke
- **Size**: 24px standard, 32px large, 16px small
- **Color**: Primary green or medium gray
- **Source**: Font Awesome + custom farm icons

## Animation & Interactions

### Micro-Interactions
```css
/* Smooth transitions */
.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects */
.hover-lift:hover {
  transform: translateY(-4px);
}

.hover-scale:hover {
  transform: scale(1.05);
}

/* Loading animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}
```

### Scroll Animations
- **Fade in**: Elements appear as they enter viewport
- **Slide up**: Cards and sections slide up on scroll
- **Parallax**: Subtle background movement (hero section)
- **Progress**: Scroll progress indicator

## Accessibility Guidelines

### Color Contrast
- **Text on white**: Minimum 4.5:1 ratio
- **Large text**: Minimum 3:1 ratio
- **Interactive elements**: Clear focus states

### Focus Management
- **Visible focus**: 2px solid accent green outline
- **Logical order**: Tab navigation follows visual flow
- **Skip links**: Allow keyboard users to skip navigation

### Screen Reader Support
- **Alt text**: Descriptive image alternatives
- **ARIA labels**: Clear element descriptions
- **Semantic HTML**: Proper heading hierarchy

## Mobile-First Considerations

### Touch Targets
- **Minimum size**: 44px x 44px
- **Spacing**: 8px minimum between targets
- **Feedback**: Visual/haptic feedback on touch

### Mobile Navigation
- **Hamburger menu**: Collapsible navigation
- **Thumb-friendly**: Important actions within thumb reach
- **Swipe gestures**: Product carousels, image galleries

### Performance
- **Image optimization**: Responsive images with srcset
- **Lazy loading**: Images load as needed
- **Critical CSS**: Above-the-fold styles inline
- **Font loading**: Optimized web font delivery

## Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: #2D5A27;
  --color-accent: #1ab188;
  --color-background: #FFFFFF;
  --color-text: #343A40;
  
  /* Typography */
  --font-primary: 'Titillium Web', sans-serif;
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Source Sans Pro', sans-serif;
  
  /* Spacing */
  --space-unit: 8px;
  --space-xs: calc(var(--space-unit) * 0.5);
  --space-sm: var(--space-unit);
  --space-md: calc(var(--space-unit) * 2);
  --space-lg: calc(var(--space-unit) * 3);
  --space-xl: calc(var(--space-unit) * 4);
  
  /* Borders */
  --border-radius: 6px;
  --border-radius-lg: 12px;
  --border-width: 1px;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 25px rgba(0, 0, 0, 0.15);
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```
