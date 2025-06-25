# Cart API Documentation

## Overview

The Cart API manages shopping cart functionality, allowing users to add, update, and remove items before checkout.

## Base URL
`/api/cart/`

## Authentication

Cart operations can work for both authenticated and anonymous users. Anonymous users use session-based carts, while authenticated users have persistent carts.

## Endpoints

### Cart Management

#### Get Cart
```http
GET /api/cart/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cart-uuid-123",
    "user": 1,
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Samsung Galaxy S24",
          "slug": "samsung-galaxy-s24",
          "sku": "SAM-S24-128GB",
          "price": "15999.00",
          "sale_price": "14999.00",
          "image": "https://example.com/media/products/samsung-s24-1.jpg",
          "stock_quantity": 25,
          "is_active": true
        },
        "quantity": 2,
        "unit_price": "14999.00",
        "total_price": "29998.00",
        "added_at": "2025-01-20T10:30:00Z"
      }
    ],
    "items_count": 2,
    "subtotal": "29998.00",
    "tax_amount": "4499.70",
    "total": "34497.70",
    "currency": "ZAR",
    "created_at": "2025-01-20T10:00:00Z",
    "updated_at": "2025-01-20T10:30:00Z"
  }
}
```

#### Add Item to Cart
```http
POST /api/cart/items/
```

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "item": {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Samsung Galaxy S24",
        "price": "15999.00",
        "sale_price": "14999.00"
      },
      "quantity": 2,
      "unit_price": "14999.00",
      "total_price": "29998.00"
    },
    "cart_summary": {
      "items_count": 2,
      "subtotal": "29998.00",
      "total": "34497.70"
    }
  },
  "message": "Item added to cart successfully"
}
```

#### Update Cart Item
```http
PUT /api/cart/items/{item_id}/
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "item": {
      "id": 1,
      "quantity": 3,
      "total_price": "44997.00"
    },
    "cart_summary": {
      "items_count": 3,
      "subtotal": "44997.00",
      "total": "51746.55"
    }
  },
  "message": "Cart item updated successfully"
}
```

#### Remove Cart Item
```http
DELETE /api/cart/items/{item_id}/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cart_summary": {
      "items_count": 0,
      "subtotal": "0.00",
      "total": "0.00"
    }
  },
  "message": "Item removed from cart"
}
```

#### Clear Cart
```http
DELETE /api/cart/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Cart cleared successfully"
  }
}
```

### Cart Operations

#### Apply Coupon
```http
POST /api/cart/apply-coupon/
```

**Request Body:**
```json
{
  "coupon_code": "SAVE10"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "coupon": {
      "code": "SAVE10",
      "discount_type": "percentage",
      "discount_value": "10.00",
      "description": "10% off your order"
    },
    "discount_amount": "2999.80",
    "cart_summary": {
      "subtotal": "29998.00",
      "discount_amount": "2999.80",
      "tax_amount": "4049.73",
      "total": "31047.93"
    }
  },
  "message": "Coupon applied successfully"
}
```

#### Remove Coupon
```http
DELETE /api/cart/remove-coupon/
```

#### Calculate Shipping
```http
POST /api/cart/calculate-shipping/
```

**Request Body:**
```json
{
  "shipping_address": {
    "city": "Cape Town",
    "province": "Western Cape",
    "postal_code": "8001",
    "country": "ZA"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shipping_options": [
      {
        "id": "standard",
        "name": "Standard Delivery",
        "cost": "99.00",
        "estimated_days": 5
      },
      {
        "id": "express",
        "name": "Express Delivery",
        "cost": "199.00",
        "estimated_days": 2
      }
    ],
    "cart_summary": {
      "subtotal": "29998.00",
      "shipping_cost": "99.00",
      "tax_amount": "4514.55",
      "total": "34611.55"
    }
  }
}
```

### Cart Validation

#### Validate Cart
```http
GET /api/cart/validate/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "is_valid": true,
    "issues": [],
    "cart_summary": {
      "items_count": 2,
      "subtotal": "29998.00",
      "total": "34497.70"
    }
  }
}
```

**Response with Issues:**
```json
{
  "success": true,
  "data": {
    "is_valid": false,
    "issues": [
      {
        "item_id": 1,
        "product_id": 1,
        "issue_type": "insufficient_stock",
        "message": "Only 1 item available, but 2 requested",
        "available_quantity": 1
      },
      {
        "item_id": 2,
        "product_id": 5,
        "issue_type": "product_inactive",
        "message": "Product is no longer available"
      }
    ]
  }
}
```

### Saved Items (Wishlist)

#### Save Item for Later
```http
POST /api/cart/items/{item_id}/save-for-later/
```

#### Move to Cart from Saved
```http
POST /api/cart/saved-items/{item_id}/move-to-cart/
```

#### List Saved Items
```http
GET /api/cart/saved-items/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product": {
        "id": 2,
        "name": "iPhone 15 Pro",
        "price": "21999.00",
        "image": "https://example.com/media/products/iphone-15-pro.jpg"
      },
      "saved_at": "2025-01-19T15:30:00Z"
    }
  ]
}
```

#### Remove Saved Item
```http
DELETE /api/cart/saved-items/{item_id}/
```

### Cart Sharing

#### Share Cart
```http
POST /api/cart/share/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "share_token": "cart-share-abc123",
    "share_url": "https://mystore.com/cart/shared/cart-share-abc123",
    "expires_at": "2025-01-27T10:30:00Z"
  },
  "message": "Cart shared successfully"
}
```

#### Get Shared Cart
```http
GET /api/cart/shared/{share_token}/
```

### Cart Analytics (Admin Only)

#### Abandoned Carts
```http
GET /api/cart/analytics/abandoned/
```

**Query Parameters:**
- `days` - Number of days to look back (default: 7)
- `min_value` - Minimum cart value to include

**Response:**
```json
{
  "success": true,
  "data": {
    "total_abandoned": 156,
    "total_value": "1247392.50",
    "average_value": "7995.46",
    "abandonment_rate": "68.5",
    "top_abandoned_products": [
      {
        "product_id": 1,
        "product_name": "Samsung Galaxy S24",
        "abandonment_count": 23
      }
    ]
  }
}
```

#### Cart Conversion Stats
```http
GET /api/cart/analytics/conversion/
```

### Bulk Operations

#### Bulk Add Items
```http
POST /api/cart/bulk-add/
```

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 1
    }
  ]
}
```

#### Bulk Update Items
```http
PUT /api/cart/bulk-update/
```

**Request Body:**
```json
{
  "updates": [
    {
      "item_id": 1,
      "quantity": 3
    },
    {
      "item_id": 2,
      "quantity": 0
    }
  ]
}
```

### Cart Persistence

#### Merge Carts (Anonymous to Authenticated)
```http
POST /api/cart/merge/
```

**Request Body:**
```json
{
  "anonymous_cart_id": "session-cart-123"
}
```

#### Export Cart
```http
GET /api/cart/export/
```

**Query Parameters:**
- `format` - Export format: `json`, `csv`

## Cart Rules and Validation

### Stock Validation
- Items are validated against current stock levels
- Out-of-stock items are flagged but not automatically removed
- Stock is reserved for a limited time during checkout

### Price Validation
- Prices are validated against current product prices
- Price changes are reflected in cart totals
- Users are notified of price changes

### Product Availability
- Inactive products are flagged in cart validation
- Discontinued products remain in cart with warnings

## Error Codes

| Code | Description |
|------|-------------|
| `CART_NOT_FOUND` | Cart does not exist |
| `PRODUCT_NOT_FOUND` | Product does not exist |
| `INSUFFICIENT_STOCK` | Not enough stock available |
| `INVALID_QUANTITY` | Quantity must be positive |
| `PRODUCT_INACTIVE` | Product is not active |
| `COUPON_INVALID` | Coupon code is invalid |
| `CART_EMPTY` | Cart has no items |
| `ITEM_NOT_IN_CART` | Item is not in the cart |

## Rate Limits

- **Cart operations**: 100 requests per minute per user
- **Bulk operations**: 10 requests per minute per user

## Examples

### Complete Cart Flow
```bash
# 1. Add item to cart
curl -X POST http://localhost:8000/api/cart/items/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 2}'

# 2. Apply coupon
curl -X POST http://localhost:8000/api/cart/apply-coupon/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"coupon_code": "SAVE10"}'

# 3. Calculate shipping
curl -X POST http://localhost:8000/api/cart/calculate-shipping/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"shipping_address": {...}}'

# 4. Validate cart before checkout
curl -X GET http://localhost:8000/api/cart/validate/ \
  -H "Authorization: Bearer <token>"
```
