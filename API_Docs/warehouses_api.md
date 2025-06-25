# Warehouses API Documentation

## Overview

The Warehouses API manages warehouse operations, locations, staff, and inventory distribution for the MyStore platform.

## Base URL
`/api/warehouses/`

## Authentication

All endpoints require authentication with staff or admin privileges.

## Endpoints

### Warehouse Management

#### List Warehouses
```http
GET /api/warehouses/
```

**Query Parameters:**
- `status` - Filter by status: `active`, `inactive`, `maintenance`
- `type` - Filter by type: `main`, `distribution`, `fulfillment`, `returns`
- `region` - Filter by region
- `search` - Search in name, code, address

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Cape Town Main Warehouse",
      "code": "CPT-MAIN-001",
      "type": "main",
      "status": "active",
      "address": {
        "street": "123 Industrial Road",
        "suburb": "Montague Gardens",
        "city": "Cape Town",
        "province": "Western Cape",
        "postal_code": "7500",
        "country": "ZA"
      },
      "contact": {
        "phone": "+27214567890",
        "email": "cpt.warehouse@mystore.co.za",
        "manager": "John Smith"
      },
      "capacity": {
        "total_space_sqm": 5000,
        "used_space_sqm": 3200,
        "utilization_percentage": 64.0,
        "max_products": 50000,
        "current_products": 32000
      },
      "operating_hours": {
        "monday": "08:00-17:00",
        "tuesday": "08:00-17:00",
        "wednesday": "08:00-17:00",
        "thursday": "08:00-17:00",
        "friday": "08:00-17:00",
        "saturday": "08:00-13:00",
        "sunday": "closed"
      },
      "services": ["receiving", "storage", "picking", "packing", "shipping"],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Warehouse Details
```http
GET /api/warehouses/{id}/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Cape Town Main Warehouse",
    "code": "CPT-MAIN-001",
    "type": "main",
    "status": "active",
    "description": "Primary distribution center for Western Cape region",
    "address": {
      "street": "123 Industrial Road",
      "suburb": "Montague Gardens",
      "city": "Cape Town",
      "province": "Western Cape",
      "postal_code": "7500",
      "country": "ZA",
      "coordinates": {
        "latitude": -33.8567,
        "longitude": 18.5108
      }
    },
    "contact": {
      "phone": "+27214567890",
      "email": "cpt.warehouse@mystore.co.za",
      "manager": "John Smith",
      "assistant_manager": "Jane Doe"
    },
    "capacity": {
      "total_space_sqm": 5000,
      "used_space_sqm": 3200,
      "available_space_sqm": 1800,
      "utilization_percentage": 64.0,
      "max_products": 50000,
      "current_products": 32000,
      "storage_zones": [
        {
          "zone": "A",
          "type": "electronics",
          "capacity": 15000,
          "current": 9500
        },
        {
          "zone": "B",
          "type": "general",
          "capacity": 20000,
          "current": 12800
        }
      ]
    },
    "staff": [
      {
        "id": 1,
        "name": "John Smith",
        "role": "manager",
        "email": "john.smith@mystore.co.za",
        "phone": "+27821234567"
      }
    ],
    "equipment": [
      {
        "type": "forklift",
        "count": 3,
        "status": "operational"
      },
      {
        "type": "scanner",
        "count": 15,
        "status": "operational"
      }
    ],
    "performance_metrics": {
      "orders_processed_today": 156,
      "average_pick_time_minutes": 12.5,
      "accuracy_rate": 99.2,
      "on_time_shipment_rate": 96.8
    }
  }
}
```

#### Create Warehouse
```http
POST /api/warehouses/
```

**Request Body:**
```json
{
  "name": "Johannesburg Distribution Center",
  "code": "JHB-DIST-001",
  "type": "distribution",
  "address": {
    "street": "456 Logistics Avenue",
    "city": "Johannesburg",
    "province": "Gauteng",
    "postal_code": "2000",
    "country": "ZA"
  },
  "contact": {
    "phone": "+27115551234",
    "email": "jhb.warehouse@mystore.co.za",
    "manager": "Mike Johnson"
  },
  "capacity": {
    "total_space_sqm": 8000,
    "max_products": 75000
  }
}
```

#### Update Warehouse
```http
PUT /api/warehouses/{id}/
```

#### Delete Warehouse
```http
DELETE /api/warehouses/{id}/
```

### Warehouse Operations

#### Get Warehouse Inventory
```http
GET /api/warehouses/{id}/inventory/
```

**Query Parameters:**
- `category` - Filter by product category
- `low_stock` - Show only low stock items (true/false)
- `search` - Search products

**Response:**
```json
{
  "success": true,
  "data": {
    "warehouse_id": 1,
    "total_products": 1247,
    "total_value": "12847392.50",
    "low_stock_items": 23,
    "out_of_stock_items": 5,
    "products": [
      {
        "product_id": 1,
        "product_name": "Samsung Galaxy S24",
        "sku": "SAM-S24-128GB",
        "quantity": 125,
        "reserved_quantity": 15,
        "available_quantity": 110,
        "location": "A-12-03",
        "reorder_level": 20,
        "last_movement": "2025-01-20T14:30:00Z"
      }
    ]
  }
}
```

#### Update Product Location
```http
PUT /api/warehouses/{warehouse_id}/inventory/{product_id}/location/
```

**Request Body:**
```json
{
  "location": "B-15-07",
  "notes": "Moved to better accessible location"
}
```

### Warehouse Zones

#### List Warehouse Zones
```http
GET /api/warehouses/{id}/zones/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "zone_code": "A",
      "name": "Electronics Zone",
      "type": "electronics",
      "capacity": 15000,
      "current_stock": 9500,
      "utilization": 63.3,
      "temperature_controlled": true,
      "security_level": "high"
    }
  ]
}
```

#### Create Zone
```http
POST /api/warehouses/{id}/zones/
```

### Warehouse Staff

#### List Warehouse Staff
```http
GET /api/warehouses/{id}/staff/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user": {
        "id": 5,
        "username": "john.smith",
        "first_name": "John",
        "last_name": "Smith",
        "email": "john.smith@mystore.co.za"
      },
      "role": "manager",
      "department": "operations",
      "shift": "day",
      "start_date": "2024-01-15",
      "is_active": true,
      "permissions": ["inventory_management", "staff_supervision"]
    }
  ]
}
```

#### Add Staff Member
```http
POST /api/warehouses/{id}/staff/
```

**Request Body:**
```json
{
  "user_id": 6,
  "role": "picker",
  "department": "fulfillment",
  "shift": "day",
  "permissions": ["inventory_view", "order_picking"]
}
```

### Warehouse Tasks

#### List Tasks
```http
GET /api/warehouses/{id}/tasks/
```

**Query Parameters:**
- `status` - Filter by status: `pending`, `in_progress`, `completed`, `cancelled`
- `type` - Filter by type: `receiving`, `picking`, `packing`, `shipping`, `counting`
- `assigned_to` - Filter by assigned staff member

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "task_number": "TASK-2025-001234",
      "type": "picking",
      "status": "in_progress",
      "priority": "high",
      "order_id": 123,
      "assigned_to": {
        "id": 2,
        "name": "Jane Picker"
      },
      "items": [
        {
          "product_id": 1,
          "product_name": "Samsung Galaxy S24",
          "quantity": 2,
          "location": "A-12-03",
          "picked_quantity": 1
        }
      ],
      "estimated_duration": 15,
      "actual_duration": null,
      "created_at": "2025-01-20T10:00:00Z",
      "started_at": "2025-01-20T10:15:00Z"
    }
  ]
}
```

#### Create Task
```http
POST /api/warehouses/{id}/tasks/
```

#### Update Task Status
```http
PUT /api/warehouses/{warehouse_id}/tasks/{task_id}/status/
```

**Request Body:**
```json
{
  "status": "completed",
  "notes": "All items picked successfully",
  "completion_time": "2025-01-20T10:30:00Z"
}
```

### Warehouse Reports

#### Performance Report
```http
GET /api/warehouses/{id}/reports/performance/
```

**Query Parameters:**
- `period` - Time period: `day`, `week`, `month`
- `date_from` - Custom start date
- `date_to` - Custom end date

**Response:**
```json
{
  "success": true,
  "data": {
    "warehouse_id": 1,
    "period": "week",
    "metrics": {
      "orders_processed": 1247,
      "items_picked": 3456,
      "items_packed": 3421,
      "items_shipped": 3398,
      "average_pick_time": 12.5,
      "average_pack_time": 8.3,
      "accuracy_rate": 99.2,
      "productivity_score": 87.5
    },
    "staff_performance": [
      {
        "staff_id": 2,
        "name": "Jane Picker",
        "tasks_completed": 156,
        "accuracy_rate": 99.8,
        "productivity_score": 92.1
      }
    ],
    "daily_breakdown": [
      {
        "date": "2025-01-20",
        "orders": 178,
        "accuracy": 99.1
      }
    ]
  }
}
```

#### Inventory Report
```http
GET /api/warehouses/{id}/reports/inventory/
```

#### Capacity Report
```http
GET /api/warehouses/{id}/reports/capacity/
```

### Warehouse Analytics

#### Dashboard Data
```http
GET /api/warehouses/{id}/analytics/dashboard/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "current_status": {
      "active_staff": 23,
      "pending_tasks": 45,
      "orders_in_progress": 67,
      "capacity_utilization": 64.0
    },
    "today_metrics": {
      "orders_processed": 156,
      "items_shipped": 423,
      "accuracy_rate": 99.2,
      "on_time_rate": 96.8
    },
    "alerts": [
      {
        "type": "low_stock",
        "message": "23 products below reorder level",
        "severity": "warning"
      }
    ],
    "recent_activities": [
      {
        "timestamp": "2025-01-20T14:30:00Z",
        "activity": "Order ORD-2025-001234 shipped",
        "user": "Jane Packer"
      }
    ]
  }
}
```

### Bulk Operations

#### Bulk Update Locations
```http
POST /api/warehouses/{id}/bulk/update-locations/
```

**Request Body:**
```json
{
  "updates": [
    {
      "product_id": 1,
      "new_location": "A-15-08"
    },
    {
      "product_id": 2,
      "new_location": "B-10-05"
    }
  ]
}
```

#### Import Warehouse Data
```http
POST /api/warehouses/{id}/import/
```

**Request Body (multipart/form-data):**
```
csv_file: <warehouse_data.csv>
import_type: "inventory_locations"
```

## Warehouse Types

| Type | Description |
|------|-------------|
| `main` | Primary distribution center |
| `distribution` | Regional distribution hub |
| `fulfillment` | Order fulfillment center |
| `returns` | Returns processing center |
| `cross_dock` | Cross-docking facility |

## Task Types

| Type | Description |
|------|-------------|
| `receiving` | Receiving incoming inventory |
| `putaway` | Storing received items |
| `picking` | Picking items for orders |
| `packing` | Packing picked items |
| `shipping` | Preparing shipments |
| `counting` | Inventory counting |
| `returns` | Processing returns |

## Error Codes

| Code | Description |
|------|-------------|
| `WAREHOUSE_NOT_FOUND` | Warehouse does not exist |
| `INSUFFICIENT_CAPACITY` | Warehouse at capacity |
| `INVALID_LOCATION` | Storage location invalid |
| `TASK_NOT_FOUND` | Task does not exist |
| `STAFF_NOT_AUTHORIZED` | Staff member not authorized |
| `ZONE_NOT_FOUND` | Warehouse zone does not exist |

## Examples

### Warehouse Operations Flow
```bash
# 1. Get warehouse details
curl -X GET http://localhost:8000/api/warehouses/1/ \
  -H "Authorization: Bearer <token>"

# 2. Check inventory
curl -X GET http://localhost:8000/api/warehouses/1/inventory/?low_stock=true \
  -H "Authorization: Bearer <token>"

# 3. Create picking task
curl -X POST http://localhost:8000/api/warehouses/1/tasks/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "picking",
    "order_id": 123,
    "assigned_to": 2,
    "priority": "high"
  }'

# 4. Update task status
curl -X PUT http://localhost:8000/api/warehouses/1/tasks/1/status/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```
