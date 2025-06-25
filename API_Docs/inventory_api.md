# Inventory API Documentation

## Overview

The Inventory API manages stock levels, inventory tracking, stock movements, and warehouse operations for the MyStore platform.

## Base URL
`/api/inventory/`

## Authentication

All endpoints require authentication. Most operations require staff or admin privileges.

## Endpoints

### Stock Management

#### Get Product Stock
```http
GET /api/inventory/stock/{product_id}/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "product_name": "Samsung Galaxy S24",
    "sku": "SAM-S24-128GB",
    "total_stock": 125,
    "available_stock": 98,
    "reserved_stock": 15,
    "damaged_stock": 2,
    "stock_status": "in_stock",
    "reorder_level": 20,
    "reorder_quantity": 50,
    "warehouses": [
      {
        "warehouse_id": 1,
        "warehouse_name": "Cape Town Main",
        "stock_quantity": 75,
        "available_quantity": 60,
        "reserved_quantity": 10,
        "damaged_quantity": 1
      },
      {
        "warehouse_id": 2,
        "warehouse_name": "Johannesburg Hub",
        "stock_quantity": 50,
        "available_quantity": 38,
        "reserved_quantity": 5,
        "damaged_quantity": 1
      }
    ],
    "last_updated": "2025-01-20T14:30:00Z"
  }
}
```

#### Update Stock Level
```http
PUT /api/inventory/stock/{product_id}/
```

**Request Body:**
```json
{
  "warehouse_id": 1,
  "quantity": 100,
  "movement_type": "adjustment",
  "reason": "Stock count correction",
  "reference": "ADJ-2025-001"
}
```

#### Bulk Stock Update
```http
POST /api/inventory/stock/bulk-update/
```

**Request Body:**
```json
{
  "updates": [
    {
      "product_id": 1,
      "warehouse_id": 1,
      "quantity": 50,
      "movement_type": "restock",
      "reason": "New delivery"
    },
    {
      "product_id": 2,
      "warehouse_id": 1,
      "quantity": 25,
      "movement_type": "restock",
      "reason": "New delivery"
    }
  ]
}
```

### Stock Movements

#### List Stock Movements
```http
GET /api/inventory/movements/
```

**Query Parameters:**
- `product_id` - Filter by product
- `warehouse_id` - Filter by warehouse
- `movement_type` - Filter by movement type
- `date_from` - Start date filter
- `date_to` - End date filter
- `reference` - Filter by reference number

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 245,
    "results": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Samsung Galaxy S24",
          "sku": "SAM-S24-128GB"
        },
        "warehouse": {
          "id": 1,
          "name": "Cape Town Main"
        },
        "movement_type": "sale",
        "quantity": -2,
        "previous_quantity": 100,
        "new_quantity": 98,
        "reason": "Order #ORD-2025-001234",
        "reference": "ORD-2025-001234",
        "created_by": {
          "id": 1,
          "username": "admin",
          "first_name": "Admin"
        },
        "created_at": "2025-01-20T14:30:00Z"
      }
    ]
  }
}
```

#### Create Stock Movement
```http
POST /api/inventory/movements/
```

**Request Body:**
```json
{
  "product_id": 1,
  "warehouse_id": 1,
  "movement_type": "adjustment",
  "quantity": 5,
  "reason": "Found additional stock",
  "reference": "ADJ-2025-002"
}
```

### Stock Reservations

#### Reserve Stock
```http
POST /api/inventory/reservations/
```

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "warehouse_id": 1
    }
  ],
  "reference": "ORD-2025-001235",
  "expires_at": "2025-01-21T14:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reservation_id": "RES-2025-001",
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "warehouse_id": 1,
        "reserved": true
      }
    ],
    "expires_at": "2025-01-21T14:30:00Z"
  }
}
```

#### Release Reservation
```http
DELETE /api/inventory/reservations/{reservation_id}/
```

#### List Reservations
```http
GET /api/inventory/reservations/
```

### Low Stock Alerts

#### Get Low Stock Items
```http
GET /api/inventory/low-stock/
```

**Query Parameters:**
- `warehouse_id` - Filter by warehouse
- `threshold` - Custom threshold (default: reorder_level)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product_id": 3,
      "product_name": "iPhone 15 Pro",
      "sku": "APPLE-IP15P-128GB",
      "current_stock": 15,
      "reorder_level": 20,
      "reorder_quantity": 30,
      "warehouse": {
        "id": 1,
        "name": "Cape Town Main"
      },
      "days_of_stock": 7,
      "status": "low_stock"
    }
  ]
}
```

#### Set Reorder Levels
```http
PUT /api/inventory/reorder-levels/{product_id}/
```

**Request Body:**
```json
{
  "reorder_level": 25,
  "reorder_quantity": 50,
  "warehouse_id": 1
}
```

### Stock Transfers

#### Create Stock Transfer
```http
POST /api/inventory/transfers/
```

**Request Body:**
```json
{
  "from_warehouse_id": 1,
  "to_warehouse_id": 2,
  "items": [
    {
      "product_id": 1,
      "quantity": 10
    }
  ],
  "reason": "Rebalancing stock",
  "notes": "Moving excess stock to JHB"
}
```

#### List Stock Transfers
```http
GET /api/inventory/transfers/
```

#### Update Transfer Status
```http
PUT /api/inventory/transfers/{transfer_id}/status/
```

**Request Body:**
```json
{
  "status": "completed",
  "notes": "Transfer completed successfully"
}
```

### Inventory Valuation

#### Get Inventory Value
```http
GET /api/inventory/valuation/
```

**Query Parameters:**
- `warehouse_id` - Filter by warehouse
- `category_id` - Filter by product category
- `valuation_method` - Method: `fifo`, `lifo`, `average`

**Response:**
```json
{
  "success": true,
  "data": {
    "total_value": "12847392.50",
    "total_units": 15847,
    "average_unit_value": "810.45",
    "valuation_method": "fifo",
    "by_warehouse": [
      {
        "warehouse_id": 1,
        "warehouse_name": "Cape Town Main",
        "value": "8547392.50",
        "units": 10234
      }
    ],
    "by_category": [
      {
        "category_id": 1,
        "category_name": "Electronics",
        "value": "9847392.50",
        "units": 8234
      }
    ],
    "calculated_at": "2025-01-20T14:30:00Z"
  }
}
```

### Stock Audits

#### Create Stock Audit
```http
POST /api/inventory/audits/
```

**Request Body:**
```json
{
  "warehouse_id": 1,
  "audit_type": "full",
  "scheduled_date": "2025-01-25",
  "notes": "Monthly stock audit"
}
```

#### Submit Audit Count
```http
POST /api/inventory/audits/{audit_id}/counts/
```

**Request Body:**
```json
{
  "counts": [
    {
      "product_id": 1,
      "counted_quantity": 98,
      "system_quantity": 100,
      "notes": "2 units missing"
    }
  ]
}
```

#### Complete Audit
```http
PUT /api/inventory/audits/{audit_id}/complete/
```

### Inventory Reports

#### Stock Report
```http
GET /api/inventory/reports/stock/
```

**Query Parameters:**
- `format` - Report format: `json`, `csv`, `xlsx`
- `warehouse_id` - Filter by warehouse
- `category_id` - Filter by category
- `include_zero_stock` - Include out-of-stock items

#### Movement Report
```http
GET /api/inventory/reports/movements/
```

**Query Parameters:**
- `date_from` - Start date
- `date_to` - End date
- `movement_type` - Filter by movement type
- `format` - Report format

#### ABC Analysis
```http
GET /api/inventory/reports/abc-analysis/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis_date": "2025-01-20",
    "period_days": 90,
    "categories": {
      "A": {
        "percentage_items": 20,
        "percentage_value": 80,
        "items": [
          {
            "product_id": 1,
            "product_name": "Samsung Galaxy S24",
            "value_contribution": "15.2",
            "category": "A"
          }
        ]
      },
      "B": {
        "percentage_items": 30,
        "percentage_value": 15,
        "items": []
      },
      "C": {
        "percentage_items": 50,
        "percentage_value": 5,
        "items": []
      }
    }
  }
}
```

### Batch Operations

#### Batch Stock Adjustment
```http
POST /api/inventory/batch/adjustment/
```

**Request Body (multipart/form-data):**
```
csv_file: <stock_adjustments.csv>
warehouse_id: 1
reason: "Monthly stock count"
```

#### Import Stock Data
```http
POST /api/inventory/import/
```

**Request Body (multipart/form-data):**
```
csv_file: <stock_data.csv>
import_type: "stock_levels"
```

## Stock Movement Types

| Type | Description |
|------|-------------|
| `sale` | Stock sold to customer |
| `return` | Customer return |
| `restock` | New stock received |
| `adjustment` | Manual stock adjustment |
| `transfer_out` | Stock transferred to another warehouse |
| `transfer_in` | Stock received from another warehouse |
| `damage` | Stock marked as damaged |
| `theft` | Stock lost to theft |
| `expired` | Stock expired/obsolete |

## Stock Status Values

| Status | Description |
|--------|-------------|
| `in_stock` | Available for sale |
| `low_stock` | Below reorder level |
| `out_of_stock` | No stock available |
| `discontinued` | Product discontinued |
| `pre_order` | Available for pre-order |

## Error Codes

| Code | Description |
|------|-------------|
| `INSUFFICIENT_STOCK` | Not enough stock available |
| `PRODUCT_NOT_FOUND` | Product does not exist |
| `WAREHOUSE_NOT_FOUND` | Warehouse does not exist |
| `INVALID_MOVEMENT_TYPE` | Movement type not supported |
| `RESERVATION_EXPIRED` | Stock reservation has expired |
| `TRANSFER_NOT_FOUND` | Stock transfer does not exist |
| `AUDIT_IN_PROGRESS` | Cannot modify stock during audit |

## Examples

### Stock Management Flow
```bash
# 1. Check current stock
curl -X GET http://localhost:8000/api/inventory/stock/1/ \
  -H "Authorization: Bearer <token>"

# 2. Add new stock
curl -X PUT http://localhost:8000/api/inventory/stock/1/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "warehouse_id": 1,
    "quantity": 50,
    "movement_type": "restock",
    "reason": "New delivery"
  }'

# 3. Reserve stock for order
curl -X POST http://localhost:8000/api/inventory/reservations/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"product_id": 1, "quantity": 2, "warehouse_id": 1}],
    "reference": "ORD-2025-001235"
  }'
```
