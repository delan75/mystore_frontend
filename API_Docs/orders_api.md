# Orders API Documentation

## Overview

The Orders API handles order creation, management, tracking, and fulfillment for the MyStore e-commerce platform.

## Base URL
`/api/orders/`

## Authentication

All endpoints require authentication. Users can only access their own orders unless they have admin privileges.

## Endpoints

### Orders

#### List Orders
```http
GET /api/orders/
```

**Query Parameters:**
- `status` - Filter by order status
- `date_from` - Filter orders from date (YYYY-MM-DD)
- `date_to` - Filter orders to date (YYYY-MM-DD)
- `search` - Search in order number, customer name
- `ordering` - Sort by: `created_at`, `-created_at`, `total`, `-total`

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 45,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 1,
        "order_number": "ORD-2025-001234",
        "status": "processing",
        "status_display": "Processing",
        "customer": {
          "id": 1,
          "email": "customer@example.com",
          "first_name": "John",
          "last_name": "Doe"
        },
        "items_count": 3,
        "subtotal": "2999.00",
        "tax_amount": "449.85",
        "shipping_cost": "99.00",
        "discount_amount": "0.00",
        "total": "3547.85",
        "currency": "ZAR",
        "payment_status": "paid",
        "shipping_address": {
          "first_name": "John",
          "last_name": "Doe",
          "address_line_1": "123 Main Street",
          "city": "Cape Town",
          "province": "Western Cape",
          "postal_code": "8001",
          "country": "ZA"
        },
        "created_at": "2025-01-20T10:30:00Z",
        "updated_at": "2025-01-20T14:22:00Z"
      }
    ]
  }
}
```

#### Get Order Details
```http
GET /api/orders/{id}/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_number": "ORD-2025-001234",
    "status": "processing",
    "status_display": "Processing",
    "customer": {
      "id": 1,
      "email": "customer@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+27123456789"
    },
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Samsung Galaxy S24",
          "sku": "SAM-S24-128GB",
          "image": "https://example.com/media/products/samsung-s24-1.jpg"
        },
        "quantity": 1,
        "unit_price": "15999.00",
        "total_price": "15999.00"
      },
      {
        "id": 2,
        "product": {
          "id": 2,
          "name": "Phone Case",
          "sku": "CASE-S24-001"
        },
        "quantity": 2,
        "unit_price": "299.00",
        "total_price": "598.00"
      }
    ],
    "subtotal": "16597.00",
    "tax_amount": "2489.55",
    "shipping_cost": "99.00",
    "discount_amount": "500.00",
    "total": "18685.55",
    "currency": "ZAR",
    "payment_method": "credit_card",
    "payment_status": "paid",
    "payment_reference": "PAY-2025-001234",
    "shipping_address": {
      "first_name": "John",
      "last_name": "Doe",
      "company": "",
      "address_line_1": "123 Main Street",
      "address_line_2": "Apt 4B",
      "city": "Cape Town",
      "province": "Western Cape",
      "postal_code": "8001",
      "country": "ZA",
      "phone": "+27123456789"
    },
    "billing_address": {
      "first_name": "John",
      "last_name": "Doe",
      "address_line_1": "123 Main Street",
      "city": "Cape Town",
      "province": "Western Cape",
      "postal_code": "8001",
      "country": "ZA"
    },
    "notes": "Please deliver after 2 PM",
    "tracking_number": "TRK-2025-001234",
    "estimated_delivery": "2025-01-25",
    "created_at": "2025-01-20T10:30:00Z",
    "updated_at": "2025-01-20T14:22:00Z",
    "status_history": [
      {
        "status": "pending",
        "timestamp": "2025-01-20T10:30:00Z",
        "note": "Order created"
      },
      {
        "status": "confirmed",
        "timestamp": "2025-01-20T11:00:00Z",
        "note": "Payment confirmed"
      },
      {
        "status": "processing",
        "timestamp": "2025-01-20T14:22:00Z",
        "note": "Order being prepared"
      }
    ]
  }
}
```

#### Create Order
```http
POST /api/orders/
```

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 1
    },
    {
      "product_id": 2,
      "quantity": 2
    }
  ],
  "shipping_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address_line_1": "123 Main Street",
    "city": "Cape Town",
    "province": "Western Cape",
    "postal_code": "8001",
    "country": "ZA",
    "phone": "+27123456789"
  },
  "billing_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address_line_1": "123 Main Street",
    "city": "Cape Town",
    "province": "Western Cape",
    "postal_code": "8001",
    "country": "ZA"
  },
  "payment_method": "credit_card",
  "coupon_code": "SAVE10",
  "notes": "Please deliver after 2 PM"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_number": "ORD-2025-001234",
    "status": "pending",
    "total": "18685.55",
    "payment_url": "https://payment.gateway.com/pay/abc123",
    "message": "Order created successfully. Please complete payment."
  }
}
```

### Order Status Management

#### Update Order Status (Admin Only)
```http
PUT /api/orders/{id}/status/
```

**Request Body:**
```json
{
  "status": "shipped",
  "tracking_number": "TRK-2025-001234",
  "note": "Order shipped via courier"
}
```

#### Cancel Order
```http
POST /api/orders/{id}/cancel/
```

**Request Body:**
```json
{
  "reason": "Customer requested cancellation"
}
```

### Order Items

#### Update Order Item (Admin Only)
```http
PUT /api/orders/{order_id}/items/{item_id}/
```

**Request Body:**
```json
{
  "quantity": 3,
  "unit_price": "14999.00"
}
```

#### Remove Order Item (Admin Only)
```http
DELETE /api/orders/{order_id}/items/{item_id}/
```

### Shipping and Tracking

#### Get Shipping Options
```http
GET /api/orders/shipping-options/
```

**Query Parameters:**
- `address` - Shipping address (JSON encoded)
- `items` - Order items (JSON encoded)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "standard",
      "name": "Standard Delivery",
      "description": "3-5 business days",
      "cost": "99.00",
      "estimated_days": 5
    },
    {
      "id": "express",
      "name": "Express Delivery",
      "description": "1-2 business days",
      "cost": "199.00",
      "estimated_days": 2
    }
  ]
}
```

#### Track Order
```http
GET /api/orders/{id}/tracking/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tracking_number": "TRK-2025-001234",
    "carrier": "Courier Guy",
    "status": "in_transit",
    "estimated_delivery": "2025-01-25",
    "tracking_events": [
      {
        "timestamp": "2025-01-20T14:22:00Z",
        "status": "picked_up",
        "location": "Cape Town Warehouse",
        "description": "Package picked up"
      },
      {
        "timestamp": "2025-01-21T08:15:00Z",
        "status": "in_transit",
        "location": "Cape Town Hub",
        "description": "Package in transit"
      }
    ]
  }
}
```

### Returns and Refunds

#### Request Return
```http
POST /api/orders/{id}/returns/
```

**Request Body:**
```json
{
  "items": [
    {
      "order_item_id": 1,
      "quantity": 1,
      "reason": "defective",
      "description": "Screen has dead pixels"
    }
  ],
  "return_method": "pickup"
}
```

#### List Returns
```http
GET /api/orders/returns/
```

#### Get Return Details
```http
GET /api/orders/returns/{id}/
```

#### Process Return (Admin Only)
```http
PUT /api/orders/returns/{id}/process/
```

**Request Body:**
```json
{
  "status": "approved",
  "refund_amount": "15999.00",
  "notes": "Return approved, full refund issued"
}
```

### Order Analytics (Admin Only)

#### Order Statistics
```http
GET /api/orders/analytics/stats/
```

**Query Parameters:**
- `period` - Time period: `today`, `week`, `month`, `year`
- `date_from` - Custom start date
- `date_to` - Custom end date

**Response:**
```json
{
  "success": true,
  "data": {
    "total_orders": 1247,
    "total_revenue": "2847392.50",
    "average_order_value": "2284.15",
    "orders_by_status": {
      "pending": 23,
      "confirmed": 45,
      "processing": 67,
      "shipped": 89,
      "delivered": 1012,
      "cancelled": 11
    },
    "top_products": [
      {
        "product_id": 1,
        "product_name": "Samsung Galaxy S24",
        "quantity_sold": 156,
        "revenue": "2495844.00"
      }
    ]
  }
}
```

### Bulk Operations (Admin Only)

#### Bulk Update Order Status
```http
POST /api/orders/bulk-update-status/
```

**Request Body:**
```json
{
  "order_ids": [1, 2, 3, 4],
  "status": "processing",
  "note": "Bulk status update"
}
```

#### Export Orders
```http
GET /api/orders/export/
```

**Query Parameters:**
- `format` - Export format: `csv`, `xlsx`
- `date_from` - Start date
- `date_to` - End date
- `status` - Filter by status

## Order Status Flow

```
pending → confirmed → processing → shipped → delivered
    ↓         ↓           ↓          ↓
cancelled cancelled  cancelled  cancelled
```

## Payment Integration

### Payment Methods
- Credit Card (Visa, Mastercard)
- EFT/Bank Transfer
- PayFast
- SnapScan
- Cash on Delivery

### Payment Status
- `pending` - Payment not yet processed
- `processing` - Payment being processed
- `paid` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

## Error Codes

| Code | Description |
|------|-------------|
| `ORDER_NOT_FOUND` | Order does not exist |
| `INSUFFICIENT_STOCK` | Not enough stock for order |
| `INVALID_PAYMENT_METHOD` | Payment method not supported |
| `ORDER_ALREADY_CANCELLED` | Order is already cancelled |
| `CANNOT_MODIFY_ORDER` | Order cannot be modified in current status |
| `INVALID_SHIPPING_ADDRESS` | Shipping address is invalid |
| `COUPON_INVALID` | Coupon code is invalid or expired |

## Examples

### Create Order Flow
```bash
# 1. Get shipping options
curl -X GET "http://localhost:8000/api/orders/shipping-options/?address={...}&items={...}"

# 2. Create order
curl -X POST http://localhost:8000/api/orders/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"product_id": 1, "quantity": 1}],
    "shipping_address": {...},
    "payment_method": "credit_card"
  }'

# 3. Track order
curl -X GET http://localhost:8000/api/orders/1/tracking/ \
  -H "Authorization: Bearer <token>"
```
