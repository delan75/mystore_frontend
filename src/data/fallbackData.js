// Fallback data for landing page when API calls fail

export const fallbackCategories = [
  {
    id: 1,
    name: "Vegetables",
    slug: "vegetables",
    description: "Fresh organic vegetables grown locally without pesticides",
    parent: null,
    level: 0,
    image: "/images/categories/vegetables.jpg",
    is_active: true,
    product_count: 45,
    children: [
      {
        id: 11,
        name: "Leafy Greens",
        slug: "leafy-greens",
        parent: 1,
        level: 1,
        product_count: 12
      },
      {
        id: 12,
        name: "Root Vegetables",
        slug: "root-vegetables", 
        parent: 1,
        level: 1,
        product_count: 18
      }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Fruits",
    slug: "fruits",
    description: "Seasonal fresh fruits picked at peak ripeness",
    parent: null,
    level: 0,
    image: "/images/categories/fruits.jpg",
    is_active: true,
    product_count: 32,
    children: [
      {
        id: 21,
        name: "Citrus Fruits",
        slug: "citrus-fruits",
        parent: 2,
        level: 1,
        product_count: 8
      },
      {
        id: 22,
        name: "Stone Fruits",
        slug: "stone-fruits",
        parent: 2,
        level: 1,
        product_count: 12
      }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Herbs & Spices",
    slug: "herbs-spices",
    description: "Aromatic fresh herbs and organic spices",
    parent: null,
    level: 0,
    image: "/images/categories/herbs.jpg",
    is_active: true,
    product_count: 18,
    children: [
      {
        id: 31,
        name: "Fresh Herbs",
        slug: "fresh-herbs",
        parent: 3,
        level: 1,
        product_count: 10
      }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Dairy Products",
    slug: "dairy-products",
    description: "Local farm dairy products from grass-fed cows",
    parent: null,
    level: 0,
    image: "/images/categories/dairy.jpg",
    is_active: true,
    product_count: 24,
    children: [
      {
        id: 41,
        name: "Fresh Milk",
        slug: "fresh-milk",
        parent: 4,
        level: 1,
        product_count: 6
      },
      {
        id: 42,
        name: "Artisan Cheese",
        slug: "artisan-cheese",
        parent: 4,
        level: 1,
        product_count: 12
      }
    ],
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "Grains & Legumes",
    slug: "grains-legumes",
    description: "Organic grains and legumes for healthy living",
    parent: null,
    level: 0,
    image: "/images/categories/grains.jpg",
    is_active: true,
    product_count: 16,
    children: [],
    created_at: "2024-01-01T00:00:00Z"
  }
];

export const fallbackProducts = [
  {
    id: 1,
    name: "Organic Roma Tomatoes",
    slug: "organic-roma-tomatoes",
    sku: "ORG-TOM-001",
    description: "Fresh organic Roma tomatoes grown locally without pesticides. Perfect for cooking, sauces, and fresh eating. Rich in vitamins and antioxidants.",
    short_description: "Juicy, pesticide-free Roma tomatoes perfect for cooking",
    price: "45.99",
    sale_price: "39.99",
    currency: "ZAR",
    category: {
      id: 1,
      name: "Vegetables",
      slug: "vegetables"
    },
    brand: {
      id: 1,
      name: "Local Organic Farms",
      slug: "local-organic-farms"
    },
    images: [
      {
        id: 1,
        image: "/images/products/roma-tomatoes.jpg",
        alt_text: "Fresh organic Roma tomatoes",
        is_primary: true
      }
    ],
    stock_quantity: 25,
    is_active: true,
    is_featured: true,
    weight: "1.0",
    dimensions: "N/A",
    meta_title: "Organic Roma Tomatoes - Fresh Local Produce | MyStore",
    meta_description: "Buy fresh organic Roma tomatoes online. Locally grown, pesticide-free, perfect for cooking. Free delivery on orders over R200.",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2025-01-15T14:30:00Z",
    average_rating: 4.8,
    review_count: 89
  },
  {
    id: 2,
    name: "Fresh Baby Spinach",
    slug: "fresh-baby-spinach",
    sku: "ORG-SPN-001",
    description: "Tender baby spinach leaves, rich in iron and vitamins. Grown organically in nutrient-rich soil. Perfect for salads, smoothies, and cooking.",
    short_description: "Iron-rich baby spinach leaves, perfect for salads",
    price: "32.50",
    sale_price: null,
    currency: "ZAR",
    category: {
      id: 1,
      name: "Vegetables",
      slug: "vegetables"
    },
    brand: {
      id: 1,
      name: "Local Organic Farms",
      slug: "local-organic-farms"
    },
    images: [
      {
        id: 2,
        image: "/images/products/baby-spinach.jpg",
        alt_text: "Fresh baby spinach leaves",
        is_primary: true
      }
    ],
    stock_quantity: 18,
    is_active: true,
    is_featured: true,
    weight: "0.5",
    dimensions: "N/A",
    meta_title: "Fresh Baby Spinach - Organic Leafy Greens | MyStore",
    meta_description: "Order fresh baby spinach online. Organic, iron-rich leafy greens perfect for healthy meals. Same-day delivery available.",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2025-01-15T14:30:00Z",
    average_rating: 4.9,
    review_count: 67
  },
  {
    id: 3,
    name: "Organic Baby Carrots",
    slug: "organic-baby-carrots",
    sku: "ORG-CAR-001",
    description: "Sweet and crunchy baby carrots, perfect for snacking or cooking. Grown organically with no artificial chemicals. High in beta-carotene and fiber.",
    short_description: "Sweet, crunchy baby carrots perfect for snacking",
    price: "28.99",
    sale_price: "24.99",
    currency: "ZAR",
    category: {
      id: 1,
      name: "Vegetables",
      slug: "vegetables"
    },
    brand: {
      id: 1,
      name: "Local Organic Farms",
      slug: "local-organic-farms"
    },
    images: [
      {
        id: 3,
        image: "/images/products/baby-carrots.jpg",
        alt_text: "Organic baby carrots",
        is_primary: true
      }
    ],
    stock_quantity: 30,
    is_active: true,
    is_featured: true,
    weight: "1.0",
    dimensions: "N/A",
    meta_title: "Organic Baby Carrots - Fresh Vegetables | MyStore",
    meta_description: "Buy organic baby carrots online. Sweet, crunchy, and perfect for healthy snacking. Grown locally without chemicals.",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2025-01-15T14:30:00Z",
    average_rating: 4.7,
    review_count: 54
  },
  {
    id: 4,
    name: "Local Raw Honey",
    slug: "local-raw-honey",
    sku: "HON-RAW-001",
    description: "Pure, unprocessed raw honey from local beekeepers. Rich in natural enzymes and antioxidants. Perfect for sweetening tea, baking, or eating straight.",
    short_description: "Pure raw honey from local beekeepers",
    price: "89.99",
    sale_price: null,
    currency: "ZAR",
    category: {
      id: 5,
      name: "Natural Products",
      slug: "natural-products"
    },
    brand: {
      id: 2,
      name: "Local Beekeepers",
      slug: "local-beekeepers"
    },
    images: [
      {
        id: 4,
        image: "/images/products/raw-honey.jpg",
        alt_text: "Local raw honey jar",
        is_primary: true
      }
    ],
    stock_quantity: 15,
    is_active: true,
    is_featured: true,
    weight: "0.5",
    dimensions: "500ml jar",
    meta_title: "Local Raw Honey - Pure Natural Sweetener | MyStore",
    meta_description: "Buy pure raw honey from local beekeepers. Unprocessed, natural sweetener rich in enzymes and antioxidants.",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2025-01-15T14:30:00Z",
    average_rating: 4.9,
    review_count: 123
  },
  {
    id: 5,
    name: "Organic Mixed Salad Greens",
    slug: "organic-mixed-salad-greens",
    sku: "ORG-SAL-001",
    description: "Fresh mix of organic salad greens including lettuce, arugula, and baby kale. Washed and ready to eat. Perfect for healthy salads and wraps.",
    short_description: "Ready-to-eat organic mixed salad greens",
    price: "38.50",
    sale_price: null,
    currency: "ZAR",
    category: {
      id: 1,
      name: "Vegetables",
      slug: "vegetables"
    },
    brand: {
      id: 1,
      name: "Local Organic Farms",
      slug: "local-organic-farms"
    },
    images: [
      {
        id: 5,
        image: "/images/products/mixed-salad-greens.jpg",
        alt_text: "Organic mixed salad greens",
        is_primary: true
      }
    ],
    stock_quantity: 22,
    is_active: true,
    is_featured: true,
    weight: "0.3",
    dimensions: "N/A",
    meta_title: "Organic Mixed Salad Greens - Fresh & Ready | MyStore",
    meta_description: "Order organic mixed salad greens online. Fresh, washed, and ready to eat. Perfect for healthy meals and quick salads.",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2025-01-15T14:30:00Z",
    average_rating: 4.6,
    review_count: 78
  },
  {
    id: 6,
    name: "Fresh Basil Herbs",
    slug: "fresh-basil-herbs",
    sku: "HRB-BAS-001",
    description: "Aromatic fresh basil herbs grown organically. Perfect for Italian cooking, pesto, and garnishing. Adds incredible flavor to any dish.",
    short_description: "Aromatic fresh basil for cooking and garnishing",
    price: "22.99",
    sale_price: null,
    currency: "ZAR",
    category: {
      id: 3,
      name: "Herbs & Spices",
      slug: "herbs-spices"
    },
    brand: {
      id: 1,
      name: "Local Organic Farms",
      slug: "local-organic-farms"
    },
    images: [
      {
        id: 6,
        image: "/images/products/fresh-basil.jpg",
        alt_text: "Fresh basil herbs",
        is_primary: true
      }
    ],
    stock_quantity: 35,
    is_active: true,
    is_featured: true,
    weight: "0.1",
    dimensions: "N/A",
    meta_title: "Fresh Basil Herbs - Organic Cooking Herbs | MyStore",
    meta_description: "Buy fresh basil herbs online. Organically grown, perfect for Italian cooking and pesto. Aromatic and flavorful.",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2025-01-15T14:30:00Z",
    average_rating: 4.8,
    review_count: 45
  },
  {
    id: 7,
    name: "Organic Free-Range Eggs",
    slug: "organic-free-range-eggs",
    sku: "EGG-FRE-001",
    description: "Fresh organic eggs from free-range chickens. Rich in protein and omega-3 fatty acids. Chickens are fed organic feed and roam freely on pasture.",
    short_description: "Fresh eggs from free-range organic chickens",
    price: "65.99",
    sale_price: "59.99",
    currency: "ZAR",
    category: {
      id: 4,
      name: "Dairy Products",
      slug: "dairy-products"
    },
    brand: {
      id: 3,
      name: "Happy Hens Farm",
      slug: "happy-hens-farm"
    },
    images: [
      {
        id: 7,
        image: "/images/products/free-range-eggs.jpg",
        alt_text: "Organic free-range eggs",
        is_primary: true
      }
    ],
    stock_quantity: 28,
    is_active: true,
    is_featured: true,
    weight: "0.6",
    dimensions: "12 eggs per carton",
    meta_title: "Organic Free-Range Eggs - Farm Fresh | MyStore",
    meta_description: "Order organic free-range eggs online. From happy, pasture-raised chickens. Rich in protein and omega-3s.",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2025-01-15T14:30:00Z",
    average_rating: 4.9,
    review_count: 156
  },
  {
    id: 8,
    name: "Seasonal Fruit Box",
    slug: "seasonal-fruit-box",
    sku: "FRT-BOX-001",
    description: "Curated selection of seasonal fruits picked at peak ripeness. Contents vary by season but always include the freshest, most flavorful fruits available.",
    short_description: "Curated box of seasonal fresh fruits",
    price: "125.99",
    sale_price: "109.99",
    currency: "ZAR",
    category: {
      id: 2,
      name: "Fruits",
      slug: "fruits"
    },
    brand: {
      id: 1,
      name: "Local Organic Farms",
      slug: "local-organic-farms"
    },
    images: [
      {
        id: 8,
        image: "/images/products/seasonal-fruit-box.jpg",
        alt_text: "Seasonal fruit box with mixed fruits",
        is_primary: true
      }
    ],
    stock_quantity: 12,
    is_active: true,
    is_featured: true,
    weight: "3.0",
    dimensions: "Large box - 5-7 varieties",
    meta_title: "Seasonal Fruit Box - Fresh Mixed Fruits | MyStore",
    meta_description: "Order a seasonal fruit box online. Curated selection of the freshest fruits picked at peak ripeness. Perfect for families.",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2025-01-15T14:30:00Z",
    average_rating: 4.7,
    review_count: 92
  }
];

export const fallbackSEOData = {
  title: "Fresh Farm Products Online | Organic Vegetables & Local Produce | MyStore",
  description: "Order fresh, organic farm products online. Local vegetables, fruits, and produce delivered to your door. Supporting sustainable farming and local communities.",
  keywords: "fresh farm products, organic vegetables, local produce, farm delivery, sustainable farming, organic food store",
  ogImage: "/images/og-hero-farm.jpg",
  canonicalUrl: "https://mystore.com/",
  structuredData: {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MyStore",
      "description": "Fresh farm products and organic produce delivery service",
      "url": "https://mystore.com",
      "logo": "https://mystore.com/images/logo.png"
    }
  }
};

export const fallbackTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Johannesburg",
    rating: 5,
    text: "The freshest vegetables I've ever bought online! The tomatoes taste like they were just picked from the garden. Delivery was quick and packaging was excellent.",
    image: "/images/testimonials/sarah-j.jpg",
    verified: true,
    date: "2025-01-15"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Pretoria",
    rating: 5,
    text: "Amazing quality and service. The organic produce is always fresh and the prices are very reasonable. I've been ordering weekly for 6 months now.",
    image: "/images/testimonials/michael-c.jpg",
    verified: true,
    date: "2025-01-10"
  },
  {
    id: 3,
    name: "Lisa van der Merwe",
    location: "Cape Town",
    rating: 4,
    text: "Great selection of local products. Love supporting local farmers through MyStore. The seasonal fruit boxes are always a delightful surprise!",
    image: "/images/testimonials/lisa-v.jpg",
    verified: true,
    date: "2025-01-08"
  }
];

export const fallbackValuePropositions = [
  {
    id: 1,
    icon: "fas fa-truck",
    title: "Free Delivery",
    description: "Free delivery on orders over R200. Fast and reliable service to your doorstep.",
    color: "var(--color-accent-green)"
  },
  {
    id: 2,
    icon: "fas fa-leaf",
    title: "100% Organic",
    description: "All our products are certified organic, grown without harmful pesticides or chemicals.",
    color: "var(--color-primary-green)"
  },
  {
    id: 3,
    icon: "fas fa-handshake",
    title: "Local Farmers",
    description: "We work directly with local farmers, ensuring fair prices and supporting our community.",
    color: "var(--color-earth-brown)"
  },
  {
    id: 4,
    icon: "fas fa-recycle",
    title: "Sustainable",
    description: "Eco-friendly packaging and sustainable farming practices that protect our environment.",
    color: "var(--color-lettuce-green)"
  }
];
