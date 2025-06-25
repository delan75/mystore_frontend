# Suppliers API Documentation

## Overview

The Suppliers API manages supplier relationships, purchase orders, supplier products, and procurement operations for the MyStore platform.

## Base URL
`/api/suppliers/`

## Authentication

All endpoints require authentication with staff or admin privileges.

## Endpoints

### Supplier Management

#### List Suppliers
```http
GET /api/suppliers/
```

**Query Parameters:**
- `status` - Filter by status: `active`, `inactive`, `pending`
- `country` - Filter by country
- `search` - Search in name, email, contact person
- `ordering` - Sort by: `name`, `created_at`, `-created_at`

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 25,
    "results": [
      {
        "id": 1,
        "name": "TechDistributor SA",
        "code": "TECH001",
        "status": "active",
        "contact_person": "John Smith",
        "email": "orders@techdistributor.co.za",
        "phone": "+27123456789",
        "address": {
          "street": "123 Industrial Road",
          "city": "Cape Town",
          "province": "Western Cape",
          "postal_code": "7500",
          "country": "ZA"
        },
        "payment_terms": "30_days",
        "currency": "ZAR",
        "tax_number": "4123456789",
        "rating": 4.5,
        "total_orders": 156,
        "total_value": "2847392.50",
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2025-01-20T14:30:00Z"
      }
    ]
  }
}
```

#### Get Supplier Details
```http
GET /api/suppliers/{id}/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "TechDistributor SA",
    "code": "TECH001",
    "status": "active",
    "contact_person": "John Smith",
    "email": "orders@techdistributor.co.za",
    "phone": "+27123456789",
    "website": "https://techdistributor.co.za",
    "address": {
      "street": "123 Industrial Road",
      "suburb": "Montague Gardens",
      "city": "Cape Town",
      "province": "Western Cape",
      "postal_code": "7500",
      "country": "ZA"
    },
    "billing_address": {
      "street": "123 Industrial Road",
      "city": "Cape Town",
      "province": "Western Cape",
      "postal_code": "7500",
      "country": "ZA"
    },
    "payment_terms": "30_days",
    "currency": "ZAR",
    "tax_number": "4123456789",
    "bank_details": {
      "bank_name": "Standard Bank",
      "account_number": "123456789",
      "branch_code": "051001"
    },
    "rating": 4.5,
    "notes": "Reliable supplier for electronics",
    "categories": [
      {
        "id": 1,
        "name": "Electronics"
      }
    ],
    "contacts": [
      {
        "id": 1,
        "name": "John Smith",
        "role": "Sales Manager",
        "email": "john@techdistributor.co.za",
        "phone": "+27123456789"
      }
    ],
    "performance_metrics": {
      "on_time_delivery": 95.5,
      "quality_rating": 4.3,
      "response_time_hours": 2.5,
      "defect_rate": 0.8
    },
    "total_orders": 156,
    "total_value": "2847392.50",
    "last_order_date": "2025-01-18T10:00:00Z",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

#### Create Supplier
```http
POST /api/suppliers/
```

**Request Body:**
```json
{
  "name": "New Electronics Supplier",
  "code": "NEWELEC001",
  "contact_person": "Jane Doe",
  "email": "orders@newelectronics.co.za",
  "phone": "+27987654321",
  "address": {
    "street": "456 Commerce Street",
    "city": "Johannesburg",
    "province": "Gauteng",
    "postal_code": "2000",
    "country": "ZA"
  },
  "payment_terms": "30_days",
  "currency": "ZAR",
  "tax_number": "9876543210"
}
```

#### Update Supplier
```http
PUT /api/suppliers/{id}/
```

#### Delete Supplier
```http
DELETE /api/suppliers/{id}/
```

### Purchase Orders

#### List Purchase Orders
```http
GET /api/suppliers/purchase-orders/
```

**Query Parameters:**
- `supplier_id` - Filter by supplier
- `status` - Filter by status
- `date_from` - Start date filter
- `date_to` - End date filter
- `search` - Search in PO number, supplier name

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 89,
    "results": [
      {
        "id": 1,
        "po_number": "PO-2025-001234",
        "supplier": {
          "id": 1,
          "name": "TechDistributor SA",
          "code": "TECH001"
        },
        "status": "pending",
        "status_display": "Pending Approval",
        "order_date": "2025-01-20T10:00:00Z",
        "expected_delivery": "2025-01-30T00:00:00Z",
        "items_count": 5,
        "subtotal": "125000.00",
        "tax_amount": "18750.00",
        "total": "143750.00",
        "currency": "ZAR",
        "created_by": {
          "id": 1,
          "username": "procurement",
          "first_name": "Procurement"
        },
        "created_at": "2025-01-20T10:00:00Z"
      }
    ]
  }
}
```

#### Get Purchase Order Details
```http
GET /api/suppliers/purchase-orders/{id}/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "po_number": "PO-2025-001234",
    "supplier": {
      "id": 1,
      "name": "TechDistributor SA",
      "contact_person": "John Smith",
      "email": "orders@techdistributor.co.za"
    },
    "status": "approved",
    "status_display": "Approved",
    "order_date": "2025-01-20T10:00:00Z",
    "expected_delivery": "2025-01-30T00:00:00Z",
    "delivery_address": {
      "street": "789 Warehouse Road",
      "city": "Cape Town",
      "province": "Western Cape",
      "postal_code": "7500",
      "country": "ZA"
    },
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Samsung Galaxy S24",
          "sku": "SAM-S24-128GB"
        },
        "supplier_sku": "TECH-SAM-S24-128",
        "quantity": 50,
        "unit_cost": "12000.00",
        "total_cost": "600000.00",
        "received_quantity": 0,
        "notes": "Bulk order discount applied"
      }
    ],
    "subtotal": "600000.00",
    "tax_amount": "90000.00",
    "shipping_cost": "500.00",
    "total": "690500.00",
    "currency": "ZAR",
    "payment_terms": "30_days",
    "notes": "Urgent order for stock replenishment",
    "created_by": {
      "id": 1,
      "username": "procurement",
      "first_name": "Procurement"
    },
    "approved_by": {
      "id": 2,
      "username": "manager",
      "first_name": "Manager"
    },
    "status_history": [
      {
        "status": "draft",
        "timestamp": "2025-01-20T10:00:00Z",
        "user": "procurement",
        "notes": "PO created"
      },
      {
        "status": "approved",
        "timestamp": "2025-01-20T11:30:00Z",
        "user": "manager",
        "notes": "PO approved for processing"
      }
    ]
  }
}
```

#### Create Purchase Order
```http
POST /api/suppliers/purchase-orders/
```

**Request Body:**
```json
{
  "supplier_id": 1,
  "expected_delivery": "2025-02-15",
  "delivery_address": {
    "street": "789 Warehouse Road",
    "city": "Cape Town",
    "province": "Western Cape",
    "postal_code": "7500",
    "country": "ZA"
  },
  "items": [
    {
      "product_id": 1,
      "quantity": 25,
      "unit_cost": "12000.00",
      "supplier_sku": "TECH-SAM-S24-128"
    }
  ],
  "notes": "Regular stock replenishment"
}
```

#### Update Purchase Order Status
```http
PUT /api/suppliers/purchase-orders/{id}/status/
```

**Request Body:**
```json
{
  "status": "approved",
  "notes": "Approved for immediate processing"
}
```

### Supplier Products

#### List Supplier Products
```http
GET /api/suppliers/{supplier_id}/products/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Samsung Galaxy S24",
        "sku": "SAM-S24-128GB"
      },
      "supplier_sku": "TECH-SAM-S24-128",
      "supplier_name": "Samsung Galaxy S24 128GB",
      "cost_price": "12000.00",
      "minimum_order_quantity": 10,
      "lead_time_days": 7,
      "is_preferred": true,
      "last_cost_update": "2025-01-15T10:00:00Z",
      "availability_status": "in_stock"
    }
  ]
}
```

#### Add Product to Supplier
```http
POST /api/suppliers/{supplier_id}/products/
```

**Request Body:**
```json
{
  "product_id": 2,
  "supplier_sku": "TECH-IPHONE-15-PRO",
  "supplier_name": "iPhone 15 Pro 128GB",
  "cost_price": "18000.00",
  "minimum_order_quantity": 5,
  "lead_time_days": 14
}
```

### Supplier Performance

#### Get Supplier Performance
```http
GET /api/suppliers/{id}/performance/
```

**Query Parameters:**
- `period` - Time period: `month`, `quarter`, `year`
- `date_from` - Custom start date
- `date_to` - Custom end date

**Response:**
```json
{
  "success": true,
  "data": {
    "supplier_id": 1,
    "period": "2024-Q4",
    "metrics": {
      "total_orders": 45,
      "total_value": "1247392.50",
      "on_time_delivery_rate": 95.5,
      "quality_rating": 4.3,
      "average_response_time_hours": 2.5,
      "defect_rate": 0.8,
      "invoice_accuracy": 98.2
    },
    "trends": {
      "delivery_performance": [
        {"month": "2024-10", "rate": 94.2},
        {"month": "2024-11", "rate": 96.1},
        {"month": "2024-12", "rate": 95.8}
      ],
      "cost_trends": [
        {"month": "2024-10", "average_cost": "12150.00"},
        {"month": "2024-11", "average_cost": "12000.00"},
        {"month": "2024-12", "average_cost": "11950.00"}
      ]
    },
    "issues": [
      {
        "date": "2024-12-15",
        "type": "late_delivery",
        "description": "PO-2024-005678 delivered 2 days late",
        "impact": "medium"
      }
    ]
  }
}
```

### Supplier Invoices

#### List Supplier Invoices
```http
GET /api/suppliers/invoices/
```

#### Create Invoice
```http
POST /api/suppliers/invoices/
```

**Request Body:**
```json
{
  "supplier_id": 1,
  "purchase_order_id": 1,
  "invoice_number": "INV-TECH-2025-001",
  "invoice_date": "2025-01-25",
  "due_date": "2025-02-24",
  "items": [
    {
      "purchase_order_item_id": 1,
      "quantity": 50,
      "unit_cost": "12000.00"
    }
  ],
  "tax_amount": "90000.00",
  "total": "690000.00"
}
```

### Supplier Communications

#### List Communications
```http
GET /api/suppliers/{supplier_id}/communications/
```

#### Create Communication Log
```http
POST /api/suppliers/{supplier_id}/communications/
```

**Request Body:**
```json
{
  "type": "email",
  "subject": "Order Status Inquiry",
  "content": "Following up on PO-2025-001234 delivery status",
  "contact_person": "John Smith",
  "direction": "outbound"
}
```

## Purchase Order Status Flow

```
draft → pending → approved → sent → acknowledged → 
partially_received → received → invoiced → paid → closed
```

## Supplier Rating System

Suppliers are rated on a 5-star scale based on:
- **On-time delivery** (40% weight)
- **Product quality** (30% weight)
- **Communication** (20% weight)
- **Pricing competitiveness** (10% weight)

## Error Codes

| Code | Description |
|------|-------------|
| `SUPPLIER_NOT_FOUND` | Supplier does not exist |
| `PO_NOT_FOUND` | Purchase order does not exist |
| `INVALID_STATUS_TRANSITION` | Cannot change to specified status |
| `INSUFFICIENT_APPROVAL_LEVEL` | User cannot approve this PO value |
| `DUPLICATE_SUPPLIER_CODE` | Supplier code already exists |
| `INVALID_PAYMENT_TERMS` | Payment terms not supported |

## Examples

### Create Purchase Order Flow
```bash
# 1. Get supplier products
curl -X GET http://localhost:8000/api/suppliers/1/products/ \
  -H "Authorization: Bearer <token>"

# 2. Create purchase order
curl -X POST http://localhost:8000/api/suppliers/purchase-orders/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": 1,
    "items": [{"product_id": 1, "quantity": 25, "unit_cost": "12000.00"}]
  }'

# 3. Approve purchase order
curl -X PUT http://localhost:8000/api/suppliers/purchase-orders/1/status/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```
