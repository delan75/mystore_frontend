# Store API Documentation

## Overview

The Store API manages the product catalog, categories, brands, and core e-commerce functionality for the MyStore platform.

## Base URL
`/api/store/`

## Authentication

Most read operations are public. Write operations require authentication and appropriate permissions.

## Endpoints

### Products

#### List Products
```http
GET /api/store/products/
```

**Query Parameters:**
- `category` - Filter by category ID
- `brand` - Filter by brand ID
- `price_min` - Minimum price filter
- `price_max` - Maximum price filter
- `in_stock` - Filter by stock availability (true/false)
- `featured` - Filter featured products (true/false)
- `search` - Search in name, description, SKU
- `ordering` - Sort by: `name`, `price`, `-price`, `created_at`, `-created_at`

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 150,
    "next": "http://localhost:8000/api/store/products/?page=2",
    "previous": null,
    "results": [
      {
        "id": 1,
        "name": "Samsung Galaxy S24",
        "slug": "samsung-galaxy-s24",
        "sku": "SAM-S24-128GB",
        "description": "Latest Samsung flagship smartphone",
        "short_description": "Powerful Android smartphone with advanced camera",
        "price": "15999.00",
        "sale_price": "14999.00",
        "currency": "ZAR",
        "category": {
          "id": 1,
          "name": "Smartphones",
          "slug": "smartphones"
        },
        "brand": {
          "id": 1,
          "name": "Samsung",
          "slug": "samsung"
        },
        "images": [
          {
            "id": 1,
            "image": "https://example.com/media/products/samsung-s24-1.jpg",
            "alt_text": "Samsung Galaxy S24 front view",
            "is_primary": true
          }
        ],
        "stock_quantity": 25,
        "is_active": true,
        "is_featured": true,
        "weight": "0.168",
        "dimensions": "147.0 x 70.6 x 7.6 mm",
        "created_at": "2024-12-01T10:00:00Z",
        "updated_at": "2025-01-15T14:30:00Z"
      }
    ]
  }
}
```

#### Get Product Details
```http
GET /api/store/products/{id}/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Samsung Galaxy S24",
    "slug": "samsung-galaxy-s24",
    "sku": "SAM-S24-128GB",
    "description": "The Samsung Galaxy S24 features...",
    "short_description": "Powerful Android smartphone",
    "price": "15999.00",
    "sale_price": "14999.00",
    "currency": "ZAR",
    "category": {
      "id": 1,
      "name": "Smartphones",
      "slug": "smartphones",
      "parent": null
    },
    "brand": {
      "id": 1,
      "name": "Samsung",
      "slug": "samsung",
      "logo": "https://example.com/media/brands/samsung.png"
    },
    "images": [
      {
        "id": 1,
        "image": "https://example.com/media/products/samsung-s24-1.jpg",
        "alt_text": "Samsung Galaxy S24 front view",
        "is_primary": true
      }
    ],
    "attributes": [
      {
        "name": "Color",
        "value": "Phantom Black"
      },
      {
        "name": "Storage",
        "value": "128GB"
      }
    ],
    "variants": [
      {
        "id": 2,
        "name": "Samsung Galaxy S24 256GB",
        "sku": "SAM-S24-256GB",
        "price": "17999.00",
        "stock_quantity": 15
      }
    ],
    "stock_quantity": 25,
    "is_active": true,
    "is_featured": true,
    "weight": "0.168",
    "dimensions": "147.0 x 70.6 x 7.6 mm",
    "meta_title": "Samsung Galaxy S24 - Buy Online | MyStore",
    "meta_description": "Buy Samsung Galaxy S24 online at MyStore...",
    "created_at": "2024-12-01T10:00:00Z",
    "updated_at": "2025-01-15T14:30:00Z"
  }
}
```

#### Create Product (Admin Only)
```http
POST /api/store/products/
```

**Headers:**
```http
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "iPhone 15 Pro",
  "sku": "APPLE-IP15P-128GB",
  "description": "Latest iPhone with titanium design",
  "short_description": "Premium iPhone with Pro camera system",
  "price": "21999.00",
  "category": 1,
  "brand": 2,
  "stock_quantity": 10,
  "weight": "0.187",
  "is_active": true,
  "is_featured": false
}
```

#### Update Product (Admin Only)
```http
PUT /api/store/products/{id}/
```

#### Delete Product (Admin Only)
```http
DELETE /api/store/products/{id}/
```

### Categories

#### List Categories
```http
GET /api/store/categories/
```

**Query Parameters:**
- `parent` - Filter by parent category ID
- `level` - Filter by category level (0=root, 1=subcategory, etc.)
- `search` - Search in name and description

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices and gadgets",
      "parent": null,
      "level": 0,
      "image": "https://example.com/media/categories/electronics.jpg",
      "is_active": true,
      "product_count": 245,
      "children": [
        {
          "id": 2,
          "name": "Smartphones",
          "slug": "smartphones",
          "parent": 1,
          "level": 1,
          "product_count": 45
        }
      ],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Category Details
```http
GET /api/store/categories/{id}/
```

#### Create Category (Admin Only)
```http
POST /api/store/categories/
```

**Request Body:**
```json
{
  "name": "Laptops",
  "slug": "laptops",
  "description": "Portable computers and notebooks",
  "parent": 1,
  "is_active": true
}
```

### Brands

#### List Brands
```http
GET /api/store/brands/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Samsung",
      "slug": "samsung",
      "description": "South Korean electronics company",
      "logo": "https://example.com/media/brands/samsung.png",
      "website": "https://samsung.com",
      "is_active": true,
      "product_count": 67,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Brand Details
```http
GET /api/store/brands/{id}/
```

### Product Images

#### Upload Product Image (Admin Only)
```http
POST /api/store/products/{product_id}/images/
```

**Request Body (multipart/form-data):**
```
image: <image_file>
alt_text: "Product image description"
is_primary: false
```

#### Update Image
```http
PUT /api/store/products/{product_id}/images/{image_id}/
```

#### Delete Image
```http
DELETE /api/store/products/{product_id}/images/{image_id}/
```

### Product Variants

#### List Product Variants
```http
GET /api/store/products/{product_id}/variants/
```

#### Create Product Variant (Admin Only)
```http
POST /api/store/products/{product_id}/variants/
```

**Request Body:**
```json
{
  "name": "Samsung Galaxy S24 256GB",
  "sku": "SAM-S24-256GB",
  "price": "17999.00",
  "stock_quantity": 15,
  "attributes": [
    {
      "name": "Storage",
      "value": "256GB"
    }
  ]
}
```

### Search and Filters

#### Advanced Product Search
```http
GET /api/store/products/search/
```

**Query Parameters:**
- `q` - Search query
- `category` - Category filter
- `brand` - Brand filter
- `price_range` - Price range (e.g., "1000-5000")
- `attributes` - Attribute filters (e.g., "color:red,storage:128gb")
- `sort` - Sort options: `relevance`, `price_asc`, `price_desc`, `newest`, `rating`

**Response:**
```json
{
  "success": true,
  "data": {
    "query": "samsung phone",
    "total_results": 23,
    "filters_applied": {
      "brand": "Samsung",
      "category": "Smartphones"
    },
    "facets": {
      "brands": [
        {"name": "Samsung", "count": 23},
        {"name": "Apple", "count": 15}
      ],
      "price_ranges": [
        {"range": "0-5000", "count": 5},
        {"range": "5000-15000", "count": 12}
      ]
    },
    "results": [
      // Product objects
    ]
  }
}
```

### Product Reviews Integration

#### Get Product Reviews
```http
GET /api/store/products/{id}/reviews/
```

#### Product Rating Summary
```http
GET /api/store/products/{id}/rating-summary/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "average_rating": 4.3,
    "total_reviews": 127,
    "rating_distribution": {
      "5": 65,
      "4": 32,
      "3": 18,
      "2": 8,
      "1": 4
    }
  }
}
```

## Bulk Operations (Admin Only)

### Bulk Update Products
```http
POST /api/store/products/bulk-update/
```

**Request Body:**
```json
{
  "product_ids": [1, 2, 3, 4],
  "updates": {
    "is_featured": true,
    "category": 2
  }
}
```

### Bulk Import Products
```http
POST /api/store/products/bulk-import/
```

**Request Body (multipart/form-data):**
```
csv_file: <products.csv>
```

## Error Codes

| Code | Description |
|------|-------------|
| `PRODUCT_NOT_FOUND` | Product does not exist |
| `CATEGORY_NOT_FOUND` | Category does not exist |
| `INSUFFICIENT_STOCK` | Not enough stock available |
| `INVALID_SKU` | SKU already exists or invalid format |
| `IMAGE_UPLOAD_FAILED` | Image upload failed |
| `INVALID_PRICE` | Price format is invalid |

## Examples

### Get Products by Category
```bash
curl -X GET "http://localhost:8000/api/store/products/?category=1&ordering=-created_at"
```

### Search Products
```bash
curl -X GET "http://localhost:8000/api/store/products/search/?q=samsung&price_range=10000-20000"
```

### Create Product (Admin)
```bash
curl -X POST http://localhost:8000/api/store/products/ \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "sku": "NEW-PROD-001",
    "price": "999.00",
    "category": 1,
    "stock_quantity": 50
  }'
```
