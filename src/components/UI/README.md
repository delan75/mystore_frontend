# UI Components

This directory contains reusable UI components used throughout the application.

## Component Structure

```
UI/
├── README.md                   # This file
├── OptimizedImage.js          # Image component with WebP support
├── LoadingSpinner.js          # Loading spinner with size variants
├── SectionHeader.js           # Section title and description
├── Button.js                  # Button component with variants
├── RatingDisplay.js           # Star rating display
├── AddToCartButton.js         # Add to cart functionality
└── styles/                    # Component-specific styles
    ├── OptimizedImage.css
    ├── LoadingSpinner.css
    ├── SectionHeader.css
    ├── Button.css
    ├── RatingDisplay.css
    └── AddToCartButton.css
```

## Component Guidelines

- Components should be highly reusable across different pages
- Use design tokens for consistent styling
- Include comprehensive prop validation
- Support accessibility features
- Handle edge cases and error states

## Usage Examples

```jsx
// OptimizedImage
<OptimizedImage
  src="/images/product.jpg"
  alt="Product description"
  width={400}
  height={300}
  loading="lazy"
/>

// LoadingSpinner
<LoadingSpinner size="large" />

// SectionHeader
<SectionHeader
  title="Featured Products"
  subtitle="Fresh from the farm"
  description="Discover our handpicked selection..."
/>
```
