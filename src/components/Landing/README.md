# Landing Page Components

This directory contains all components specific to the landing page.

## Component Structure

```
Landing/
├── README.md                    # This file
├── HeroSection.js              # Main hero section with CTA
├── FeaturedCategories.js       # Category showcase grid
├── FeaturedProducts.js         # Product highlights
├── ValuePropositions.js        # Why choose us section
├── SocialProof.js              # Testimonials and trust badges
├── NewsletterSignup.js         # Email capture form
└── styles/                     # Component-specific styles
    ├── HeroSection.css
    ├── FeaturedCategories.css
    ├── FeaturedProducts.css
    ├── ValuePropositions.css
    ├── SocialProof.css
    └── NewsletterSignup.css
```

## Component Guidelines

- Each component should be self-contained and reusable
- Use design tokens from `src/styles/design-tokens.css`
- Follow mobile-first responsive design principles
- Include proper accessibility attributes
- Handle loading and error states gracefully

## Naming Conventions

- Components: PascalCase (e.g., `FeaturedCategories`)
- CSS classes: kebab-case with BEM methodology
- Props: camelCase
- Files: PascalCase for components, kebab-case for styles
