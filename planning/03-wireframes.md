# Wireframes & Layout Planning

**Version**: 1.0  
**Last Updated**: 2025-01-20  
**Status**: Planning Phase

## Page Structure Overview

### Landing Page Sections (Top to Bottom)
1. **Header/Navigation** - Sticky navigation with logo, menu, search, account
2. **Hero Section** - Main value proposition with CTA
3. **Featured Categories** - Visual category showcase
4. **Featured Products** - Product highlights with quick actions
5. **Value Propositions** - Farm-to-table messaging
6. **Social Proof** - Testimonials and trust indicators
7. **Newsletter Signup** - Email capture with incentive
8. **Footer** - Links, contact info, social media

## Mobile Wireframes (320px - 767px)

### Header (Mobile)
```
┌─────────────────────────────────────┐
│ ☰  [LOGO: MyStore]           🔍 👤  │
└─────────────────────────────────────┘
```

**Components:**
- Hamburger menu (left)
- Logo/brand name (center-left)
- Search icon (right)
- User account icon (far right)
- Height: 60px
- Background: White with subtle shadow

### Hero Section (Mobile)
```
┌─────────────────────────────────────┐
│                                     │
│        [HERO IMAGE]                 │
│     Fresh Farm Products             │
│                                     │
│    "Farm Fresh to Your Door"        │
│                                     │
│  Organic, Local, Sustainable       │
│                                     │
│    [Shop Now Button]                │
│                                     │
│  ✓ Free Delivery  ✓ Fresh Daily    │
│                                     │
└─────────────────────────────────────┘
```

**Specifications:**
- Height: 100vh (full viewport)
- Background: Hero image with overlay
- Text: Center-aligned, white text
- CTA: Primary green button
- Trust indicators: Small icons with text

### Featured Categories (Mobile)
```
┌─────────────────────────────────────┐
│         Shop by Category            │
│                                     │
│  ┌─────────┐  ┌─────────┐          │
│  │ [IMG]   │  │ [IMG]   │          │
│  │Vegetables│  │ Fruits  │          │
│  └─────────┘  └─────────┘          │
│                                     │
│  ┌─────────┐  ┌─────────┐          │
│  │ [IMG]   │  │ [IMG]   │          │
│  │ Herbs   │  │ Dairy   │          │
│  └─────────┘  └─────────┘          │
│                                     │
│        [View All Categories]        │
└─────────────────────────────────────┘
```

**Specifications:**
- 2x2 grid layout
- Card size: 150px x 150px
- Gap: 16px between cards
- Hover: Slight scale and shadow
- Link: Each card navigates to category page

### Featured Products (Mobile)
```
┌─────────────────────────────────────┐
│        Featured Products            │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │ [Product Image]                 │ │
│  │ Organic Tomatoes                │ │
│  │ ⭐⭐⭐⭐⭐ (4.8) 127 reviews    │ │
│  │ R 45.99  [Add to Cart]          │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │ [Product Image]                 │ │
│  │ Fresh Spinach                   │ │
│  │ ⭐⭐⭐⭐⭐ (4.9) 89 reviews     │ │
│  │ R 32.50  [Add to Cart]          │ │
│  └─────────────────────────────────┘ │
│                                     │
│        [View All Products]          │
└─────────────────────────────────────┘
```

**Specifications:**
- Single column layout
- Product cards: Full width with padding
- Image: 16:9 aspect ratio
- Rating: Stars with count
- Price: Bold, green color
- CTA: Secondary button

### Value Propositions (Mobile)
```
┌─────────────────────────────────────┐
│        Why Choose Us?               │
│                                     │
│  🚚  Free Delivery                  │
│      Orders over R200               │
│                                     │
│  🌱  100% Organic                   │
│      Certified fresh produce       │
│                                     │
│  🏪  Local Farmers                  │
│      Supporting community          │
│                                     │
│  ♻️  Sustainable                    │
│      Eco-friendly packaging        │
│                                     │
└─────────────────────────────────────┘
```

**Specifications:**
- Single column layout
- Icon + headline + description
- Icons: 48px, green color
- Spacing: 32px between items

## Desktop Wireframes (1024px+)

### Header (Desktop)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [LOGO: MyStore]  Home  Categories  About  Contact    [Search Bar]  👤  🛒   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Components:**
- Logo (left)
- Horizontal navigation menu
- Search bar (center-right)
- User account and cart icons (right)
- Height: 80px

### Hero Section (Desktop)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─────────────────────┐                    ┌─────────────────────┐        │
│  │                     │                    │                     │        │
│  │   "Farm Fresh to    │                    │                     │        │
│  │    Your Door"       │                    │    [HERO IMAGE]     │        │
│  │                     │                    │                     │        │
│  │ Organic, Local,     │                    │                     │        │
│  │   Sustainable       │                    │                     │        │
│  │                     │                    │                     │        │
│  │ [Shop Now Button]   │                    │                     │        │
│  │                     │                    │                     │        │
│  │ ✓ Free Delivery     │                    │                     │        │
│  │ ✓ Fresh Daily       │                    │                     │        │
│  │ ✓ Local Farmers     │                    │                     │        │
│  └─────────────────────┘                    └─────────────────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Split layout: 50/50 text and image
- Height: 80vh
- Text: Left-aligned in left column
- Image: Right column with subtle parallax

### Featured Categories (Desktop)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Shop by Category                                  │
│                                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ [IMG]   │  │ [IMG]   │  │ [IMG]   │  │ [IMG]   │  │ [IMG]   │          │
│  │Vegetables│  │ Fruits  │  │ Herbs   │  │ Dairy   │  │ Meat    │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
│                                                                             │
│                        [View All Categories]                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- 5-column grid layout
- Card size: 200px x 200px
- Responsive: Adjusts to 4, 3, 2 columns on smaller screens

### Featured Products (Desktop)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Featured Products                                  │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ [IMG]       │  │ [IMG]       │  │ [IMG]       │  │ [IMG]       │        │
│  │ Organic     │  │ Fresh       │  │ Baby        │  │ Local       │        │
│  │ Tomatoes    │  │ Spinach     │  │ Carrots     │  │ Honey       │        │
│  │ ⭐⭐⭐⭐⭐    │  │ ⭐⭐⭐⭐⭐    │  │ ⭐⭐⭐⭐⭐    │  │ ⭐⭐⭐⭐⭐    │        │
│  │ R 45.99     │  │ R 32.50     │  │ R 28.99     │  │ R 89.99     │        │
│  │ [Add Cart]  │  │ [Add Cart]  │  │ [Add Cart]  │  │ [Add Cart]  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
│                         [View All Products]                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- 4-column grid layout
- Card size: 280px width, auto height
- Responsive: Adjusts to 3, 2, 1 columns

## Component Specifications

### Navigation Menu (Mobile Hamburger)
```
┌─────────────────────────────────────┐
│ ✕                                   │
│                                     │
│ Home                                │
│ Categories                          │
│ About Us                            │
│ Contact                             │
│ ─────────────────                   │
│ Login / Register                    │
│ My Account                          │
│ Cart (3)                            │
│                                     │
└─────────────────────────────────────┘
```

**Behavior:**
- Slides in from left
- Overlay with backdrop
- Close on backdrop click or X button

### Search Functionality
```
Desktop:
┌─────────────────────────────────────┐
│ 🔍 Search products...               │
└─────────────────────────────────────┘

Mobile (Expanded):
┌─────────────────────────────────────┐
│ ← 🔍 Search products...             │
└─────────────────────────────────────┘
```

**Features:**
- Auto-complete suggestions
- Category filtering
- Recent searches
- Voice search (mobile)

### Product Card Details
```
┌─────────────────────────────────────┐
│ [Product Image with hover zoom]     │
│ ❤️                            🏷️   │
│                                     │
│ Product Name                        │
│ Short description...                │
│ ⭐⭐⭐⭐⭐ (4.8) 127 reviews        │
│                                     │
│ R 45.99  ~~R 52.99~~               │
│ 🚚 Free delivery                    │
│                                     │
│ [- 1 +]  [Add to Cart]             │
└─────────────────────────────────────┘
```

**Interactive Elements:**
- Image zoom on hover
- Wishlist toggle
- Quantity selector
- Add to cart with loading state

## Responsive Breakpoints

### Mobile First Approach
```css
/* Mobile: 320px - 767px */
.container {
  padding: 0 16px;
  max-width: 100%;
}

.grid-categories {
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.grid-products {
  grid-template-columns: 1fr;
  gap: 24px;
}

/* Tablet: 768px - 1023px */
@media (min-width: 768px) {
  .container {
    padding: 0 32px;
    max-width: 768px;
  }
  
  .grid-categories {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  
  .grid-products {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .container {
    padding: 0 48px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .grid-categories {
    grid-template-columns: repeat(5, 1fr);
    gap: 32px;
  }
  
  .grid-products {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
}
```

## Loading States & Animations

### Skeleton Loading
```
Product Card Skeleton:
┌─────────────────────────────────────┐
│ ████████████████████████████████    │ ← Image placeholder
│ ████████████████████████████████    │
│                                     │
│ ████████████████                    │ ← Title placeholder
│ ████████████                        │ ← Description placeholder
│ ████████                            │ ← Rating placeholder
│                                     │
│ ████████    ████████                │ ← Price and button
└─────────────────────────────────────┘
```

### Page Transitions
- **Fade in**: Sections appear as they enter viewport
- **Slide up**: Cards animate up with stagger
- **Loading**: Skeleton screens while data loads
- **Smooth scroll**: Navigation links scroll smoothly

## Accessibility Considerations

### Keyboard Navigation
- **Tab order**: Logical flow through interactive elements
- **Focus indicators**: Clear visual focus states
- **Skip links**: Jump to main content
- **Escape key**: Close modals and menus

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3)
- **ARIA labels**: Descriptive labels for interactive elements
- **Alt text**: Meaningful image descriptions
- **Live regions**: Announce dynamic content changes

### Color & Contrast
- **Text contrast**: Minimum 4.5:1 ratio
- **Focus contrast**: 3:1 ratio for focus indicators
- **Color independence**: Information not conveyed by color alone

## Performance Optimization

### Image Strategy
- **Lazy loading**: Images load as they enter viewport
- **Responsive images**: Multiple sizes with srcset
- **WebP format**: Modern format with JPEG fallback
- **Placeholder**: Low-quality image placeholder (LQIP)

### Critical Path
- **Above-the-fold**: Inline critical CSS
- **Font loading**: Optimize web font delivery
- **JavaScript**: Defer non-critical scripts
- **Preload**: Critical resources (hero image, fonts)

## Next Steps

1. **Create detailed mockups** based on these wireframes
2. **Validate with stakeholders** before development
3. **Plan component development** order and dependencies
4. **Set up development environment** with design tokens
5. **Begin with mobile-first implementation**
