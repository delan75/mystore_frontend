# Core API Documentation

## Overview

The Core API provides shared utilities, base functionality, and common services used across all MyStore applications. It includes system settings, notifications, logging, and utility endpoints.

## Base URL
`/api/core/`

## Authentication

Most endpoints require authentication. System-level operations require admin privileges.

## Endpoints

### System Information

#### Get System Status
```http
GET /api/core/system/status/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "2.1.0",
    "environment": "production",
    "database": {
      "status": "connected",
      "connections": 15,
      "max_connections": 100
    },
    "cache": {
      "status": "connected",
      "hit_rate": 94.5,
      "memory_usage": "256 MB"
    },
    "storage": {
      "total_space": "500 GB",
      "used_space": "234 GB",
      "free_space": "266 GB",
      "usage_percentage": 46.8
    },
    "services": {
      "celery_worker": "running",
      "celery_beat": "running",
      "email_service": "running",
      "search_engine": "running"
    },
    "uptime": "15 days, 4 hours, 23 minutes",
    "last_deployment": "2025-01-15T10:00:00Z"
  }
}
```

#### Get System Health
```http
GET /api/core/system/health/
```

#### Get System Metrics
```http
GET /api/core/system/metrics/
```

**Query Parameters:**
- `period` - Time period: `hour`, `day`, `week`
- `metric` - Specific metric: `cpu`, `memory`, `disk`, `network`

### Application Settings

#### List Settings
```http
GET /api/core/settings/
```

**Query Parameters:**
- `category` - Filter by category
- `search` - Search in key or description

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "key": "SITE_NAME",
      "value": "MyStore",
      "category": "general",
      "description": "Name of the website",
      "data_type": "string",
      "is_public": true,
      "is_editable": true,
      "default_value": "MyStore",
      "validation_rules": {
        "max_length": 100,
        "required": true
      },
      "updated_by": {
        "id": 1,
        "username": "admin"
      },
      "updated_at": "2025-01-20T10:00:00Z"
    }
  ]
}
```

#### Get Setting Value
```http
GET /api/core/settings/{key}/
```

#### Update Setting
```http
PUT /api/core/settings/{key}/
```

**Request Body:**
```json
{
  "value": "MyStore - South Africa's Premier Online Store"
}
```

#### Bulk Update Settings
```http
POST /api/core/settings/bulk-update/
```

**Request Body:**
```json
{
  "settings": [
    {
      "key": "SITE_NAME",
      "value": "MyStore SA"
    },
    {
      "key": "SITE_DESCRIPTION",
      "value": "South Africa's leading e-commerce platform"
    }
  ]
}
```

### Notifications

#### List Notifications
```http
GET /api/core/notifications/
```

**Query Parameters:**
- `unread` - Filter unread notifications (true/false)
- `type` - Filter by type
- `priority` - Filter by priority: `low`, `normal`, `high`, `urgent`

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 45,
    "unread_count": 12,
    "results": [
      {
        "id": 1,
        "title": "System Maintenance Scheduled",
        "message": "System maintenance is scheduled for tonight at 2 AM",
        "type": "system",
        "priority": "high",
        "is_read": false,
        "action_url": "/admin/maintenance/",
        "expires_at": "2025-01-25T23:59:59Z",
        "created_at": "2025-01-20T14:30:00Z"
      }
    ]
  }
}
```

#### Create Notification
```http
POST /api/core/notifications/
```

**Request Body:**
```json
{
  "title": "New Feature Available",
  "message": "Check out our new inventory management features",
  "type": "feature",
  "priority": "normal",
  "recipients": [1, 2, 3],
  "action_url": "/inventory/",
  "expires_at": "2025-02-01T00:00:00Z"
}
```

#### Mark as Read
```http
PUT /api/core/notifications/{id}/read/
```

#### Mark All as Read
```http
PUT /api/core/notifications/mark-all-read/
```

### Activity Logs

#### List Activity Logs
```http
GET /api/core/activity-logs/
```

**Query Parameters:**
- `user` - Filter by user ID
- `action` - Filter by action type
- `model` - Filter by model name
- `date_from` - Start date filter
- `date_to` - End date filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "username": "admin",
        "first_name": "Admin"
      },
      "action": "create",
      "model": "Product",
      "object_id": 123,
      "object_repr": "Samsung Galaxy S24",
      "changes": {
        "name": ["", "Samsung Galaxy S24"],
        "price": ["", "15999.00"]
      },
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0...",
      "timestamp": "2025-01-20T14:30:00Z"
    }
  ]
}
```

#### Get Activity Details
```http
GET /api/core/activity-logs/{id}/
```

### File Management

#### List Files
```http
GET /api/core/files/
```

#### Upload File
```http
POST /api/core/files/upload/
```

**Request Body (multipart/form-data):**
```
file: <file_data>
category: "documents"
description: "System documentation"
```

#### Download File
```http
GET /api/core/files/{id}/download/
```

#### Delete File
```http
DELETE /api/core/files/{id}/
```

### Cache Management

#### Get Cache Stats
```http
GET /api/core/cache/stats/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hit_rate": 94.5,
    "miss_rate": 5.5,
    "total_keys": 15847,
    "memory_usage": "256 MB",
    "max_memory": "512 MB",
    "evicted_keys": 234,
    "expired_keys": 567
  }
}
```

#### Clear Cache
```http
POST /api/core/cache/clear/
```

**Request Body:**
```json
{
  "pattern": "product_*",
  "confirm": true
}
```

#### Warm Cache
```http
POST /api/core/cache/warm/
```

### Search

#### Global Search
```http
GET /api/core/search/
```

**Query Parameters:**
- `q` - Search query
- `models` - Limit search to specific models
- `limit` - Number of results per model

**Response:**
```json
{
  "success": true,
  "data": {
    "query": "samsung",
    "total_results": 156,
    "results": {
      "products": [
        {
          "id": 1,
          "title": "Samsung Galaxy S24",
          "description": "Latest Samsung smartphone",
          "url": "/products/1/",
          "score": 0.95
        }
      ],
      "orders": [
        {
          "id": 123,
          "title": "Order #ORD-2025-001234",
          "description": "Order containing Samsung products",
          "url": "/orders/123/",
          "score": 0.78
        }
      ]
    }
  }
}
```

#### Search Suggestions
```http
GET /api/core/search/suggestions/
```

**Query Parameters:**
- `q` - Partial search query
- `limit` - Number of suggestions

### Utilities

#### Generate UUID
```http
GET /api/core/utils/uuid/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

#### Validate Data
```http
POST /api/core/utils/validate/
```

**Request Body:**
```json
{
  "data_type": "email",
  "value": "user@example.com"
}
```

#### Generate QR Code
```http
POST /api/core/utils/qr-code/
```

**Request Body:**
```json
{
  "data": "https://mystore.com/product/123",
  "size": 200,
  "format": "png"
}
```

### Maintenance

#### Maintenance Mode
```http
GET /api/core/maintenance/status/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "is_maintenance_mode": false,
    "scheduled_maintenance": {
      "start_time": "2025-01-25T02:00:00Z",
      "end_time": "2025-01-25T04:00:00Z",
      "description": "Database optimization"
    }
  }
}
```

#### Enable Maintenance Mode
```http
POST /api/core/maintenance/enable/
```

**Request Body:**
```json
{
  "message": "System maintenance in progress",
  "estimated_duration": 120,
  "allowed_ips": ["192.168.1.100"]
}
```

#### Disable Maintenance Mode
```http
POST /api/core/maintenance/disable/
```

### Background Tasks

#### List Tasks
```http
GET /api/core/tasks/
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "task-uuid-123",
      "name": "process_orders",
      "status": "running",
      "progress": 75,
      "started_at": "2025-01-20T14:00:00Z",
      "estimated_completion": "2025-01-20T14:30:00Z",
      "result": null,
      "error": null
    }
  ]
}
```

#### Get Task Status
```http
GET /api/core/tasks/{task_id}/
```

#### Cancel Task
```http
POST /api/core/tasks/{task_id}/cancel/
```

### System Configuration

#### Get Configuration
```http
GET /api/core/config/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "features": {
      "multi_warehouse": true,
      "advanced_analytics": true,
      "seo_management": true,
      "api_access": true
    },
    "limits": {
      "max_products": 50000,
      "max_orders_per_day": 10000,
      "max_file_size": 104857600,
      "api_rate_limit": 1000
    },
    "integrations": {
      "payment_gateways": ["payfast", "stripe"],
      "shipping_providers": ["courier_guy", "postnet"],
      "email_service": "postmark",
      "sms_service": "clickatell"
    }
  }
}
```

#### Update Configuration
```http
PUT /api/core/config/
```

## Error Handling

### Global Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field_name": ["Field-specific error message"]
    },
    "timestamp": "2025-01-20T14:30:00Z",
    "request_id": "req-uuid-123"
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `AUTHENTICATION_REQUIRED` | Authentication is required |
| `PERMISSION_DENIED` | Insufficient permissions |
| `VALIDATION_ERROR` | Request validation failed |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMIT_EXCEEDED` | Rate limit exceeded |
| `MAINTENANCE_MODE` | System in maintenance mode |
| `INTERNAL_ERROR` | Internal server error |

## Rate Limiting

### Default Limits
- **Authenticated users**: 1000 requests/hour
- **Anonymous users**: 100 requests/hour
- **Admin operations**: 2000 requests/hour

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Retry-After: 3600
```

## Examples

### System Health Check
```bash
# Check system status
curl -X GET http://localhost:8000/api/core/system/status/ \
  -H "Authorization: Bearer <token>"

# Get cache statistics
curl -X GET http://localhost:8000/api/core/cache/stats/ \
  -H "Authorization: Bearer <token>"

# Global search
curl -X GET "http://localhost:8000/api/core/search/?q=samsung&limit=5" \
  -H "Authorization: Bearer <token>"
```
